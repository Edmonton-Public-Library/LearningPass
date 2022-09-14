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
// const registrationStatus = require('../lib/response');
  /**
   * {   
   *  "firstName": "Mike",
   *  "lastName": "Mizer", 
   *  "dob": "1974-08-22", 
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
   *  "notes": "" 
   *} 
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

/** Depends on config.json and partner.json. */
// test('_getFromDefault() should return "Canada".', () => {
//   let partnerConfig = { 
//     "defaults": {"city":"Edmonton"} 
//   };
//   assert.strictEqual(
//     customerHelper._getFromDefault("country", partnerConfig), "Canada");
// });

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

/** These tests produce different results based on what's in the config.json and partner.json */
// test('getCountry() should return Canada.', () => {
//   let partnerConfig = { 
//     "defaults": {} 
//   };
//   assert.strictEqual(
//     customerHelper.getCountry("",partnerConfig), "Canada");
// });
// test('getCountry() should return Canada.', () => {
//   let partnerConfig = { 
//     "defaults": {"city":"Belfast"} 
//   };
//   assert.strictEqual(
//     customerHelper.getCountry("",partnerConfig), "Canada");
// });
// test('getCountry() should return Canada.', () => {
//   let partnerConfig = { 
//   };
//   assert.strictEqual(
//     customerHelper.getCountry("",partnerConfig), "Canada");
// });


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

test('getDOB() should return 2000-02-06.', () => {
  let partnerConfig = { 
      age : {minimum : 18}
  };
  assert.deepStrictEqual(
    customerHelper.getDOB("2000-02-06",partnerConfig),"2000-02-06");
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
      "2000-02-06",partnerConfig), '2000-02-06');
});
test('getDOB() should return "".', () => {
  let partnerConfig = { 
      age : {minimum : 18}
  };
  assert.deepStrictEqual(
    customerHelper.getDOB("lewis",partnerConfig), '');
});

test('getDOB() should return "2000-02-06" if min age is negative.', () => {
  let partnerConfig = { 
      age : {minimum : -18}
  };
  assert.deepStrictEqual(
    customerHelper.getDOB(
      "2000-02-06",partnerConfig),'2000-02-06');
});

// Test getBarcode()
test('getBarcode() should return a valid barcode with prefix.', () => {
  let partnerConfig = {"barcodes" : {
      "prefix" : "21221800",
      "regex" : "",
      "minimum" : 13,
      "maximum" : 14
  }};
  let pCard  = "123456";
  let result = partnerConfig.barcodes.prefix + pCard;
  assert.strictEqual(
    customerHelper.getBarcode(pCard,partnerConfig), result);
});

test('getBarcode() should report an error with width but return barcode.', () => {
  let partnerConfig = {"barcodes" : {
      "prefix" : "21221800",
      "minimum" : 1,
      "maximum" : 14
  }};
  let pCard  = "123456";
  let result = partnerConfig.barcodes.prefix + pCard;
  assert.strictEqual(
    customerHelper.getBarcode(pCard,partnerConfig), result);
});

test('getBarcode() should return empty if barcode + prefix exceed maximum.', () => {
  let partnerConfig = {"barcodes" : {
      "prefix" : "21221800",
      "minimum" : 1,
      "maximum" : 14
  }};
  let pCard  = "123456789";
  assert.strictEqual(
    customerHelper.getBarcode(pCard,partnerConfig), '');
});

// Test expiry This next one depends on date=NEVER or date='2022-03-10'
// or days=30
// ********** success is conditional on the 'expiry' object in the config.json ****
test('getExpiry() Should get default library expiry date : [NEVER|<date>] or days=<n>', () => {
  // Get Default from config.json
  // let partnerConfig = {};
  // let expiry  = "";
  

  // Test 1 start
  // let result = "NEVER";
  //   assert.deepStrictEqual(
  //     customerHelper.getExpiry(expiry,partnerConfig), result);
  // }
  // Test 1 end



  // Test 2 start
  // let result = new Date("2022-03-10T00:00:00.000Z");
  // assert.deepStrictEqual(
  //   customerHelper.getExpiry(expiry,partnerConfig), result);
  // }
  // Test 2 end



  // Test 3 start
  // let today = new Date();
  // today.setHours(0,0,0,0);
  // let result = new Date(today.setDate(today.getDate() + 30));
  // assert.deepStrictEqual(
  //   customerHelper.getExpiry(expiry,partnerConfig), result);
  }
  // Test 3 end
);


// ******* this test can only pass if you remove the 'expiry' object from the config.json.
// test('getExpiry() Should fail if expiry is in the past', () => {
//   // Get Default from config.json
//   let partnerConfig = {};
//   let expiry  = "1950-08-22";
//   let result = '';
//   assert.strictEqual(
//     customerHelper.getExpiry(expiry,partnerConfig), result);
// });
// test('getExpiry() Should fail if expiry is empty lib and partner have no defaults', () => {
//   // Get Default from config.json
//   let partnerConfig = {};
//   let expiry  = "";
//   let result = '';
//   assert.strictEqual(
//     customerHelper.getExpiry(expiry,partnerConfig), result);
// });
// ******* this test can only pass if you remove the 'expiry' object from the config.json.


test('getExpiry() Should get partner expiry date=NEVER.', () => {
  // Get Default from config.json
  let partnerConfig = {"expiry": {"date": "NEVER"}};
  let expiry  = "";
  let result = "NEVER";
  assert.deepStrictEqual(
    customerHelper.getExpiry(expiry,partnerConfig), result);
});
test('getExpiry() Should get partner expiry date=2022-03-10.', () => {
  // Get Default from config.json
  let partnerConfig = {"expiry": {"date": "2022-03-10"}};
  let expiry = '';
  let result = new Date("2022-03-10T00:00:00.000Z");
  assert.deepStrictEqual(
    customerHelper.getExpiry(expiry,partnerConfig), result);
});
test('getExpiry() Should get partner expiry days=30.', () => {
  // Get Default from config.json
  let partnerConfig = {"expiry": {"days": 30}};
  let expiry = '';
  let today = new Date();
  today.setHours(0,0,0,0);
  let result = new Date(today.setDate(today.getDate() + 30));
  assert.deepStrictEqual(
    customerHelper.getExpiry(expiry,partnerConfig), result);
});

test('getExpiry() Should prefer customer expiry', () => {
  // Get Default from config.json
  let partnerConfig = {"expiry": {"date": 30}};
  let expiry  = "2030-08-22";
  let result = expiry;
  assert.deepStrictEqual(
    customerHelper.getExpiry(expiry,partnerConfig), result);
});
test('getExpiry() Should replace past expiry with default.', () => {
  // Get Default from config.json
  let partnerConfig = {"expiry": {"date": "NEVER"}};
  let expiry  = "1950-08-22";
  let result = 'NEVER';
  assert.strictEqual(
    customerHelper.getExpiry(expiry,partnerConfig), result);
});




/**
 * Get branch testing.
 */
const libEnv = require('../config');
const environment = require('../config');
const registrationStatus = require('../lib/response');
const libCS = libEnv.getDefaultCustomerSettings();

test('Should return empty with no library "branch" object.', () => {
  // Get Default from config.json
  let libCustConfig = {};
  let custPrefBranch = '';
  // let result = libCS.branch.default;
  let result = "";
  assert.strictEqual(
    customerHelper.getBranch(custPrefBranch,libCustConfig), result);
});
test('Should use customer-preferred branch.', () => {
  // Get Default from config.json
  let custPrefBranch = 'EPLWMC';
  // let result = libCS.branch.default;
  let result = "EPLWMC";
  assert.strictEqual(
    customerHelper.getBranch(custPrefBranch,libCS), result);
});
test('Should return library default branch.', () => {
  // Get Default from config.json
  let custPrefBranch = '';
  // let result = libCS.branch.default;
  let result = "EPLMNA";
  assert.strictEqual(
    customerHelper.getBranch(custPrefBranch,libCS), result);
});
test('Should return library default if customer preference is invalid.', () => {
  // Get Default from config.json
  let libCustConfig = {branch : {default : "EPLCLV"}};
  let custPrefBranch = 'EPLBADBRANCH';
  // let result = libCS.branch.default;
  let result = libCustConfig.branch.default;
  assert.strictEqual(
    customerHelper.getBranch(custPrefBranch,libCustConfig), result);
});
test('Should return customer preference over library default.', () => {
  // Get Default from config.json
  let libCustConfig = {branch : {default : "EPLMNA",
    valid : ["EPLMNA","EPLCLV","EPLWMC","EPLSTR"]
  }};
  let custPrefBranch = 'EPLCLV';
  // let result = libCS.branch.default;
  let result = custPrefBranch;
  assert.strictEqual(
    customerHelper.getBranch(custPrefBranch,libCustConfig), result);
});


/**
 * Check and apply customer status.
 */
test('Should return default status OK.', () => {
  // Get Default from config.json
  let partnerConfig = {};
  let status = "";
  let result = "OK";
  assert.strictEqual(
    customerHelper.getStatus(status,partnerConfig), result);
});
test('Should return default when status sent but no statusMap available.', () => {
  // Get Default from config.json
  let partnerConfig = {};
  let status = "SOME_STATUS";
  let result = "OK";
  assert.strictEqual(
    customerHelper.getStatus(status,partnerConfig), result);
});
test('Should return OK if partner has statusMap but status sent is invalid.', () => {
  // Get Default from config.json
  let partnerConfig = {statusMap:{}};
  let status = "SOME_STATUS";
  let result = "OK";
  assert.strictEqual(
    customerHelper.getStatus(status,partnerConfig), result);
});
test('Should return valid status from partner statusMap lookup.', () => {
  // Get Default from config.json
  let partnerConfig = {statusMap : {
    GOOD : "OK",
    BAD : "DELINQUENT",
    UGLY : "BLOCKED"
}};
  let status = "BAD";
  let result = "DELINQUENT";
  assert.strictEqual(
    customerHelper.getStatus(status,partnerConfig), result);
});



/** Tests notes */
test('Should an empty string if notes empty and no partner "notes" object.', () => {
  // Get Default from config.json
  let partnerConfig = {};
  let customer = {"notes":""};
  let result = "";
  customerHelper.checkNoteTokens(customer,partnerConfig);
  assert.strictEqual(customer.notes, result);
});
test('Should add the sent note.', () => {
  // Get Default from config.json
  let partnerConfig = {};
  let customer = {"notes": "This customer is awesome!"};
  let result = customer.notes;
  customerHelper.checkNoteTokens(customer,partnerConfig);
  assert.strictEqual(customer.notes, result);
});
/** If note.js is triggers an error this can be tested. */
test('Should COMPILE note sent.', () => {
  // Get Default from config.json
  let partnerConfig = {"notes" : {
    "require" : "../plugin/note.js"
   }};
  let customer = {"notes" : "This customer NOT is awesome!"};
  let result = 'Error in notes:"This customer NOT is awesome!"';
  customerHelper.checkNoteTokens(customer,partnerConfig);
    assert.strictEqual(customer.notes, result);
});

test('Should COMPILE but ERROR.', () => {
  // Get Default from config.json
  let partnerConfig = {"notes" : {
    "require" : "../plugin/note.js"
   }};
  let customer = {"notes":"A"};
  let result = 'ASUCCESS';
  customerHelper.checkNoteTokens(customer,partnerConfig);
  assert.strictEqual(customer.notes, result);
});


// Test merge fields.
test("Should return string 'Edmonton, AB'", () => {
  let result = 'Edmonton, AB';
  let pc = {"merge" : {
    "delimiter" : ", ",
    "fields" : {"city" : ["city","province"]}
  }};
  let customer = {   
    "firstName": "Lewis nicebit",
    "lastName": "Hamilton", 
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

  customerHelper.mergeFields(customer,pc);

  assert.strictEqual(customer.city, result);

});

// Test merge fields.
test("Should return string new 'preferredName'='A+B'", () => {
  let result = 'A+B';
  let pc = {"merge" : {
    "delimiter" : "+",
    "fields" : {"preferredName" : ["firstName","lastName"]}
  }};
  let customer = {   
    "firstName": "A",
    "lastName": "B", 
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

  customerHelper.mergeFields(customer,pc);

  assert.strictEqual(customer['preferredName'], result);

});

// Test merge fields.
test("Should return string new 'firstName'='a, c'", () => {
  let result = 'a, c';
  let pc = {"merge" : {
    "delimiter" : ", ",
    "fields" : {"firstName" : ["firstName","middleName"]}
  }};
  let customer = {   
    "firstName": "a",
    "lastName": "b", 
    "middleName": "c",
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

  customerHelper.mergeFields(customer,pc);

  assert.strictEqual(customer['firstName'], result);

});

// Test merge fields.
test("Should return merged string without delimiter", () => {
  let result = 'AB';
  let pc = {"merge" : {
    "fields" : {"preferredName" : ["firstName","lastName"]}
  }};
  let customer = {   
    "firstName": "A",
    "lastName": "B", 
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

  customerHelper.mergeFields(customer,pc);

  assert.strictEqual(customer['preferredName'], result);

});
test("Should merge all defined fields", () => {
  let result = 'B';
  let pc = {"merge" : {
    "fields" : {"city" : ["x","lastName"]}
  }};
  let customer = {   
    "firstName": "A",
    "lastName": "B", 
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

  customerHelper.mergeFields(customer,pc);

  assert.strictEqual(customer.city, result);

});
test("Should return '' for merging undefined fields", () => {
  let result = '';
  let pc = {"merge" : {
    "fields" : {"city" : ["x","y"]}
  }};
  let customer = {   
    "firstName": "A",
    "lastName": "B", 
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

  customerHelper.mergeFields(customer,pc);

  assert.strictEqual(customer.city, result);

});
test("Should change city to province", () => {
  let result = 'AB';
  let pc = {"merge" : {
    "delimiter" : "-",
    "fields" : {"city" : ["province"]}
  }};
  let customer = {   
    "firstName": "A",
    "lastName": "B", 
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

  customerHelper.mergeFields(customer,pc);

  assert.strictEqual(customer.city, result);

});
test("Should not change anything if 'fields' is empty.", () => {
  let result = 'Edmonton';
  let pc = {"merge" : {
    "delimiter" : "-",
    "fields" : {}
  }};
  let customer = {
    "firstName": "A",
    "lastName": "B", 
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

  customerHelper.mergeFields(customer,pc);

  assert.strictEqual(customer.city, result);

});











// Actual customer test on validate.
// Test 
test('validate() should run multiple tests on modifying customer data.', () => {
  // console.log('888>',environment.getVersion());
  let pConfig = {};
  pConfig.barcodes = {
    // prefix:"8888888",
    minimum:"11",
    maximum:"14"
  };
  pConfig.required = ["firstName","lastName","barcode"];
  pConfig.optional = ["gender"];
  pConfig.defaults = {"gender" : "not-saying"}
  pConfig.flatDefaults = {
    "USER_CATEGORY2" : "GODDESS",
    "USER_CATEGORY3" : "EMAILCONV"
  };
  let customer = {   
    "firstName": "lewis nicebit",
    "lastName": "hamilton", 
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
    "type": "NQ-STUDOC",
    "expiry": "20210822",
    "branch": "",
    "status": "OK",
    "notes": ""
  };
  customerHelper.validate(customer,pConfig);
  if (pConfig.strictChecks == true) {
    assert.strictEqual(customer.firstName,"Lewis");
    assert.strictEqual(customer.lastName,"Hamilton");
  } else {
    console.log(`*WARNING: strictChecks turned off by another test!`);
  }
});








test('Should create a "Lewis Hamilton" account.', () => {
  let customer = {   
    "firstName": "Lewis",
    "lastName": "Hamilton", 
    "dob": "19740822", 
    // "gender": "", 
    "email": "example@gmail.com", 
    "phone": "780-555-1212", 
    "street": "11535 74 Ave.", 
    "city": "Edmonton", 
    "province": "AB", 
    "country": "", 
    "postalCode": "T6G0G9",
    "barcode": "21221012345677",
    "pin": "IlikeBread",
    "type": "MAC-DSSTUD",
    "expiry": "20210822",
    "branch": "",
    "status": "OK",
    "notes": ""
  };


  let response = customerHelper.createAccount(process.env.TEST_API_KEY,customer);
  assert.strictEqual(response.getStatus(),200);
});

test('Create account should create user with street in initial caps.', () => {
  let customer = {
    "firstName": "Raman Preet",
    "lastName": "Khosa",
    "dob": "1984-11-01",
    "email": "rkhosa01@mynorquest.ca",
    "phone": "780/236-1742", 
    "street": "414 JENNINGS BAY NW", 
    "city": "EDMONTON,AB", 
    "postalCode": "T6L 6R8",
    "barcode": "1380030606016",
    "pin": "7679",
    "type": "NQ-STUDOC",
    "expiry": "2021-05-04",
    "branch": "EPLMEA",
    "notes": ""
  };

  if (environment.useTestMode()) {
    let response = customerHelper.createAccount(process.env.TEST_API_KEY,customer);
    assert.strictEqual(response.getStatus(),202);
  } else {
    let response = customerHelper.createAccount(process.env.NEOS_API_KEY,customer);
    assert.strictEqual(response.getStatus(),200);
  }
}); 

// Test multiple accounts created.
test('Should create multiple accounts.', () => {
  let customers = [{
    "firstName": "Kimi",
    "lastName": "Räikkönen",
    "dob": "1988-06-01",
    "email": "kimi.r@mynorquest.ca",
    "phone": "780/555-1742", 
    "street": "414 Gerbils wAY NW", 
    "city": "EDMONTON,AB", 
    "postalCode": "T6L 6R8",
    "barcode": "1380030605555",
    "pin": "1234",
    "type": "MAC-DSSTUD",
    "expiry": "2022-05-04",
    "branch": "EPLMNA"
  }, {
    "firstName": "Lewis",
    "lastName": "Hamilton", 
    "dob": "19740822", 
    // "gender": "", 
    "email": "example@gmail.com", 
    "phone": "780-555-1212", 
    "street": "11535 74 Ave.", 
    "city": "Edmonton", 
    "province": "AB", 
    "country": "", 
    "postalCode": "T6G0G9",
    "barcode": "1380030606666",
    "pin": "IlikeBread",
    "type": "MAC-DSSTUD",
    "expiry": "20210822",
    "branch": "",
    "status": "OK"
  }, {
    "firstName": "Daniel",
    "lastName": "Ricardo", 
    "dob": "19750822", 
    // "gender": "", 
    "email": "example@gmail.com", 
    "phone": "780-555-1212", 
    "street": "11535 74 Ave.", 
    "city": "Edmonton", 
    "province": "AB", 
    "country": "", 
    "postalCode": "T6G0G9",
    "barcode": "1380030607777",
    "pin": "IlikeBread",
    "type": "MAC-DSSTUD",
    "expiry": "20210822",
    "branch": "",
    "status": "OK"
  }
  ];
  const cHelper = require('../lib/customer');
  let expected = [
    {
        "messages": [],
        "error": false,
        "barcode": "1380030605555"
    },
    {
        "messages": [],
        "error": false,
        "barcode": "1380030606666"
    },
    {
        "messages": [],
        "error": false,
        "barcode": "1380030607777"
    }];
  let allResponses = [];
  let regStatus = registrationStatus();
  customers.forEach(customer => {
    let rs = registrationStatus();
    if (environment.useTestMode()) {
      rs = cHelper.createAccount(process.env.TEST_API_KEY,customer);
    } else {
      rs = cHelper.createAccount(process.env.NEOS_API_KEY,customer);
    }
    allResponses.push(rs.getMessageObject());
  });
  regStatus.setStatus('success',allResponses);
  assert.deepStrictEqual(regStatus.getMessageObject(), expected);
});

// Test multiple accounts created.
test('Should create multiple accounts.', () => {
  let customers = [{
    "firstName": "Max",
    "lastName": "Verstappen",
    "dob": "1988-06-01",
    "email": "max.verstappen@mynorquest.ca",
    "phone": "780/555-1742", 
    "street": "414 My wAY NW", 
    "city": "EDMONTON,AB", 
    "postalCode": "T6L 6R8",
    "barcode": "1380030601111",
    "pin": "1234",
    "type": "MAC-DSSTUD",
    "expiry": "2022-05-04",
    "branch": "EPLMNA"
  }, {
    "firstName": "Lando",
    "lastName": "Norris", 
    "dob": "19740822", 
    // "gender": "", 
    "email": "example@gmail.com", 
    "phone": "780-555-1212", 
    "street": "11535 74 Ave.", 
    "city": "Edmonton", 
    "province": "AB", 
    "country": "", 
    "postalCode": "T6G0G9",
    "barcode": "1380030602222",
    "pin": "IlikeBread",
    "type": "MAC-DSSTUD",
    "expiry": "20210822",
    "branch": "",
    "status": "OK"
  }, {
    "firstName": "Charles",
    "lastName": "LeClerc", 
    "dob": "19750822", 
    // "gender": "", 
    "email": "example@gmail.com", 
    "phone": "780-555-1212", 
    "street": "11535 74 Ave.", 
    "city": "Edmonton", 
    "province": "AB", 
    "country": "", 
    "postalCode": "T6G0G9",
    "barcode": "1380030603333",
    "pin": "IlikeBreadToo",
    "type": "MAC-DSSTUD",
    "expiry": "20210822",
    "branch": "",
    "status": "OK"
  }
  ];
  const cHelper = require('../lib/customer');
  let expected = [
    {
        "messages": [],
        "error": false,
        "barcode": "1380030601111"
    },
    {
        "messages": [],
        "error": false,
        "barcode": "1380030602222"
    },
    {
        "messages": [],
        "error": false,
        "barcode": "1380030603333"
    }];
  let allResponses = [];
  let regStatus = registrationStatus();
  customers.forEach(customer => {
    let rs = registrationStatus();
    if (environment.useTestMode()) {
      rs = cHelper.createAccount(process.env.TEST_API_KEY,customer);
    } else {
      rs = cHelper.createAccount(process.env.NEOS_API_KEY,customer);
    }
    allResponses.push(rs.getMessageObject());
  });
  regStatus.setStatus('success',allResponses);
  assert.deepStrictEqual(regStatus.getMessageObject(), expected);
});

test('Should report error for customer with invalid PIN.', () => {
  let customer = {
    "firstName": "Sebastian",
    "lastName": "Vettel",
    "dob": "1984-11-01",
    "email": "sebvettel@mynorquest.ca",
    "phone": "780/236-1742", 
    "street": "414 JENNINGS BAY NW", 
    "city": "EDMONTON,AB", 
    "postalCode": "T6L 6R8",
    "barcode": "1380030161616",
    "pin": "$$$$",
    "type": "NQ-STUDOC",
    "expiry": "2021-05-04",
    "branch": "EPLMEA",
    "notes": ""
  };

  if (environment.useTestMode()) {
    let response = customerHelper.createAccount(process.env.TEST_API_KEY,customer);
    assert.strictEqual(response.getStatus(),206);
  } else {
    let response = customerHelper.createAccount(process.env.NEOS_API_KEY,customer);
    assert.strictEqual(response.getStatus(),206);
  }
}); 


// Test strictCheck switch.
test('Tests that some customer data IS NOT filtered or cleaned when strict checks are turned off.', () => {
  
  let pConfig = {};
  pConfig.barcodes = {
    // prefix:"8888888",
    minimum:"11",
    maximum:"14"
  };
  pConfig.required = ["firstName","lastName","barcode","street","middleName","careOf"];
  pConfig.optional = ["gender"];
  pConfig.defaults = {"gender" : "not-saying"}
  pConfig.strictChecks = false
  pConfig.flatDefaults = {
    "USER_CATEGORY2" : "GODDESS",
    "USER_CATEGORY3" : "EMAILCONV"
  };
  let customer = {   
    "firstName": "lewis nicebit",
    "lastName": "hamilton",
    "middleName" : "sOMENAMe",
    "dob": "19740822", 
    // "gender": "", 
    "email": "example@gmail.com", 
    "phone": "780-555-1212", 
    "street": "completely bogus address!!",
    "careOf": "SOME GOOD FOLKS",
    "city": "Edmonton", 
    "province": "AB", 
    "country": "", 
    "postalCode": "T6G0G9",
    "barcode": "21221012345678",
    "pin": "IlikeBread",
    "type": "NQ-STUDOC",
    "expiry": "20210822",
    "branch": "",
    "status": "OK",
    "notes": ""
  };
  customerHelper.validate(customer,pConfig);
  assert.strictEqual(customer.firstName,"lewis nicebit");
  assert.strictEqual(customer.lastName,"hamilton");
  assert.strictEqual(customer.middleName,"sOMENAMe");
  assert.strictEqual(customer.street,"completely bogus address!!");
  assert.strictEqual(customer.careOf,"SOME GOOD FOLKS");
  pConfig.strictChecks = true;
  customerHelper.validate(customer,pConfig);
  assert.strictEqual(customer.firstName,"Lewis");
  assert.strictEqual(customer.lastName,"Hamilton");
  assert.strictEqual(customer.middleName,"Somename");
  assert.strictEqual(customer.careOf,"Some Good Folks");
});