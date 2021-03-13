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
  pConfig.barcodes = {
    // prefix:"8888888",
    minimum:"11",
    maximum:"14"
  };
  pConfig.required = ["firstName","lastName","barcode"];
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
test('getDOB() should return "".', () => {
  let partnerConfig = { 
      age : {minimum : 18}
  };
  assert.deepStrictEqual(
    customerHelper.getDOB("andrew",partnerConfig), '');
});

test('getDOB() should return "2000-02-06" if min age is negative.', () => {
  let partnerConfig = { 
      age : {minimum : -18}
  };
  assert.deepStrictEqual(
    customerHelper.getDOB(
      "2000-02-06",partnerConfig),
      new Date('2000-02-06'));
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


test('getPassword() Should allow legit password.', () => {
  let libConfig = {};
  let password  = "123456789";
  let result = password;
  assert.strictEqual(
    customerHelper.getPassword(password,libConfig), result);
});

test('getPassword() Should allow legit password more than 4 digits', () => {
  let libConfig = {"passwords" : {
    "minimum" : 4
  }};
  let password  = "123456789";
  let result = password;
  assert.strictEqual(
    customerHelper.getPassword(password,libConfig), result);
});
test('getPassword() Should not allow legit password less than 4 digits', () => {
  let libConfig = {"passwords" : {
    "minimum" : 4
  }};
  let password  = "123";
  let result = password;
  assert.strictEqual(
    customerHelper.getPassword(password,libConfig), "");
});
test('getPassword() Should not allow legit password more than max digits', () => {
  let libConfig = {"passwords" : {
    "minimum" : 4,
    "maximum" : 5
  }};
  let password  = "123456";
  let result = password;
  assert.strictEqual(
    customerHelper.getPassword(password,libConfig), "");
});
test('getPassword() Should get PIN from password when passwordToPin = true', () => {
  let libConfig = {"passwords" : {
    "minimum" : 4,
    "maximum" : 100,
    "passwordToPin" : true
  }};
  let password  = "HelloWorld";
  let result = 9280;
  assert.strictEqual(
    customerHelper.getPassword(password,libConfig), result);
});
test('getPassword() Should get password when passwordToPin = false', () => {
  let libConfig = {"passwords" : {
    "minimum" : 4,
    "maximum" : 6,
    "passwordToPin" : false
  }};
  let password  = "123456";
  let result = password;
  assert.strictEqual(
    customerHelper.getPassword(password,libConfig), result);
});
test('getPassword() Should get password with user defined regex', () => {
  let libConfig = {"passwords" : {
    "minimum" : 4,
    "maximum" : 100,
    "passwordToPin" : false,
    "regex" : "^\\d{8}$"
  }};
  let password  = "12345678";
  let result = password;
  assert.strictEqual(
    customerHelper.getPassword(password,libConfig), result);
});
test('getPassword() Should return "" if regex password does not match regex', () => {
  let libConfig = {"passwords" : {
    "minimum" : 4,
    "maximum" : 100,
    "passwordToPin" : false,
    "regex" : "^[a-z]$"
  }};
  let password  = "abcdef8";
  let result = '';
  assert.strictEqual(
    customerHelper.getPassword(password,libConfig), result);
});


// Test expiry This next one depends on date=NEVER or date='2022-03-10'
// or days=30
// ********** success is conditional on the 'expiry' object in the config.json ****
test('getExpiry() Should get default library expiry date : [NEVER|<date>] or days=<n>', () => {
  // Get Default from config.json
  let partnerConfig = {};
  let expiry  = "";
  

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
  let result = new Date(expiry);
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
  let notes = "";
  let result = "";
  assert.strictEqual(
    customerHelper.checkNoteTokens(notes,partnerConfig), result);
});
test('Should an note sent.', () => {
  // Get Default from config.json
  let partnerConfig = {};
  let notes = "This customer is awesome!";
  let result = notes;
  assert.strictEqual(
    customerHelper.checkNoteTokens(notes,partnerConfig), result);
});
/** If note.js is triggers an error this can be tested. */
test('Should COMPILE note sent.', () => {
  // Get Default from config.json
  let partnerConfig = {"notes" : {
    "require" : "../plugin/note.js"
   }};
  let notes = "This customer is awesome!";
  let result = "SUCCESS";
  assert.strictEqual(
    customerHelper.checkNoteTokens(notes,partnerConfig), result);
});
// test('Should COMPILE but ERROR.', () => {
//   // Get Default from config.json
//   let partnerConfig = {"notes" : {
//     "require" : "../plugin/note.js"
//    }};
//   let notes = "This customer is awesome!";
//   let result = 'Error customer is not nice:SUCCESS with "This customer is awesome!"';
//   assert.strictEqual(
//     customerHelper.checkNoteTokens(notes,partnerConfig), result);
// });