/**
 * This file data.js contains utility functions for Learning Pass.
 * 
 * Copyright 2021 Andrew Nisbet
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


const { rejects } = require('assert');
const environment = require('../config');
const helpers = require('./helpers');

 // The customerHelpers functions.
const customerHelper = {};


 // Where we log errors, warnings, and what went wrong.
const customerErrors = {
  brokenFields : [],
  messages : []
};

 // A complete customer looks like this:
 /**
  [{   
    "firstName": "Andrew",
    "lastName": "Nisbet", 
    "dob": "19740822", 
    "gender": "", 
    "email": "example@gmail.com", 
    "phone": "780-555-1212", 
    "street": "11535 74 Ave.", 
    "city": "Edmonton", 
    "province": "AB", 
    "country": "", 
    "postalCode": "T6G0G9",
    "barcode": "21221012345678",    	
    "pin": "IlikeBread",    	
    "type": "MAC-DSSTUD",    	
    "expiry": "20210822",    	
    "branch": "",    	
    "status": "OK",    	
    “notes": "" 
  }] 
  */

/**
 * Creates a valid set of customer data to the library, and its
 * partner's agreed definition of complete, and rejects the account
 * creation request otherwise.
 * @param {*} apiKey assumes a non-empty string API key parameter.
 * @param {*} rawData assumes a customer JSON object with data.
 */
customerHelper.createAccount = (custErr,apiKey,rawData) => new Promise((resolves,rejects) => {
  

  // With the API key we can lookup the fields the partner's config
  // which is what they have commited to sending.
  let pc = environment.getPartnerConfig(apiKey);

  custErr.status = 200; // this may change if something goes wrong.
  // Check each of the required fields.
  customerHelper.validate(custErr,rawData,pc.required)
    .then(console.log('finished checking customer'))
    .then(console.log(`adding default values`))
    .then((custErr,rawData,pc) => {
      customerHelper.addDefaults(custErr,rawData,pc);
    })
    .then(console.log(`creating flat file...`))
    /** @TODO create this function. */
    // .then(customerHelper.createFlatFile(custErr,rawData))
    .catch(`Error processing customer: ${custErr.messages}`);
    // .catch((custErr,rawData) => {
    //   /** @TODO write this function and test. */
    //   customerHelper.writeFailedAccount(custErr,rawData);
    //   // Write out the error object.
    //   /** @TODO add customer id for easier lookup */
    //   console.log("Errors: ",custErr.messages);
    // });

});

/**
 * Cleans data in customer fields, and reports all errors in data.
 * @param {*} key - named data field string.
 * @param {*} value  - value for a given key-pair.
 * @param {*} pc - partner.json settings.
 */
customerHelper.clean = function(key,value,pc){
  // @TODO lookup each type of possible field, but required and possibly optional fields.
  if (key) {
    if (key === 'firstName') return helpers.getFirstName(value);
    if (key === 'lastName') return helpers.getLastName(value);
    if (key === 'dob') return customerHelper.getDOB(value,pc);
    if (key === 'gender') return customerHelper.getGender(value,pc);
    if (key === 'email') return helpers.getEmail(value);
    if (key === 'phone') return helpers.getPhone(value);
    if (key === 'street') return helpers.getStreet(value);
    if (key === 'city') return customerHelper.getCity(value,pc);
    if (key === 'province') return customerHelper.getProvince(value,pc);
    if (key === 'country') return customerHelper.getCountry(value,pc);
    if (key === 'postalCode') return helpers.getPostalCode(value);
    // @TODO get from imported list of barcodes.
    // @TODO include logic to add prefixes if required.
    // if (key === 'barcode') return customerHelper.getBarcode(value);
    // @TODO This should include logic to create a password
    // if one is not provided, that is, hash some value like
    // what had to happen for Horizon libraries with ME libraries.
    // if (key === 'pin') return customerHelper.getPassword(value);
    if (key === 'type') return customerHelper.getType(value,pc);
    // if (key === 'expiry') return customerHelper.getExpiry(value,pc);
    // if (key === 'branch') return customerHelper.getBranch(value);
    // @TODO create this
    // if (key === 'status') return customerHelper.getStatus(value);
    // @TODO create this to check for special handling in notes.
    // if (key === 'notes') return customerHelper.checkNoteTokens(value);
  }
  return '';
};

/**
 * Test if a date is between 1 and 99 years in the past.
 * 
 * @param {*} str possible date string.
 * @returns A date object of the string if valid, 
 * and an empty string otherwise.
 */
customerHelper.getDOB = function(str,partnerConfig){
  if (helpers.hasDateData(str)){
    let dob = new Date(str);
    // if the supplied date is in the past it could be a birthdate.
    let minAge = 1;
//     if (helpers.hasStringData(partnerConfig.age.minimum)){
//       minAge = partnerConfig.age.minimum;
//     }
//     let maxAge = 99;
//     if (helpers.hasStringData(partnerConfig.age.maximum)){
//       maxAge = partnerConfig.age.maximum;
//     }
//     let daysAndYears = helpers.daysYearsFromToday(dob);
//     // daysYearsFromToday returns neg. values for the past.
//     if (daysAndYears.years < 0) { 
//       if (Math.abs(daysAndYears.years) >= minAge && 
//           Math.abs(daysAndYears.years) <= maxAge)
//       {
//         return dob;
//       } else {
//         console.log(`Error expected customer age between ${minAge} and ${maxAge} years but got `,Math.abs(daysAndYears.years));
//       }
//     } else {
//       console.log('Error, customer birthday is in the future.');
//     }
//   } else {
//     console.log(`Error, customer birthday is not a date "${str}".`);
  }
  return '';
}

/**
 * Figures out what profile to give this type of customer.
 * 
 * There are five ways to tell Learning Pass what profile to assign. 
 * 1) Partner includes a 'profileType' tag. If the entry is blank...
 * 2) Look up in partner default setttings in the typeProfile object if any,...
 * 3) Look up in the library default settings or...
 * The next two are done when the flat file is compiled. 
 * See flat.js for more information.
 * 4) Define it in the partner's 'flatDefaults', and finally...
 * 5) Define it in the library's 'flatDefaults' as last resort.
 * @param {*} str type sent from the partner organization. Case sensitive.
 * @param {*} partnerConfig partner.json configuration settings.
 */
customerHelper.getType = function(str,partnerConfig){
  if (!helpers.hasStringData(str)){
    // Did not receive type from the partner, but did they
    // or the library request a default?
    return customerHelper._getFromDefault("typeProfiles",partnerConfig);
  }
  // Get the partner's genderMap from their config, and do a lookup
  // for the passed-str. But genderMap is optional.
  if (helpers.hasDictData(partnerConfig)){
    let typeMap = partnerConfig.typeProfiles;
    if (helpers.hasDictData(typeMap)){
      let type = str;
      if (helpers.hasStringData(typeMap[type])){
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
  if (helpers.hasStringData(str)){
    return helpers.capitalize(str);
  } else {
    return customerHelper._getFromDefault("country",partnerConfig);
  }
};

/**
 * Do your best to clean or get from defaults of either the partner or library.
 * @param {*} str string of the province field.
 * @param {*} partnerConfig partner.json settings.
 */
customerHelper.getProvince = function(str,partnerConfig){
  if (helpers.hasStringData(str)){
    return helpers.capitalize(str);
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
 */
customerHelper._getFromDefault = function(str,partnerConfig){
  if (! helpers.hasStringData(str)){
    return '';
  }
  if (helpers.hasDictData(partnerConfig) && helpers.hasDictData(partnerConfig.defaults)){
    let _defaults = partnerConfig.defaults;
    if (helpers.hasDictData(_defaults)) {
      if(helpers.hasStringData(_defaults[str])){
        return _defaults[str];
      } 
    }
  }
  // One last try to see if there are library defaults.
  let librarySettings = environment.getDefaultCustomerSettings();
  if (helpers.hasDictData(librarySettings) && helpers.hasDictData(librarySettings.defaults)){
    let _defaults = librarySettings.defaults;
    if (helpers.hasDictData(_defaults)) {
      return helpers.hasStringData(_defaults[str]) ? _defaults[str] : '';
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
  if (helpers.hasStringData(str)){
    helpers.capitalize(str);
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
  if (!helpers.hasStringData(str)){
    // Did not receive gender from the partner, but did they
    // or the library request a default?
    return customerHelper._getFromDefault("gender",partnerConfig);
  }
  // Get the partner's genderMap from their config, and do a lookup
  // for the passed-str. But genderMap is optional.
  if (helpers.hasDictData(partnerConfig)){
    let gMap = partnerConfig.genderMap;
    if (helpers.hasDictData(gMap)){
      let gender = str.toUpperCase();
      if (helpers.hasStringData(gMap[gender])){
        return gMap[gender];
      }
    }
  }
  return '';
};


/**
 * Test that the customer has all required fields, and that the fields have
 * valid data.
 * @param {*} custErr The customer errors object.
 * @param {*} customer customer object as received from the partner.
 * @param {*} partnerConfig - array of required fields the partner has promised
 * to send with each customer.
 */
customerHelper.validate = (custErr,customer,partnerConfig) => new Promise((resolves, rejects) => {
  if (!custErr){
    throw new Error('A customerErrors object is required when calling validate().');
  }
  if (!customer){
    throw new Error('A customer json object is required when calling validate().');
  }
  
  // Check optional fields. If the library has indicated that a field is always
  // optional it will be checked and either cleaned, or partner defaults added.
  // if the partner does not specify defaults for these fields, the library's 
  // are added as a kind-of last resort.
  // Doing this first may fill in blank fields that will stop the registration
  // when required fields are checked.
  customerHelper.checkOptionalFields(customer,partnerConfig);

  // Do the library's optonal fields first. This is the minimal set
  // of data that the library requires to create even a brief record.
  let libraryCustomerSettings = environment.getDefaultCustomerSettings();
  let allRequired = [];


  // Get all the library's required fields.
  let libraryRequired = libraryCustomerSettings.required;
  if (helpers.hasArrayData(libraryRequired)){
    for (let i = 0; i < libraryRequired.length; i++) {
      if (allRequired.indexOf(libraryRequired[i]) < 0){
        allRequired.push(libraryRequired[i]);
      }
    }
  }


  // Check the partners required fields (if any).
  let partnerRequired = partnerConfig.required;
  // Check if there are partner required.
  if (helpers.hasArrayData(partnerRequired)){
    for (let i = 0; i < partnerRequired.length; i++) {
      if (allRequired.indexOf(partnerRequired[i]) < 0){
        allRequired.push(partnerRequired[i]);
      }
    }
  }



  // Check each of the partner required fields.
  if (helpers.hasArrayData(allRequired)){
    for (let i = 0; i < allRequired.length; i++){
      let field = allRequired[i];
      let cleanData = customerHelper.clean(field,customer[field],partnerConfig);
      if (helpers.hasStringData(cleanData)) {
        customer[field] = cleanData;
      } else {
        custErr.brokenFields.push(`${field}`);
      }
    }
    // If there were problems above stop account creation process.
    if (custErr.brokenFields.length > 0) {
      custErr.messages.push(`${libraryCustomerSettings.library} registration requires valid data in these fields:`);
      custErr.brokenFields.forEach(field => {
        custErr.messages.push(`"${field}" `);
      });
      rejects(custErr);
    }
  } else {
    throw new Error('Error: no fields were marked as required.');
  }


  resolves(customer);
});


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
customerHelper.checkOptionalFields = function(customer,partnerConfig){
  if (!customer){ return; }
  
  // Do the library's optonal fields first. The partner's takes precedence,
  // and will add to, or overwrite what the library has set as optional.
  let defSet = environment.getDefaultCustomerSettings();
  let optional = [];
  let libraryOptional = defSet.optional;
  if (helpers.hasArrayData(libraryOptional)){
    for (let i = 0; i < libraryOptional.length; i++) {
      if (optional.indexOf(libraryOptional[i]) < 0){
        optional.push(libraryOptional[i]);
      }
    }
  }

  // Add the unique values from the partner configs.
  let partnerOptional = partnerConfig.optional;
  // Check if there are partner optional.
  if (helpers.hasArrayData(partnerOptional)){
    for (let i = 0; i < partnerOptional.length; i++) {
      if (optional.indexOf(partnerOptional[i]) < 0){
        optional.push(partnerOptional[i]);
      }
    }
  }
  
  
  // Check each of the partner optional fields.
  if (helpers.hasArrayData(optional)){
    for (let i = 0; i < optional.length; i++){
      let field = optional[i];
      let cleanData = customerHelper.clean(field,customer[field],partnerConfig);
      if (cleanData) {
        customer[field] = cleanData;
      }
    }
  }

  
};

module.exports = {customerErrors, customerHelper};