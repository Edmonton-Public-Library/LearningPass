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
test('_getFromDefault() should return "Edmonton".', () => {
  let partnerConfig = {
    "defaults": {"city":"Edmonton"} 
  };
  assert.strictEqual(
    customerHelper._getFromDefault("city", partnerConfig), "Edmonton");
});
test('_getFromDefault() should return "".', () => {
  let partnerConfig = {
    "defaults": {} 
  };
  assert.strictEqual(
    customerHelper._getFromDefault("city", partnerConfig), "Edmonton");
});

test('_getFromDefault() should return "".', () => {
  let partnerConfig = { 
  };
  assert.strictEqual(
    // This is defined in the library's defaults.
    customerHelper._getFromDefault("city", partnerConfig), "Edmonton");
});

test('_getFromDefault() should return "Edmonton".', () => {
  assert.strictEqual(
    customerHelper._getFromDefault("city", null), "Edmonton");
});

test('_getFromDefault() should return "Canada".', () => {
  let partnerConfig = { 
    "defaults": {"city":"Edmonton"} 
  };
  assert.strictEqual(
    customerHelper._getFromDefault("country", partnerConfig), "Canada");
});

// Test get -Province() -City
test('getProvince() should return province.', () => {
  let partnerConfig = { 
    "defaults": {"city":"Dartmouth"} 
  };
  assert.strictEqual(
    customerHelper.getProvince("",partnerConfig), "AB");
});

test('getProvince() should return Alberta.', () => {
  let partnerConfig = { 
    "defaults": {"city":"Dartmouth"} 
  };
  assert.strictEqual(
    customerHelper.getProvince("alberta",partnerConfig), "Alberta");
});

test('getCity() should return Dartmouth.', () => {
  let partnerConfig = { 
    "defaults": {"city":"Dartmouth"} 
  };
  assert.strictEqual(
    customerHelper.getCity("",partnerConfig), "Dartmouth");
});

test('getCity() should return Edmonton.', () => {
  let partnerConfig = { 
    // "defaults": {"province":"Nova Scotia"} 
  };
  assert.strictEqual(
    customerHelper.getCity("",partnerConfig), "Edmonton");
});

// Test the getCountry() function.
test('getCountry() should return Canada.', () => {
  let partnerConfig = { 
    "defaults": {"country":"Scotland"} 
  };
  assert.strictEqual(
    customerHelper.getCountry("canada",partnerConfig), "Canada");
});
test('getCountry() should return Scotland.', () => {
  let partnerConfig = { 
    "defaults": {"country":"Scotland"} 
  };
  assert.strictEqual(
    customerHelper.getCountry("",partnerConfig), "Scotland");
});

test('getCountry() should return Canada.', () => {
  let partnerConfig = { 
    "defaults": {} 
  };
  assert.strictEqual(
    customerHelper.getCountry("",partnerConfig), "Canada");
});
test('getCountry() should return Canada.', () => {
  let partnerConfig = { 
    "defaults": {"city":"Belfast"} 
  };
  assert.strictEqual(
    customerHelper.getCountry("",partnerConfig), "Canada");
});
test('getCountry() should return Canada.', () => {
  let partnerConfig = { 
  };
  assert.strictEqual(
    customerHelper.getCountry("",partnerConfig), "Canada");
});


// Test the customer types.
test('getType() should return EPL_NEOS.', () => {
  let partnerConfig = { 
    typeProfiles : {"GMU-STAFF" : "EPL_NEOS"}
  };
  assert.strictEqual(
    customerHelper.getType("GMU-STAFF",partnerConfig), "EPL_NEOS");
});

test('getType() should return EPL_NEXUS.', () => {
  let partnerConfig = { 
    typeProfiles : {"GMU-STUDENT" : "EPL_NEOS",
      "GMU-Staff" : "EPL_NEOSSTF"}
  };
  assert.strictEqual(
    customerHelper.getType("GMU-Staff",partnerConfig), "EPL_NEOSSTF");
});



// Actual customer test on validate.
// Test 
test('validate() should run multiple tests on modifying customer data.', () => {
  // console.log('888>',environment.getVersion());
  let error = customerErrors;
  let pConfig = {};
  pConfig.required = ["firstName","lastName"];
  pConfig.optional = ["gender"];
  pConfig.defaults = {"gender" : "not-saying"}//,
  //  "country" : "Jamacia"};
  let customer = {   
    "firstName": "andrew nicebit",
    "lastName": "Nisbet", 
    "dob": "19740822", 
    // "gender": "", 
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
  };
  customerHelper.validate(error,customer,pConfig)
      .then((customer)=>{
        console.log(customer);
      })
      // Any error from any step above will get caught here.
      .catch(console.error);
  // console.log("888>",error);
  // console.log("999>",customer);
  // assert.strictEqual(error.messages.length,0);
  // console.log('888>',error);
  assert.strictEqual(customer.firstName,"Andrew");
  assert.strictEqual(customer.lastName,"Nisbet");
});

test('getDOB() should return 2000-02-06.', () => {
  let partnerConfig = { 
      age : {minimum : 18}
  };
  assert.deepStrictEqual(
    customerHelper.getDOB("2000-02-06",partnerConfig), 
    new Date("2000-02-06"));
});

test('getDOB() should return "".', () => {
  let partnerConfig = { 
      age : {minimum : 18}
  };
  assert.deepStrictEqual(
    customerHelper.getDOB("1850-02-06",partnerConfig), '');
});

test('getDOB() should return "2000-02-06".', () => {
  let partnerConfig = { 
      age : {minimum : -20, maximum : 120}
  };
  assert.deepStrictEqual(
    customerHelper.getDOB(
      "2000-02-06",partnerConfig), 
      new Date('2000-02-06'));
});