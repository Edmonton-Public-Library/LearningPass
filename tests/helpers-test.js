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
// We use the assert standard library to make assertions
const assert = require('assert');
const helpers = require('../lib/helpers');

// We do not need to import the test functions since
// they are made global variables by test.js
test('should return a JSON object', () => {
    assert.deepStrictEqual(
        helpers.parseJsonToObject('{"name" : "andrew"}'), {"name":"andrew"});
});

// {"customer": {   
//     "first_name": "Andrew",   
//     "last_name": "Nisbet", 
// "dob": "19740822", 
//     "gender": "", 
//     "contact": { 
//     "email": "example@gmail.com", 
//     "phone": "780-555-1212", 
//     "street": "11535 74 Ave.", 
//     "city": "Edmonton", 
//     "province": "AB", 
//     "country": "", 
//     "postal_code": "T6G0G9" 
// }, 
// "meta": {    	
// "barcode": "21221012345678",    	
// "pin": "IlikeBread",    	
// "type": "MAC-DSSTUD",    	
// "expiry": "20210822",    	
// "branch": "",    	
// "status": "OK",    	
// “notes": "" 
// } 
// }}

