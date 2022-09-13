/* eslint-disable no-undef */
/**
 * flat-tests.js contains tests for creating flat files for Symphony ILS.
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

const flat = require('../lib/flat');
const flatTools = flat();
const assert = require('assert');

// Bogus customer data.
const custJson = {   
"firstName": "Lewis",
"middleName": "Fastest",
"lastName": "Hamilton", 
"dob": "1974-08-22", 
"gender": "", 
"email": "example@gmail.com", 
"phone": "780-555-1212", 
"street": "11535 74 Ave.", 
"city": "Edmonton", 
"province": "AB", 
"country": "", 
"postalCode": "T6G0G9",
"barcode": "1101223334444",    	
"pin": "IlikeBread",    	
"type": "MAC-DSSTUD",    	
"expiry": "2021-08-22",
"careOf": "Doe, John",
"branch": "",    	
"status": "OK",    	
"notes": "Hi" 
};

test("Should write flat to file.",() => {
    // const filePath = '/home/anisbet/Dev/EPL/LearningPass/.data/test/test.flat';
    const filePath = '../.data/test/test.flat';
    let flatDefaults = {
        "NOTIFY_VIA" : "PHONE",
        "RETRNMAIL" : "YES"
    };
    let fCustomer = flatTools.toFlatCustomer(custJson,flatDefaults);
    if (flatTools.writeFlat(fCustomer,filePath)) {
        console.log("Wrote to file.");
    } else {
        console.log("**Problem writing to file.");
    }
});

test("Should print a well formed flat file.",() => {
    let result = 
        '*** DOCUMENT BOUNDARY ***' + '\n' +
        'FORM=LDUSER' + '\n' +
        '.USER_FIRST_NAME.   |aLewis' + '\n' +
        '.USER_MIDDLE_NAME.   |aFastest' + '\n' +
        '.USER_LAST_NAME.   |aHamilton' + '\n' +
        '.USER_BIRTH_DATE.   |a19740822' + '\n' +
        '.USER_ID.   |a1101223334444' + '\n' +
        '.USER_PIN.   |aIlikeBread' + '\n' +
        '.USER_PROFILE.   |aMAC-DSSTUD' + '\n' +
        '.USER_PRIV_EXPIRES.   |a20210822' + '\n' +
        '.USER_STATUS.   |aOK' + '\n' +
        '.USER_NAME_DSP_PREF.   |a0' + '\n' +
        '.USER_PREF_LANG.   |aENGLISH' + '\n' +
        '.USER_ROUTING_FLAG.   |aY' + '\n' +
        '.USER_CHG_HIST_RULE.   |aALLCHARGES' + '\n' +
        '.USER_ACCESS.   |aPUBLIC' + '\n' +
        '.USER_ENVIRONMENT.   |aPUBLIC' + '\n' +
        '.USER_MAILINGADDR.   |a1' + '\n' +
        '.USER_ADDR1_BEGIN.' + '\n' +
        '.EMAIL.   |aexample@gmail.com' + '\n' +
        '.PHONE.   |a780-555-1212' + '\n' +
        '.STREET.   |a11535 74 Ave.' + '\n' +
        '.CITY/STATE.   |aEdmonton' + '\n' +
        '.POSTALCODE.   |aT6G0G9' + '\n' +
        '.CARE/OF.   |aDoe, John' + '\n' +
        '.USER_ADDR1_END.' + '\n' +
        '.USER_XINFO_BEGIN.' + '\n' +
        '.NOTE.   |aHi' + '\n' +
        '.NOTIFY_VIA.   |aPHONE' + '\n' +
        '.RETRNMAIL.   |aYES' + '\n' +
        '.USER_XINFO_END.' + '\n';
    
    let flatDefaults = {
        "NOTIFY_VIA" : "PHONE",
        "RETRNMAIL" : "YES"
    };
    let fCustomer = flatTools.toFlatCustomer(custJson,flatDefaults);
    flatTools.writeFlat(fCustomer);
    assert.strictEqual(fCustomer.stringify(),result);
});



test('Should reject missing customer data', () => {
    let cJson = {

    };
    let result = ['Customer json data empty or missing.'];
    let fCustomer = flatTools.toFlatCustomer(cJson);
    // console.log(fCustomer.getErrors());
    assert.deepStrictEqual(fCustomer.getErrors(),result);
});

test('Should return postalCode false', () => {
    let result = false;
    let key = "postalCode";
    let value = "T6G 0G4"
    assert.strictEqual(flatTools._getDataSortNStoreBlockData(key,value), result);
});

test('Should return street false', () => {
    let result = false;
    let key = "street";
    let value = "123 45 Street"
    assert.strictEqual(flatTools._getDataSortNStoreBlockData(key,value), result);
});

test('Should return email false', () => {
    let result = false;
    let key = "email";
    let value = "name@example.com"
    assert.strictEqual(flatTools._getDataSortNStoreBlockData(key,value), result);
});

test('Should return city false', () => {
    let result = false;
    let key = "city";
    let value = "Edmonton, AB"
    assert.strictEqual(flatTools._getDataSortNStoreBlockData(key,value), result);
});

test('Should return phone false', () => {
    let result = false;
    let key = "phone";
    let value = "780-555-1212"
    assert.strictEqual(flatTools._getDataSortNStoreBlockData(key,value), result);
});

test('Should return note false', () => {
    let result = false;
    let key = "note";
    let value = "Customer is awesome!"
    assert.strictEqual(flatTools._getDataSortNStoreBlockData(key,value), result);
});

test('Should return firstName', () => {
    let result = ".USER_FIRST_NAME.   |aDoug";
    let key = "firstName";
    let value = "Doug";
    assert.strictEqual(flatTools._getDataSortNStoreBlockData(key,value), result);
});

test('Should return error message', () => {
    let flatDefaults = new Map();
    flatDefaults.set("USER_FIRST_NAME","Doug");
    let result = undefined;
    let defaults = {"FOO":"bar"};
    flatTools._updateDefaults(flatDefaults,defaults);
    assert.deepStrictEqual(flatDefaults.get("FOO"), result);
});

test("Should write out the 'care/of' field file.",() => {
    let result = 
        '*** DOCUMENT BOUNDARY ***' + '\n' +
        'FORM=LDUSER' + '\n' +
        '.USER_FIRST_NAME.   |aLewis' + '\n' +
        '.USER_MIDDLE_NAME.   |aFastest' + '\n' +
        '.USER_LAST_NAME.   |aHamilton' + '\n' +
        '.USER_BIRTH_DATE.   |a19740822' + '\n' +
        '.USER_ID.   |a1101223334444' + '\n' +
        '.USER_PIN.   |aIlikeBread' + '\n' +
        '.USER_PROFILE.   |aMAC-DSSTUD' + '\n' +
        '.USER_PRIV_EXPIRES.   |a20210822' + '\n' +
        '.USER_STATUS.   |aOK' + '\n' +
        '.USER_NAME_DSP_PREF.   |a0' + '\n' +
        '.USER_PREF_LANG.   |aENGLISH' + '\n' +
        '.USER_ROUTING_FLAG.   |aY' + '\n' +
        '.USER_CHG_HIST_RULE.   |aALLCHARGES' + '\n' +
        '.USER_ACCESS.   |aPUBLIC' + '\n' +
        '.USER_ENVIRONMENT.   |aPUBLIC' + '\n' +
        '.USER_MAILINGADDR.   |a1' + '\n' +
        '.USER_CATEGORY5.   |aECONSENT\n' +
        '.USER_ADDR1_BEGIN.' + '\n' +
        '.EMAIL.   |aexample@gmail.com' + '\n' +
        '.PHONE.   |a780-555-1212' + '\n' +
        '.STREET.   |a11535 74 Ave.' + '\n' +
        '.CITY/STATE.   |aEdmonton' + '\n' +
        '.POSTALCODE.   |aT6G0G9' + '\n' +
        '.CARE/OF.   |aDoe, John' + '\n' +
        '.USER_ADDR1_END.' + '\n' +
        '.USER_XINFO_BEGIN.' + '\n' +
        '.NOTE.   |aHi' + '\n' +
        '.NOTIFY_VIA.   |aPHONE' + '\n' +
        '.RETRNMAIL.   |aNO' + '\n' +
        '.USER_XINFO_END.' + '\n';
    
    let flatDefaults = {
        "USER_CATEGORY5": "ECONSENT",
        "NOTIFY_VIA" : "PHONE",
        "RETRNMAIL" : "NO"
    };
    let fCustomer = flatTools.toFlatCustomer(custJson,flatDefaults);
    flatTools.writeFlat(fCustomer);
    assert.strictEqual(fCustomer.stringify(),result);
});
