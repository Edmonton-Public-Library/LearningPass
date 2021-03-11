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
const flat = require('../lib/flat');
const custJson = [{   
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
  }];

test('Should reject missing customer data', () => {
    let cJson = {

    };
    let cFlat = flat.registrationData;
    let status = flat.status;
    let result = [flat._msg.noJson,flat._msg.noFlatContainer];
    try{
        flat.toFlat(cJson,cFlat)
        .then(console.log)
        .catch((err) => {
            return err;
        });
    } catch(e) {
        console.log(`${e} is expected.`);
    }
    assert.deepStrictEqual(status.errors,result);
});


// test('Should create flat customer data.', () => {
//     let cJson = {

//     };
//     let cFlat = flat.registrationData;
//     let status = flat.status;
//     let result = [flat._msg.noJson,flat._msg.noFlatContainer];
//     try{
//         flat.toFlat(cJson,cFlat)
//         .then(console.log)
//         .catch((err) => {
//             return err;
//         });
//     } catch(e) {
//         console.log(`${e} is expected.`);
//     }
//     assert.deepStrictEqual(status.errors,result);
// });