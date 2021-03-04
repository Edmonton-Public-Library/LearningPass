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
test('Should do something...', () => {
    // console.log('888>',environment.getVersion());
    let error = customerErrors;
    let helpr = customerHelper;
    let c = {   
      "firstName": "Andrew",
      "lastName": "Nisbet", 
      "dob": "19740822", 
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
      "expiry": "20210822",
      "branch": "",
      "status": "OK",
      "notes": ""
    };
    helpr.validate(error,c)
        .then(c)
        // Any error from any step above will get caught here.
        .catch(console.error);
    // console.log("888>",error);
    // console.log("999>",c);
    assert.strictEqual(error.errors,1);
    assert.strictEqual(error.warnings,2);
    assert.strictEqual(error.status,200);
    assert.strictEqual(c.pin,"iLOVEbread");
});