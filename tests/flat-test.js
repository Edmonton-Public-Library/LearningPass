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
const flat = require('../lib/flat');
const assert = require('assert');
const custJson = {   
    "firstName": "Andrew",
    "lastName": "Nisbet", 
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
    "expiry": "2021-08-22",    	
    "branch": "",    	
    "status": "OK",    	
    "notes": "" 
  };

test('Should reject missing customer data', () => {
    let cJson = {

    };
    const customer = {
        errors: [],
        data: []
    };
    let result = [flat._msg.noJson];
    try{
        flat.toFlat(cJson,customer)
        .then(console.log)
        .catch((err) => {
            return err;
        });
    } catch(e) {
        console.log(`${e} is expected.`);
    }
    assert.deepStrictEqual(customer.errors,result);
});


test('Should create flat customer data.', () => {
    const customer = {
        errors: [],
        data: []
    };
    let cJson = custJson;
    flat.toFlat(cJson,customer)
        .then(console.log)
        .catch((err) => {
            return err;
        });
    console.log(customer);
});

test('Should create flat customer data.', () => {
    const customer = {
        errors: [],
        data: []
    };
    let cJson = custJson;
    flat.toFlat(cJson,customer)
        .then(console.log)
        .catch((err) => {
            return err;
        });
    console.log(customer);
});

test('Should return postalCode false', () => {
    let result = false;
    let key = "postalCode";
    let value = "T6G 0G4"
    assert.strictEqual(flat._getBlockData(key,value), result);
});

test('Should return street false', () => {
    let result = false;
    let key = "street";
    let value = "123 45 Street"
    assert.strictEqual(flat._getBlockData(key,value), result);
});

test('Should return email false', () => {
    let result = false;
    let key = "email";
    let value = "name@example.com"
    assert.strictEqual(flat._getBlockData(key,value), result);
});

test('Should return city false', () => {
    let result = false;
    let key = "city";
    let value = "Edmonton, AB"
    assert.strictEqual(flat._getBlockData(key,value), result);
});

test('Should return phone false', () => {
    let result = false;
    let key = "phone";
    let value = "780-555-1212"
    assert.strictEqual(flat._getBlockData(key,value), result);
});

test('Should return note false', () => {
    let result = false;
    let key = "note";
    let value = "Customer is awesome!"
    assert.strictEqual(flat._getBlockData(key,value), result);
});

test('Should return firstName', () => {
    let result = ".USER_FIRST_NAME.    |aDoug";
    let key = "firstName";
    let value = "Doug";
    assert.strictEqual(flat._getBlockData(key,value), result);
});

test('Should return error message', () => {
    let flatDefaults = new Map();
    flatDefaults.set("USER_FIRST_NAME","Doug");
    let result = undefined;
    let defaults = {"FOO":"bar"};
    flat._updateDefaults(flatDefaults,defaults);
    assert.deepStrictEqual(flatDefaults.get("FOO"), result);
});