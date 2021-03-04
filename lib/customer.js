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
const check = require('./helpers');

 // The customer object manages checking if the customer is
 // * well-formed, the JSON contains all the fields specified 
 // in the customer's config.
 // * valid, the data are reasonable values.
 
const customerHelper = {};
 // Where we log errors, warnings, and what went wrong.
const customerErrors = {
  "errors" : 0,
  "warnings" : 0,
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
 * @param {*} rawData assumes a customer JSON object.
 */
customerHelper.createAccount = (apiKey,rawData) => new Promise((resolves,rejects) => {
  let problems = customerErrors;
  let jsonCustomer = rawData;
  let flatCustomer = {};
});


/**
 * Test that the customer has all required fields.
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
 
/** @TODO: Finish me.
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


// module.exports = {
//   function1,
//   function2,
//   function3
// }
// And then to access them in another file:
// var myFunctions = require("./lib/file.js")
// And then you can call each function by calling:
// myFunctions.function1
// myFunctions.function2
// myFunctions.function3

module.exports = {customerErrors, customerHelper};