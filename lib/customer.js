/**
 * This file customer.js contains utility functions for Learning Pass.
 * 
 * Copyright 2022 Andrew Nisbet, Edmonton Public Library
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
 'use strict';

const environment = require('../config');
const helpers = require('./helpers');
const dateHelpers = require('./date');
const flat = require('./flat');
const utils = require('./util');
const barcodeHelper = require('../lib/barcodes');
const registrationStatus = require('../lib/response');
const logger = require('../logger');

 // The customerHelpers functions.
const customerHelper = {};

/**
 * Creates a valid set of customer data to the library, and its
 * partner's agreed definition of complete, and rejects the account
 * creation request otherwise.
 * @param {*} apiKey assumes a non-empty string API key parameter.
 * @param {*} customer assumes a customer JSON object with data.
 */
customerHelper.createAccount = function(apiKey,customer) {
  // Response object is in the global scope during testing. Flush 
  // previous results. This should be cleaned up so it is not 
  let response  = registrationStatus();
  let flatFile  = flat();

  // With the API key we can lookup the fields the partner's config
  // which is what they have committed to sending.
  let pc = environment.getPartnerConfig(apiKey);
  if (Object.keys(pc).length === 0) {
    // And if there is no partner config, then no registration.
    response.setStatus('apiKeyProblem');
    return response;
  }

  // Process customer file before fields are validated, because the validation process
  // can wipe out information as it replaces 'types' with 'profiles' thus losing any
  // chance to apply user categories based on input types.
  this.checkNoteTokens(customer,pc);

  // Check each of the required fields.
  let failedFields = [];
  failedFields = customerHelper.validate(customer,pc);
  if (failedFields.length > 0) {
    failedFields.forEach(element => {
      response.setStatus('incomplete', element);
    });
  }
  if (response.hasErrors()) {
    logger.error(`Error ${pc.name} send bad data: ${response.getMessages()}`);
    return response;
  }
      

  // Merge fields, like 'City, Province' if specified in configuration.
  this.mergeFields(customer,pc);

  // create flat file.
  response.setCustomerId(customer['barcode']);
  let flatCust = flatFile.toFlatCustomer(customer,pc.flatDefaults);
  let filePath = environment.getFlatDir();
  let fileName = filePath + '/' + this._getFileName(customer['barcode']);
  if (flatFile.writeFlat(flatCust,fileName)) {
    logger.info(`Wrote to '${fileName}'`);
    environment.useLoopbackMode() ? response.setStatus('accepted') : response.setStatus('success');
  } else {
    logger.error(`Error writing flat data: ${fileName}::`,flatCust);
    response.setStatus('internalError');
  }
  logger.info(`== end createAccount ${customer['barcode']} ==`);

  return response;
};

/**
 * Returns an appropriate file extension for the flat file. Normally that 
 * would be '.flat', but if the server is in loopback mode the extension 
 * is '.flat.wait'. This prevents the pipeline from loading it until the 
 * ILS is back online.
 */
customerHelper._getFileName = function(customerId) {
  let fileNameExtension = `${customerId}.flat`;
  if (environment.useLoopbackMode()) {
    logger.warn(`Server in loopback mode. ${customerId}.flat.offline won't load until the extension is changed to '.flat'.`);
    fileNameExtension = `${fileNameExtension}.offline`;
  } 
  if (environment.useTestMode()) {
    logger.warn(`Server in test mode. ${customerId}.flat.test won't load until the extension is changed to '.flat'.`);
    fileNameExtension = `${fileNameExtension}.test`;
  }
  return fileNameExtension;
}

/**
 * Cleans data in customer fields, and reports all errors in data.
 * @param {*} key - named data field string.
 * @param {*} value  - value for a given key-pair.
 * @param {*} pc - partner.json settings.
 */
customerHelper.clean = function(key,value,pc){
  
  if (key) {
    if (key === 'firstName') return pc.strictChecks ? helpers.getFirstName(value) : value;
    if (key === 'middleName') return pc.strictChecks ? helpers.getMiddleName(value) : value;
    if (key === 'lastName') return pc.strictChecks ? helpers.getLastName(value) : value;
    if (key === 'dob') return customerHelper.getDOB(value,pc);
    if (key === 'gender') return customerHelper.getGender(value,pc);
    if (key === 'email') return helpers.getEmail(value);
    if (key === 'phone') return helpers.getPhone(value);
    if (key === 'street') return pc.strictChecks ? helpers.getStreet(value) : value;
    if (key === 'city') return customerHelper.getCity(value,pc);
    if (key === 'province') return customerHelper.getProvince(value,pc);
    /** No such field in our ILS currently. */
    if (key === 'country') return customerHelper.getCountry(value,pc);
    if (key === 'postalCode') return helpers.getPostalCode(value);
    if (key === 'barcode') return customerHelper.getBarcode(value,pc);
    if (key === 'pin') return customerHelper.getPassword(value,environment.getDefaultCustomerSettings());
    if (key === 'type') return customerHelper.getType(value,pc);
    if (key === 'expiry') return customerHelper.getExpiry(value,pc);
    if (key === 'branch') return customerHelper.getBranch(value,environment.getDefaultCustomerSettings());
    if (key === 'status') return customerHelper.getStatus(value,pc);
    if (key === 'careOf') return pc.strictChecks ? customerHelper.getCareOf(value,pc) : value;
  }
  return '';
};

/**
 * Under normal conditions the note field is a reserved field and any data
 * in it is added as a note to the customer's account. 
 * 
 * "notes" : {
 *  "require" : "/foo/bar.js"
 * } 
 * 
 * Using the example above, the user can extend Learning Pass by writing
 * a Node.js set of functions in '/foo/bar.js' and then calling 
 * notes.compile(note,{}).
 * 
 * bar.js must have an object that implements and exports compile(string,dictionary)
 * as a promise.
 * 
 * Tests:
 * Notes sent but partner has not 'notes' object; return note string unchanged.
 * Notes sent partner has 'notes' object; return result of executing function(note,callback).
 * Notes sent partner but notes.compile() fails. return notes field, log error.
 * 
 * @param {*} customer note string from customer account.
 * @param {*} partnerConfig partner configuration object.
 */
customerHelper.checkNoteTokens = function(customer,partnerConfig){
  let notesObject = partnerConfig.notes;
  if (utils.hasDictData(notesObject)) {
    try {
      const noteCompiler = require(notesObject.require);
      noteCompiler.compile(customer);
    } catch(err) {
      logger.error(`Require failed while trying to load '${notesObject.require}'`);
    }
  }
};

/**
 * Maps pre-defined partner values to valid Symphony statuses. 
 * 
 * If the partner has no statusMap, the default of 'OK' is used
 * and any supplied value is ignored. If the partner has a 
 * statusMap, the customer's status is converted to a Symphony
 * status before creating the customer's account.
 * 
 * Tests:
 * Customer has no status field; return default status 'OK'.
 * Customer has status, partner has no map; return 'OK'.
 * Customer has invalid status in partner map; return 'OK'
 * Customer has valid status in partner map; return status.
 * 
 * "statusMap" : {
        "GOOD" : "OK",
        "BAD" : "DELINQUENT",
        "UGLY" : "BLOCKED"
    }
 * 
 * @param {*} str status from partner organization.
 * @param {*} partnerConfig where to start looking for definitions
 * to check.
 */
customerHelper.getStatus = function(str,partnerConfig){
  if (!utils.hasStringData(str)) return 'OK';
  // if the partner has a statusMap look up this status.
  let statusMap = partnerConfig.statusMap;
  if (utils.hasDictData(statusMap)) {
    return typeof(statusMap[str]) === 'string' ? statusMap[str] : 'OK';
  } 
  return 'OK';
};

/**
 * Fills in the default branch for the customer.
 * 
 * Tests:
 * Library has no settings, customer has no preference return ''.
 * Library has default, customer has no preference return library default.
 * Customer has a non-valid preference: return library default.
 * Customer has a valid preference: return customer preference.
 * @param {*} str customer's preferred branch.
 * @param {*} config library config preferences.
 */
customerHelper.getBranch = function(str,config) {
  let branches;
  if (utils.hasStringData(str)) {
    let cBranch = str.trim().toUpperCase();
    branches = config.branch.valid;
    if (utils.hasArrayData(branches)) {
      for (let i = 0; i < branches.length; i++) {
        if (branches[i] === cBranch){
          return branches[i];
        }
      }
    } 
  }

  // check if there is a 'branch' entry in the config.json.
  if (!utils.hasDictData(config.branch)) return '';
  let defaultBranch = config.branch.default;
  return utils.hasStringData(defaultBranch) ? defaultBranch : '';

};


/**
 * Searches for a named dictionary within the configuration json files.
 * _getDict() prefers dictionaries in the partner configuration and will
 * return them first, but will also return the library's config dictionary
 * as last resort.
 * 
 * @param {*} dictName string name of the dictionary in either the config.json
 * or in the partner.json.
 * @param {*} partnerConfig starts with the customer's config, but failing 
 * that checks the library's config.json.
 * @returns the named dictionary found in either the library config or 
 * the partner's config and undefined otherwise.
 */
customerHelper._getDict = function(dictName,partnerConfig){
  let partDict = partnerConfig[dictName];
  if (!utils.hasDictData(partDict)) {
    // get the defaults from the library config if possible.
    let libCustomerSettings = environment.getDefaultCustomerSettings();
    return libCustomerSettings[dictName];
  } else {
    return partDict;
  }
};


/**
 * Computes the customer's expiry date. If the customer account has an expiry
 * date in the future, it is returned as a new date. If the field is blank
 * Learning Pass does it's best to figure out expiry following these rules.
 * 
 * If the partner has an 'expiry' object that defines a 'date', that value
 * is checked and if the value is 'NEVER', that gets returned, otherwise
 * the string converted into a date and returned.
 * 
 * If the 'expiry' has a 'days' entry, the number of days in the future 
 * is computed and returned.
 * @example
  * "expiry" : { 
    "days": 365,
    == or ==  
    "date" : "2021-08-22" 
    == or == 
    "date" : "NEVER"
  }
 * Test: 
 * Library default days, date, and date='NEVER': return value.
 * Partner default days, date, and date='NEVER': return value.
 * No defaults but has date. return Date if in the future.
 * No defaults no date: return ''
 * @param {*} str 
 * @param {*} partnerConfig where to start looking for the expiry object's
 * definition.
 * @returns date object of the input string, a date object of the partner's
 * preferred expiry date or days or 'NEVER', and an empty string otherwise.
 */
customerHelper.getExpiry = function(str,partnerConfig){
  // Customer specifically requests a date of expiry.
  if (dateHelpers.hasDateData(str)) {
    let cExDate = dateHelpers.stringToDate(str);
    if (dateHelpers.compareToday(cExDate) >= 0) {
      return dateHelpers.dateToString(cExDate);
    }
  }

  /**
   * If date is in the past fall through and see if 
   * there are defaults in either config files.
   */
  let expiryMap = customerHelper._getDict("expiry",partnerConfig);
  if (expiryMap) {
    if (expiryMap.days) {
      // This could return a date in the past if a negative number is found 
      // in the 'days' entry.
      return dateHelpers.getDateFromDays(expiryMap.days);
    } 
    if (expiryMap.date) {
      // check date is in the future and return.
      return expiryMap.date.toUpperCase() === 'NEVER' ? "NEVER" : dateHelpers.stringToDate(expiryMap.date);
    }
  }
  /* Refuse to create customer with no expiry. */
  return '';
};

/**
 * Checks password matches expected params defined in 'passwords' object.
 * 
 * "passwords" : {
        "minimum" : 4,
        "maximum" : 14,
        "regex" : "^\\d{4}$",
        "passwordToPin" : true
    }
  
 * @param {*} str customer's password as a string.
 * @param {*} libConfig library's configurations (not partner's).
 * @returns The customer's password if it met specifications and an
 * empty string otherwise.
 */
customerHelper.getPassword = function(str,libConfig){
  
  if (!utils.hasStringData(str)) {
    return '';
  }
  /**
   * "passwords" : {
        "minimum" : 4,
        "maximum" : 14,
        "regex" : "^\\d{4}$",
        "passwordToPin" : true
    }
   */
  
  let passConfig = libConfig.passwords;
  if (!passConfig || !utils.hasDictData(passConfig)){
    return helpers.getPassword(str);
  } else {
    let min = utils.hasPosIntData(passConfig.minimum) ? passConfig.minimum : 4;
    let max = utils.hasPosIntData(passConfig.maximum) ? passConfig.maximum : 125;
    let regex = utils.hasStringData(passConfig.regex) ? new RegExp(`${passConfig.regex}`) : undefined;
    let passToPin = typeof(passConfig.passwordToPin) === 'boolean' ? passConfig.passwordToPin : false;
    
    // Check the password length
    if (min && str.length >= min && max && str.length <= max) {
      if (passToPin){
        // Check if it is already a four-digit PIN
        return str.match(/^\d{4}$/) ? str : `${helpers.getFourDigitPin(str)}`;
      } else {
        return helpers.getPassword(str,regex);
      }
    } else {
      logger.error(`Error invalid password '${str}'`);
      return '';
    }
  }
};

/**
 * Tests the string from the barcode field and checks, augments,
 * and / or replaces it depending on information in the
 * barcodeDefinition object.
 * 
 * NOTE: min and max represent min and max width the partner organization
 * can send, and does not take into account any prefix that may be specified.
 * Failing to account for total width may exceed library expectations
 * for maximum width of a barcode.
 * 
 * @param {*} str Inbound barcode, which could be blank if the partner
 * wants to use a library barcode.
 * @param {*} partnerConfig configuration preferences for the customer's
 * partner organization. Must be tested to exist.
 * @example 
 * "barcodes" : {
        "prefix" : "21221800",
        "regex" : "",
        "minimum" : 13,
        "maximum" : 14
    }
 */
customerHelper.getBarcode = function(str,partnerConfig){
  let min = 4;
  let max = 125;
  let prefix = '';
  let myPCMap = new Map(Object.entries(partnerConfig));
  if (! myPCMap.has('barcodes')) {
    myPCMap = new Map(Object.entries(environment.getDefaultCustomerSettings()));
    if (! myPCMap.has('barcodes')) {
      return barcodeHelper.getBarcode(min,max,str);
    }
  }
  let bcObj = myPCMap.get('barcodes');
  min = bcObj.minimum;
  max = bcObj.maximum;
  prefix = bcObj.prefix;

  let verifiedBarcode = barcodeHelper.getBarcode(min,max,str,prefix);
  if (utils.hasStringData(verifiedBarcode)){
    return verifiedBarcode;
  } else {
    logger.error(`Error, barcode '${str}' + prefix (if any) exceed 'barcodes' specs.`);
    return '';
  }
};

/**
 * Test if a date is between age: {minimum: m, maximum: n} 
 * years in the past. Default for minimum and maximum
 * are 1 and 99 respectively if the partner.json does not 
 * include age restrictions.
 * 
 * @param {*} str possible date string.
 * @returns A date object of the string if valid, 
 * and an empty string otherwise.
 */
customerHelper.getDOB = function(str,partnerConfig){
  if (dateHelpers.hasDateData(str)){
    let dob = dateHelpers.stringToDate(str);


    // if the supplied date is in the past it could be a birth date.
    let minAge = 0;
    let maxAge = 120;
    if (utils.hasDictData(partnerConfig.age)){
      if (utils.hasIntData(partnerConfig.age.minimum)){
        if (Math.sign(partnerConfig.age.minimum) < 0){
          logger.warn(`Warning, age minimum is a negative value.`);
        }
        minAge = Math.abs(partnerConfig.age.minimum);
      }
      if (utils.hasIntData(partnerConfig.age.maximum)){
        if (Math.sign(partnerConfig.age.maximum) < 0){
          logger.warn(`Warning, age maximum is a negative value.`);
        }
        maxAge = Math.abs(partnerConfig.age.maximum);
      }
    }
    

    let daysAndYears = dateHelpers.daysAndYearsAgo(dob);
    // daysAndYearsAgo() returns positive values for the past.
    if (daysAndYears.years >= 0) { 
      if (daysAndYears.years >= minAge && daysAndYears.years <= maxAge) {
        return dateHelpers.dateToString(dob);
      } else {
        logger.error(`Error expected customer to be between '${minAge}' and '${maxAge}' but got: `,daysAndYears.years);
      }
    } else {
      logger.error(`Error, customer's birthday, (${str}) is in the future.`);
    }
  } else {
    logger.error(`Error, "${str}" is not a valid birth date.`);
  }
  return '';
};

/**
 * Figures out what profile to give this type of customer.
 * 
 * There are five ways to tell Learning Pass what profile to assign. 
 * 1) Partner includes a 'profileType' tag. If the entry is blank...
 * 2) Look up in partner default settings in the typeProfile object if any,...
 * 3) Look up in the library default settings or...
 * The next two are done when the flat file is compiled. 
 * See flat.js for more information.
 * 4) Define it in the partner's 'flatDefaults', and finally...
 * 5) Define it in the library's 'flatDefaults' as last resort.
 * @param {*} str type sent from the partner organization. Case sensitive.
 * @param {*} partnerConfig partner.json configuration settings.
 */
customerHelper.getType = function(str,partnerConfig){
  if (!utils.hasStringData(str)){
    // Did not receive type from the partner, but did they
    // or the library request a default?
    return customerHelper._getFromDefault("typeProfiles",partnerConfig);
  }
  // Get the partner's typeProfile from their config, and do a lookup
  // for the passed-str.
  if (utils.hasDictData(partnerConfig)){
    let typeMap = partnerConfig.typeProfiles;
    if (utils.hasDictData(typeMap)){
      let type = str;
      if (utils.hasStringData(typeMap[type])){
        return typeMap[type];
      }
    }
  }
  // There will be another chance that these will be defined by default in flat.js.
  return '';
};

/**
 * Tries its best to fill in the 'country' element on an account
 * by checking the partner, then library defaults.
 * @param {*} str string that may, or may not contain the country.
 * @param {*} partnerConfig partner.json configuration.
 */
customerHelper.getCountry = function(str,partnerConfig){
  if (utils.hasStringData(str)){
    return helpers.capitalize(str);
  } else {
    return customerHelper._getFromDefault("country",partnerConfig);
  }
};

/**
 * Get the data from the careOf tag, and add that to hte 'CARE/OF' field.
 * @param {*} str string that may, or may not contain the country.
 * @param {*} partnerConfig partner.json configuration.
 */
 customerHelper.getCareOf = function(str,partnerConfig){
  if (utils.hasStringData(str)){
    return helpers.capitalize(str);
  } else {
    return customerHelper._getFromDefault("careOf",partnerConfig);
  }
};

/**
 * Do your best to clean or get from defaults of either the partner or library.
 * @param {*} str string of the province field.
 * @param {*} partnerConfig partner.json settings.
 */
customerHelper.getProvince = function(str,partnerConfig){
  if (utils.hasStringData(str)){
    // Commonly supplied in a string like 'Edmonton,Ab'
    return str.indexOf(',') > -1 ? helpers.capitalize(this.splitCommaString(str,false)) : helpers.capitalize(str);
  } else {
    // to get here we don't have a province string and it is not optional
    // but is there a default? Check the partnerConfig, then the config.json.
    return customerHelper._getFromDefault("province",partnerConfig);
  }
};

/**
 * Looks for a defined string value in partner defaults, then searches the 
 * library's defaults as a last resort, but returns from the first one that 
 * matches. For example, if the field is 'a' = '', and the library says the
 * default for 'a' should be 'foo', but the partner specifies 'bar', the 
 * returned value will be 'a' = 'bar'. If the partner doesn't have an entry
 * for 'a', then 'a' = 'foo'.
 * @param {*} str field to look for in defaults.
 * @param {*} partnerConfig where to start looking. Must be non-empty dictionary.
 * @param {*} dictName string name of the dictionary object. Default 'defaults'.
 */
// customerHelper._getFromDefault = function(str,partnerConfig,dictName = 'defaults'){
customerHelper._getFromDefault = function(str,partnerConfig,dictName="defaults"){
  if (! utils.hasStringData(str)){
    return '';
  }
  if (utils.hasDictData(partnerConfig) && utils.hasDictData(partnerConfig[dictName])){
    let _defaults = partnerConfig[dictName];
    if (utils.hasDictData(_defaults)) {
      if(utils.hasStringData(_defaults[str])){
        return _defaults[str];
      } 
    }
  }
  // One last try to see if there are library defaults.
  let librarySettings = environment.getDefaultCustomerSettings();
  if (utils.hasDictData(librarySettings) && utils.hasDictData(librarySettings[dictName])){
    let _defaults = librarySettings[dictName];
    if (utils.hasDictData(_defaults)) {
      return utils.hasStringData(_defaults[str]) ? _defaults[str] : '';
    }
  }
  return '';
};

/**
 * Does its best to find a reasonable value for city in the argument string.
 * @param {*} str that may contain the customer's city.
 * @param {*} partnerConfig the partner organization's configuration json.
 */
customerHelper.getCity = function(str,partnerConfig){
  if (utils.hasStringData(str)){
    // Commonly supplied as 'city,province'.
    return helpers.capitalize(helpers.splitCommaString(str,true));
  } else {
    // to get here we don't have a city string and it is not optional
    // but is there a default? Check the partnerConfig, then the config.json.
    return customerHelper._getFromDefault("city",partnerConfig);
  }
};

/**
 * The arg str checked for an entry in the 'genderMap' dictionary, and 
 * populated. Comparisons are case-insensitive, that is 'male' = 'MALE'.
 * Returned strings are in the case they are defined as in partner.json.
 * 
 * @param {*} str A string value of gender.
 * @param {*} partnerConfig A dictionary of organization's gender definitions,
 * as the keys to the library's value.
 * @example { "MALE" : "M", "FEMALE" : "F", "NA" : "NA", "NONE" : "X" }
 * @returns The translation of the organization's gender to the library's 
 * definition, and an empty string if there was no mapping, the str was empty,
 * or the 'genderMap' object is not included in the partner.json file.
 */
customerHelper.getGender = function(str,partnerConfig){
  if (!utils.hasStringData(str)){
    // Did not receive gender from the partner, but did they
    // or the library request a default?
    return customerHelper._getFromDefault("gender",partnerConfig);
  }
  // Get the partner's genderMap from their config, and do a lookup
  // for the passed-str. But genderMap is optional.
  if (utils.hasDictData(partnerConfig)){
    let gMap = partnerConfig.genderMap;
    if (utils.hasDictData(gMap)){
      let gender = str.toUpperCase();
      if (utils.hasStringData(gMap[gender])){
        return gMap[gender];
      }
    }
  }
  return '';
};

/**
 * Look up fields and makes a single string out of them separated by
 * an optional string.
 * 
 * The fields dictionary describes which fields will be merged into
 * which tag. In the example below, the customer's 'city' field will
 * be replaced by the value in city and value in 'province' separated
 * by ', '. If the customer.city = 'Edmonton' and 
 * customer.province = 'AB' => customer.city = 'Edmonton, AB'.
 * 
 * Any number of fields can be concatenated to any field.
 * 
 * "merge" : {"delimiter" : ", ","fields" : {"city" : ["city","province"]}}
 * Tests:
 * Two or more defined fields and defined delimiter changes/adds field of 
 * merged string separated by the delimiter.
 * Two or more fields but delimiter undefined changes/adds field to
 * string with no breaks.
 * Two or more fields, any or all undefined changes/adds field to merged 
 * string, which may be empty.
 * 
 * @param {*} customer customer object.
 * @param {*} partnerConfig partner's config file.
 */
customerHelper.mergeFields = function(customer,partnerConfig) {
  let mergeDict = customerHelper._getDict('merge',partnerConfig);
  let delimiter = utils.hasStringData(mergeDict['delimiter']) ? mergeDict['delimiter'] : '';
  let fieldsDict = mergeDict['fields'];
  if (utils.hasDictData(fieldsDict)) {
    // for each field in the field dictionary concatenate the last to the 
    let myMergeFields = new Map(Object.entries(fieldsDict));
    for (let [mergee,merger] of myMergeFields) {
      let customerMergedFieldsArray = [];
      // You can merge from 0-n fields, but 2 is the most common. 0 and 1 fields are
      // allowed but don't make much sense.
      merger.forEach(field => {
        // Make sure we are not merging empty or undefined fields.
        if (utils.hasStringData(customer[field])) {
          customerMergedFieldsArray.push(customer[field]);
        }
      });
      // Add it to the customer even if it is not one of the standard field
      // names. This let's us make new fields in the flat file that don't 
      // exist in the incoming JSON fields. For example you can use
      // "fields" : { "USER_NAME" : ["lastName", "firstName"]} to add
      // '.USER_NAME.   |aSmith, John' to a flat file.
      customer[mergee] = customerMergedFieldsArray.join(delimiter);
    }
  }
};


/**
 * Test that the customer has all required fields, and that the fields have
 * valid data.
 * @param {*} customer customer object as received from the partner.
 * @param {*} partnerConfig - array of required fields the partner has promised
 * to send with each customer.
 */
customerHelper.validate = function(customer,partnerConfig) {
  
  let failedFields = [];
  // Check optional fields. If the library has indicated that a field is always
  // optional it will be checked and either cleaned, or partner defaults added.
  // if the partner does not specify defaults for these fields, the library's 
  // are added as a kind-of last resort.
  // Doing this first may fill in blank fields that will stop the registration
  // when required fields are checked.
  this.checkOptionalFields(customer,partnerConfig);

  // Do the library's optional fields first. This is the minimal set
  // of data that the library requires to create even a brief record.
  let libraryCustomerSettings = environment.getDefaultCustomerSettings();
  let allRequired = [];


  // Get all the library's required fields.
  let libraryRequired = libraryCustomerSettings.required;
  if (utils.hasArrayData(libraryRequired)){
    for (let i = 0; i < libraryRequired.length; i++) {
      if (allRequired.indexOf(libraryRequired[i]) < 0){
        allRequired.push(libraryRequired[i]);
      }
    }
  }


  // Check the partners required fields (if any).
  // Check if there are partner required.
  if (partnerConfig && utils.hasArrayData(partnerConfig.required)){
    for (let i = 0; i < partnerConfig.required.length; i++) {
      if (allRequired.indexOf(partnerConfig.required[i]) < 0){
        allRequired.push(partnerConfig.required[i]);
      }
    }
  }



  // Check each of the partner required fields.
  if (utils.hasArrayData(allRequired)){
    for (let i = 0; i < allRequired.length; i++){
      let field = allRequired[i];
      let cleanData = customerHelper.clean(field,customer[field],partnerConfig);
      if (utils.hasStringData(cleanData)) {
        customer[field] = cleanData;
      } else {
        //  ? response.setStatus('incomplete',`${field} is invalid`) : response.setStatus('incomplete',`${field}`);
        if (field === 'pin') {
          failedFields.push(`${field} is invalid`);
        } else {
          failedFields.push(`${field}`);
        }
      }
    }
  }
  return failedFields;
};


/**
 * Checks the fields that the library has declare as optional in 'optional' object in partner.json,
 * or ultimately, in the config.json's 'customerSettings'. If partner optional were sent,
 * and if it didn't have data, check for library optional, in that order, and 
 * check optional fields and clean them. But there are no wrong answers here
 * so if all the above don't pan out,
 * @param {*} customer Incoming customer json.
 * @param {*} partnerConfig Partner.json object which defaults is pulled from.
 * @returns resolves the customer's cleaned optional fields and return quietly otherwise.
 */
customerHelper.checkOptionalFields = function(customer,partnerConfig) {
  
  // Do the library's optional fields first. The partner's takes precedence,
  // and will add to, or overwrite what the library has set as optional.
  let defSet = environment.getDefaultCustomerSettings();
  let optional = [];
  let libraryOptional = defSet.optional;
  if (utils.hasArrayData(libraryOptional)){
    for (let i = 0; i < libraryOptional.length; i++) {
      if (optional.indexOf(libraryOptional[i]) < 0){
        optional.push(libraryOptional[i]);
      }
    }
  }

  // Add the unique values from the partner configs.
  // let partnerOptional = typeof(partnerConfig.optional) !== 'undefined' ? partnerConfig.optional : {};
  // Check if there are partner optional.
  if (partnerConfig && utils.hasArrayData(partnerConfig.optional)){
    for (let i = 0; i < partnerConfig.optional.length; i++) {
      if (optional.indexOf(partnerConfig.optional[i]) < 0){
        optional.push(partnerConfig.optional[i]);
      }
    }
  }
  
  
  // Check each of the partner optional fields.
  if (utils.hasArrayData(optional)){
    for (let i = 0; i < optional.length; i++){
      let field = optional[i];
      let cleanData = customerHelper.clean(field,customer[field],partnerConfig);
      if (cleanData) {
        customer[field] = cleanData;
      } else {
        if (field === 'pin') {
          logger.warn(`optional field ${field} was invalid. Got '${customer[field]}'.`);
        }
      }
    }
  }
};

module.exports = customerHelper;