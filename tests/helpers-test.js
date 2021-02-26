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

// Test for valid email.
test('andrew@example.com should return true', () => {
    let possibleAddr = 'andrew@example.com';
    assert.strictEqual(helpers.getEmail(possibleAddr), possibleAddr);
});

test('_@_._ should return true', () => {
    let possibleAddr = '_@_._';
    assert.strictEqual(helpers.getEmail(possibleAddr), '');
});

test('a@b should return true', () => {
    let possibleAddr = 'a@b';
    assert.strictEqual(helpers.getEmail(possibleAddr), '');
});

test('a@b@c should return true', () => {
    let possibleAddr = 'a@b@c';
    assert.strictEqual(helpers.getEmail(possibleAddr), '');
});

// Tests for valid phone
const phone = '780-242-5555';
test('+1(780) 242-5555 should return true', () => {
    let str = '+1(780) 242-5555';
    assert.strictEqual(helpers.getPhone(str), phone);
});

test('+1 780 242-5555 should return true', () => {
    let str = '+1 780 242-5555';
    assert.strictEqual(helpers.getPhone(str), phone);
});

test('780 242-5555 should return true', () => {
    let str = '780 242-5555';
    assert.strictEqual(helpers.getPhone(str), phone);
});

test('78O 242-5555 should return ""', () => {
    let str = '78O 242-5555';
    let phone = '';
    assert.strictEqual(helpers.getPhone(str), phone);
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

