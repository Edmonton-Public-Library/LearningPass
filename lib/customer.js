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

 // The customer object manages checking if the customer is
 // * well-formed, the JSON contains all the fields specified 
 // in the customer's config.
 // * valid, the data are reasonable values.
 
const customerHelper = {};
 // Where we log errors, warnings, and what went wrong.
const customerErrors = {
  "messages" : []
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
 */
customerHelper.clean = function(key,value){
  // @TODO lookup each type of possible field, but required and possibly optional fields.
  /** @TODO pass in the partners config before uncommenting getGender() etc. */
  if (key && value) {
    if (key === 'firstName') return helpers.getFirstName(value);
    if (key === 'lastName') return helpers.getLastName(value);
    // @TODO create this to test for reasonable past date.
    // if (key === 'dob') return customerHelper.getDOB(value);
    // if (key === 'gender') return customerHelper.getGender(value);
    if (key === 'email') return helpers.getEmail(value);
    if (key === 'phone') return helpers.getPhone(value);
    if (key === 'street') return helpers.getStreet(value);
    // @TODO add check for reasonable city-ness strings.
    if (key === 'city') return customerHelper.getCity(value);
    // @TODO add check for reasonable province/state-ness strings.
    // if (key === 'province') return customerHelper.getProvince(value);
    // @TODO add check for reasonable country-ness strings.
    // if (key === 'country') return customerHelper.getCountry(value);
    if (key === 'postalCode') return helpers.getPostalCode(value);
    // @TODO get from imported list of barcodes.
    // @TODO include logic to add prefixes if required.
    // if (key === 'barcode') return customerHelper.getBarcode(value);
    // @TODO This should include logic to create a password
    // if one is not provided, that is, hash some value like
    // what had to happen for Horizon libraries with ME libraries.
    // if (key === 'pin') return customerHelper.getPassword(value);
    // @TODO add this here!
    // if (key === 'type') return customerHelper.getType(value);
    // @TODO create this to test for future date.
    // if (key === 'expiry') return customerHelper.getExpiry(value);
    // if (key === 'branch') return customerHelper.getBranch(value);
    // @TODO create this
    // if (key === 'status') return customerHelper.getStatus(value);
    // @TODO create this to check for special handling in notes.
    // if (key === 'notes') return customerHelper.checkNoteTokens(value);
  } else {
    return '';
  }
};

/**
 * Looks for a defined string value in partner defaults.
 * @param {*} str field to look for in defaults.
 * @param {*} partnerConfig where to start looking. Must be non-empty dictionary.
 */
customerHelper._getDefault = function(str,partnerConfig){
  if (helpers.hasStringData(str)){
    if (helpers.hasDictData(partnerConfig)){
      let _defaults = partnerConfig.defaults;
      if (helpers.hasDictData(_defaults)) {
        if(helpers.hasStringData(_defaults[str])){
          return _defaults[str];
        } else {

          // One last try to see if there are library defaults.
          let lpSettings = environment.getDefaultCustomerSettings();
          _defaults = lpSettings.defaults;
          if (helpers.hasDictData(_defaults)) {
            return helpers.hasStringData(_defaults[str]) ? _defaults[str] : '';
          }
        }
      }
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
  if (!helpers.hasStringData(str.trim())){
    return '';
  }
  // Get the partner's genderMap from their config, but it is optional.
  let city = helpers.getCity(str);
  if (helpers.hasStringData(city)){
    return city;
  } else {
    
    // to get here we don't have a city string and it is not optional
    // but is there a default? Check the partnerConfig, then the config.json.
    return customerHelper._getDefault("city",partnerConfig);

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
  if (!helpers.hasStringData(str.trim())){
    return '';
  }
  // Get the partner's genderMap from their config, but it is optional.
  let gMap = partnerConfig.genderMap;
  let gender = str.trim().toUpperCase();
  if(helpers.hasDictData(gMap)){
    if(helpers.hasStringData(gMap[gender])){
      return gMap[gender];
    } else {
      // check for a default.
      return customerHelper._getDefault("gender",partnerConfig);
    }
  }
  return '';
};


/**
 * Test that the customer has all required fields, and that the fields have
 * valid data.
 * @param {*} custErr The customer errors object.
 * @param {*} cust customer object as received from the partner.
 * @param {*} required - array of required fields the partner has promised
 * to send with each customer.
 * @TODO write tests.
 */
customerHelper.validate = (custErr,cust,required) => new Promise((resolves, rejects) => {
  if (!custErr){
    throw new Error('A customerErrors object is required when calling validate().');
  }
  if (!cust){
    throw new Error('A customer json object is required when calling validate().');
  }
  
  // Check each field against the required fields.
  let requiredList = helpers.hasArrayData(required) ? required : undefined;
  if (typeof(requiredList) === 'undefined'){
    custErr.messages.push('expected required fields from partner config but got none.');
    rejects(custErr);
  }
  // Check each of the required fields.
  // This will throw an exception if reqed wasn't provided or isn't an array.
  for (i = 0; i < requiredList.length; i++){
    let field = requiredList[i];
    let cleanData = customerHelper.clean(field, cust[field]);
    if (cleanData) {
      cust[field] = cleanData;
    } else {
      custErr.messages.push(`"${field}" missing or invalid`);
    }
  }
  if (custErr.messages.length > 0) {
    rejects(custErr);
  }
  resolves(cust);
});

/**
 * Adds defaults (if possible), from the library configuration
 * and then tests if the customer data has all required fields.
 * 
 * Partner defaults take precedence over library defaults.
 * 
 * @param {*} errors Error reporting.
 * @param {*} cust customer object as received from the partner.
 * @param {*} partnerConfig partner configuration object from the partner.json.
 * @returns customer data ready for outputting to a flat file,
 * or false if the customer does not have required fields.
 */
customerHelper.addDefaults = (errors,cust,partnerConfig) => new Promise((resolves,rejects) => {
  /** @TODO finish me */
});

module.exports = {customerErrors, customerHelper};