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


const env = require('../config');
const helpers = require('./helpers');

 // The customer object manages checking if the customer is
 // * well-formed, the JSON contains all the fields specified 
 // in the customer's config.
 // * valid, the data are reasonable values.
 
const customerHelper = {};
 // Where we log errors, warnings, and what went wrong.
const customerErrors = {
  "errors" : 0,
  "warnings" : 0,
  "messages" : [],
  "status" : 200
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
 * @param {*} rawData assumes a customer JSON object.
 */
customerHelper.createAccount = (custErr,apiKey,rawData) => new Promise((resolves,rejects) => {
  

  // With the API key we can lookup the fields the partner is commited to send.
  let pc = env.getPartnerConfig(apiKey);
  if (! custErr || ! helpers.hasDictData(pc)){ 
    custErr.status = 500;
    custErr.errors += 1;
    custErr.messages.push('Error: server configuration.');
    return;
  }


  if (!apiKey || typeof(apiKey) != 'string' || apiKey.trim().length < 1){
    custErr.status = 401;
    custErr.errors += 1;
    custErr.messages.push('Error: invalid API key.');
    return;
  }

  
  let cleanCustomer = {};
  custErr.status = 200; // this may change if something goes wrong.
  // Check each of the required fields.
  Object.keys(pc.required).forEach(field => {
    let cleanData = customerHelper.check(field, rawData[field]);
    if (cleanData) {
      cleanCustomer[field] = cleanData;
    } else {
      custErr += 1;
      custErr.status = 401; // partial content.
      custErr.messages.push(`Invalid value in: ${field}.`);
    }
  });
});

/**
 * Finds and checks / cleans data from customer fields.
 * @param {*} key - named data field string.
 * @param {*} value  - value for a given key-pair.
 */
customerHelper.check = function(key,value){
  // @TODO lookup each type of possible field, but required and possibly optional fields.
  if (key && value) {
    if (key === 'firstName') return helpers.getFirstName(value);
    if (key === 'lastName') return helpers.getLastName(value);
    // @TODO create this to test for reasonable past date.
    // if (key === 'dob') return customerHelper.getDOB(value);
    // @TODO add this with translation if any.
    // if (key === 'gender') return customerHelper.getGender(value);
    if (key === 'email') return helpers.getEmail(value);
    if (key === 'phone') return helpers.getPhone(value);
    if (key === 'street') return helpers.getStreet(value);
    // @TODO add check for reasonable city-ness strings.
    // if (key === 'city') return customerHelper.getCity(value);
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
 * Test that the customer has all required fields, and that the fields have
 * valid data.
 * @param {*} errors The customer errors object.
 * @param {*} cust customer object as received from the partner.
 */
customerHelper.validate = (errors,cust) => new Promise((resolves, rejects) => {
  if (!errors){
    throw new Error('A customerErrors object is required when calling validate().');
  }
  if (!cust){
    throw new Error('A customer json object is required when calling validate().');
  }
  errors.errors += 1;
  errors.warnings += 2;
  cust.pin = "iLOVEbread";
  resolves(cust);
});

/**
 * @TODO Fix config.json so literals are used in 'defaults'.
 * Tests if the customer data has all required fields
 * and adds defaults, from the library configuration,
 * and then the partner configuration are overlayed on those.
 * @param {*} errors Error reporting.
 * @param {*} cust customer object as received from the partner.
 * @returns customer data ready for outputting to a flat file,
 * or false if the customer does not have required fields.
 */
customerHelper.addDefaults = function(errors,cust){

};
 
/** 
 * @TODO Move me to flat customer.
 * Takes customer data and maps the JSON data to FLAT fields, then creates and outputs
 * as a valid flat file.
 * @param {*} err - where to put any errors the user may need to see.
 * @param {*} data - the user data.
 * @param {*} config - config object used to reference where to write files and such.
 */
customerHelper.writeFlat = function(data,callback){
  if(data){
    // Format the data and write it to a flat file.
    
  } else {
    callback(400, {'Error' : 'failed to create the customer\'s flat file.'});
  }
}

module.exports = {customerErrors, customerHelper};