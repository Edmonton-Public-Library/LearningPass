/* eslint-disable no-undef */
/**
 * This file customer-tests.js contains tests for Learning Pass's 
 * customer helper functions.
 * 
 * Copyright 2021 Andrew Nisbet, Edmonton Public Library
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

 const assert = require('assert');
 const dotenv = require('dotenv');
 dotenv.config();
 const customerHelper = require('../lib/customer');
 const flat = require('../lib/flat');

 const neosCustomer = {   
    "firstName": "Mike",
    "lastName": "Mizer", 
    "dob": "1974-08-22", 
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
    "notes": "" 
}

test('Should add USER_CATEGORY1 based on type.', () => {
    // Get Default from config.json
    let partnerConfig = {"notes" : {
      "require" : "../plugin/neos.js"
     }};
    let customer = {"type" : "UA-GRAD"};
    customerHelper.checkNoteTokens(customer,partnerConfig);
    let result = "UANEW";
    assert.strictEqual(customer.USER_CATEGORY1, result);
});

test('Should add USER_CATEGORY1 based on type.', () => {
    // Get Default from config.json
    let partnerConfig = {"notes" : {
      "require" : "../plugin/neos.js"
     }};
    let customer = {"type" : "UA-STAFF"};
    customerHelper.checkNoteTokens(customer,partnerConfig);
    let result = "UASTAFF";
    assert.strictEqual(customer.USER_CATEGORY1, result);
});

test('Should issue error message USER_CATEGORY1 based on unknown type.', () => {
    // Get Default from config.json
    let partnerConfig = {"notes" : {
      "require" : "../plugin/neos.js"
     }};
    let customer = {"type" : "UA-UNKNOWN"};
    customerHelper.checkNoteTokens(customer,partnerConfig);
    let result = undefined;
    assert.strictEqual(customer.USER_CATEGORY1, result);
});

test('Should add USER_CATEGORY1 for GMU Student.', () => {
    // Get Default from config.json
    let partnerConfig = {"notes" : {
      "require" : "../plugin/neos.js"
    }};
    let f = flat();
    const filePath = '../.data/test/neos-test.flat';
    let customer = neosCustomer;
    customerHelper.checkNoteTokens(customer,partnerConfig);
    let result = "GMUDSTU";
    assert.strictEqual(customer.USER_CATEGORY1, result);
    
    let flatCust = f.toFlatCustomer(customer);
    if (f.writeFlat(flatCust,filePath)) {
        console.log(`successfully wrote ${filePath}`);
    } else {
        console.log("**problem writing to file.");
    }
});