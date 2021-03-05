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
const assert = require('assert');
const {customerErrors,customerHelper} = require('../lib/customer');
  /**
   * [{   
   *  "firstName": "Andrew",
   *  "lastName": "Nisbet", 
   *  "dob": "19740822", 
   *  "gender": "", 
   *  "email": "example@gmail.com", 
   *  "phone": "780-555-1212", 
   *  "street": "11535 74 Ave.", 
   *  "city": "Edmonton", 
   *  "province": "AB", 
   *  "country": "", 
   *  "postalCode": "T6G0G9",
   *  "barcode": "21221012345678",    	
   *  "pin": "IlikeBread",    	
   *  "type": "MAC-DSSTUD",    	
   *  "expiry": "20210822",    	
   *  "branch": "",    	
   *  "status": "OK",    	
   *  “notes": "" 
   *}] 
   */
// Test 
test('Should run multiple tests on modifying customer data.', () => {
    // console.log('888>',environment.getVersion());
    let error = customerErrors;
    let required = ["firstName","lastName","country"];
    let customer = {   
      "firstName": "andrew nicebit",
      "lastName": "Nisbet", 
      "dob": "19740822", 
      "gender": "", 
      "email": "example@gmail.com", 
      "phone": "780-555-1212", 
      "street": "11535 74 Ave.", 
      "city": "Edmonton", 
      "province": "AB", 
      // "country": "", 
      "postalCode": "T6G0G9",
      "barcode": "21221012345678",
      "pin": "IlikeBread",
      "type": "MAC-DSSTUD",
      "expiry": "20210822",
      "branch": "",
      "status": "OK",
      "notes": ""
    };
    customerHelper.validate(error,customer,required)
        .then(customer)
        // Any error from any step above will get caught here.
        .catch(console.error);
    // console.log("888>",error);
    // console.log("999>",customer);
    // assert.strictEqual(error.messages.length,0);
    // console.log('888>',error);
    assert.strictEqual(customer.firstName,"Andrew");
    assert.strictEqual(customer.lastName,"Nisbet");
});

// Test for 
test('getGender() should return a mapped gender.', () => {
  let partnerConfig = {
    "genderMap": {"MALE":"M","FEMALE":"F","NA":"NA","NONE":"X" 
  }};
  assert.strictEqual(
    customerHelper.getGender("MALE", partnerConfig), "M");
});

test('getGender() should fail to find mapped gender.', () => {
  let partnerConfig = {
    "genderMap": {"MALE":"M","FEMALE":"F","NA":"NA","NONE":"X" 
  }};
  assert.strictEqual(
    customerHelper.getGender("queer", partnerConfig), "");
});

test('getGender() should return a case-agnostic mapped gender.', () => {
  let partnerConfig = {
    "genderMap": {"MALE":"M","FEMALE":"F","NA":"NA","NONE":"X" 
  }};
  assert.strictEqual(
    customerHelper.getGender("male", partnerConfig), "M");
});

// Test 'private' helper that will get a default if there is one.
test('_getDefault() should return "Edmonton".', () => {
  let partnerConfig = {
    "defaults": {"city":"Edmonton"} 
  };
  assert.strictEqual(
    customerHelper._getDefault("city", partnerConfig), "Edmonton");
});
test('_getDefault() should return "".', () => {
  let partnerConfig = {
    "defaults": {} 
  };
  assert.strictEqual(
    customerHelper._getDefault("city", partnerConfig), "");
});

test('_getDefault() should return "".', () => {
  let partnerConfig = { 
  };
  assert.strictEqual(
    customerHelper._getDefault("city", partnerConfig), "");
});

test('_getDefault() should return "".', () => {
  assert.strictEqual(
    customerHelper._getDefault("city", null), "");
});

test('_getDefault() should return "Canada".', () => {
  let partnerConfig = { 
    "defaults": {"city":"Edmonton"} 
  };
  assert.strictEqual(
    customerHelper._getDefault("country", partnerConfig), "Canada");
});