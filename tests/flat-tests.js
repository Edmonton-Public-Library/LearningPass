/**
 * This file data.js contains utility functions for Learning Pass.
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
const flat = require('../lib/flat');
const assert = require('assert');
const fs = require('fs');
const path = require('path');

// Bogus customer data.
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

// returns a promise which resolves true if file exists:
const checkFileExists = (filepath) => new Promise((resolve,rejects) => {
    let filePath = path.join(__dirname, filepath);
    fs.access(filePath, fs.constants.F_OK, error => {
        if (error) {
            console.log(error);
            rejects(false);
        }
        return resolve(true);
    });
});


test("Should write flat to file.",() => {
    // const filePath = '/home/anisbet/Dev/EPL/LearningPass/.data/test/test.flat';
    const filePath = '../.data/test/test.flat';
    const customer = {
        errors: [],
        data: []
    };
    let result = true;
    flat.toFlat(custJson,customer)
        .catch(console.log);

    flat.write(customer,filePath)
        // .then(console.log)
        .catch(console.log);
    checkFileExists(filePath)
        .then((result) => {
            assert.strictEqual(result,true);
        })
        .catch(console.log);
});

test("Should print a well formed flat file.",() => {
    let customer = {
        errors: [],
        data: []
    };
    let result = {
        errors: [],
        data: [
          '*** DOCUMENT BOUNDARY ***',
          'FORM=LDUSER',
          '.USER_FIRST_NAME.    |aAndrew',
          '.USER_LAST_NAME.    |aNisbet',
          '.USER_BIRTH_DATE.    |a19740822',
          '.USER_ID.    |a21221012345678',
          '.USER_PIN.    |aIlikeBread',
          '.USER_PROFILE.    |aMAC-DSSTUD',
          '.USER_PRIV_EXPIRES.    |a20210822',
          '.USER_STATUS.    |aOK',
          '.USER_NAME_DSP_PREF.    |a0',
          '.USER_PREF_LANG.    |aENGLISH',
          '.USER_ROUTING_FLAG.    |aY',
          '.USER_CHG_HIST_RULE.    |aALLCHARGES',
          '.USER_ACCESS.    |aPUBLIC',
          '.USER_ENVIRONMENT.    |aPUBLIC',
          '.USER_MAILINGADDR.    |a1',
          '.NOTIFY_VIA.    |aPHONE',
          '.RETRNMAIL.    |aYES',
          '.USER_ADDR1_BEGIN.',
          '.EMAIL.    |aexample@gmail.com',
          '.PHONE.    |a780-555-1212',
          '.STREET.    |a11535 74 Ave.',
          '.CITY/PROV.    |aEdmonton',
          '.POSTALCODE.    |aT6G0G9',
          '.USER_ADDR1_END.'
        ]
      };
    flat.toFlat(custJson,customer)
        // .then(console.log)
        .catch(console.log);
    flat.write(customer)
        // .then(console.log)
        .catch(console.log);
    assert.deepStrictEqual(customer,result);
});



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


// test('Should create flat customer data.', () => {
//     const customer = {
//         errors: [],
//         data: []
//     };
//     let cJson = custJson;
//     flat.toFlat(cJson,customer)
//         .then(console.log)
//         .catch((err) => {
//             return err;
//         });
//     console.log(customer);
// });

// test('Should create flat customer data.', () => {
//     const customer = {
//         errors: [],
//         data: []
//     };
//     let cJson = custJson;
//     flat.toFlat(cJson,customer)
//         .then(console.log)
//         .catch((err) => {
//             return err;
//         });
//     console.log(customer);
// });

test('Should return postalCode false', () => {
    let result = false;
    let key = "postalCode";
    let value = "T6G 0G4"
    assert.strictEqual(flat._getDataSortNStoreBlockData(key,value), result);
});

test('Should return street false', () => {
    let result = false;
    let key = "street";
    let value = "123 45 Street"
    assert.strictEqual(flat._getDataSortNStoreBlockData(key,value), result);
});

test('Should return email false', () => {
    let result = false;
    let key = "email";
    let value = "name@example.com"
    assert.strictEqual(flat._getDataSortNStoreBlockData(key,value), result);
});

test('Should return city false', () => {
    let result = false;
    let key = "city";
    let value = "Edmonton, AB"
    assert.strictEqual(flat._getDataSortNStoreBlockData(key,value), result);
});

test('Should return phone false', () => {
    let result = false;
    let key = "phone";
    let value = "780-555-1212"
    assert.strictEqual(flat._getDataSortNStoreBlockData(key,value), result);
});

test('Should return note false', () => {
    let result = false;
    let key = "note";
    let value = "Customer is awesome!"
    assert.strictEqual(flat._getDataSortNStoreBlockData(key,value), result);
});

test('Should return firstName', () => {
    let result = ".USER_FIRST_NAME.    |aDoug";
    let key = "firstName";
    let value = "Doug";
    assert.strictEqual(flat._getDataSortNStoreBlockData(key,value), result);
});

test('Should return error message', () => {
    let flatDefaults = new Map();
    flatDefaults.set("USER_FIRST_NAME","Doug");
    let result = undefined;
    let defaults = {"FOO":"bar"};
    flat._updateDefaults(flatDefaults,defaults);
    assert.deepStrictEqual(flatDefaults.get("FOO"), result);
});

/** Convert date fields. */
test('Should convert all legit dates string to ANSI date', () => {
    let cJson = new Map(Object.entries(custJson));
    let result = '19740822';
    let expiry = '20210822';
    let err = [];
    flat._convertDates(err,cJson);
    assert.deepStrictEqual(cJson.get('dob'), result);
    assert.deepStrictEqual(cJson.get('expiry'), expiry);
    // console.log(cJson);
});
test('Should remove invalid dates and report them', () => {
    let dob = "bad date";
    let cJson = new Map(Object.entries(custJson));
    cJson.set("dob",dob);
    let result = `"dob" ${flat._msg.invalidDate}`;
    let err = [];
    flat._convertDates(err,cJson);
    assert.deepStrictEqual(err, [result]);
    // console.log(cJson,err);
});
test('Should convert date object', () => {
    let dob = new Date("1974-08-22");
    let cJson = new Map(Object.entries(custJson));
    cJson.set("dob",dob);
    let result = '19740822';
    let err = [];
    flat._convertDates(err,cJson);
    assert.deepStrictEqual(cJson.get('dob'), result);
    // console.log(cJson,err);
});