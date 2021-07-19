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

 const kicCustomer = {   
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

test('Should add note to account.', () => {
    // Get Default from config.json
    let partnerConfig = {"notes" : {
      "require" : "../plugin/kic.js"
    }};
    let f = flat();
    const filePath = '../.data/test/kic-test.flat';
    let customer = kicCustomer;
    customerHelper.checkNoteTokens(customer,partnerConfig);
    let result = "Do not alter any information on this account and refer any inquiries for account changes to the Branch Manager or Community Librarian";
    assert.strictEqual(customer.notes, result);
    
    let flatCust = f.toFlatCustomer(customer);
    if (f.writeFlat(flatCust,filePath)) {
        console.log(`successfully wrote ${filePath}`);
    } else {
        console.log("**problem writing to file.");
    }
});