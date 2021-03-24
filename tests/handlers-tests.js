/**
 * This file handlers-tests.js contains test functions for handlers.js,
 * as implemented in Learning Pass.
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
 const process = require('process');
 const dotenv = require('dotenv');
 dotenv.config();

 const handlers = require('../lib/handlers');

 const customerData = {   
    "firstName": "Michael",
    "lastName": "Mizer", 
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

 
 
 


 
// eslint-disable-next-line no-undef
test('Should create flat file for registration.', () => {
    let data = {
        trimmedPath: 'register',
        queryStringObject: {},
        method: 'post',
        headers: {
            "x-api-key": process.env.TEST_API_KEY,
            'user-agent': 'PostmanRuntime/7.26.8',
            accept: '*/*',
            'postman-token': '07e3a08c-c266-481a-9a3f-6ea4749e8276',
            host: 'localhost:3000',
            'accept-encoding': 'gzip, deflate, br',
            connection: 'keep-alive',
            'content-type': 'application/x-www-form-urlencoded',
            'content-length': '17'
        },
        payload: JSON.stringify(customerData)
     };
    handlers.register(data,(status,message) => {
        assert.strictEqual(status,200);
        console.log(message);
    });
});
// eslint-disable-next-line no-undef
test('Should allow only POST.', () => {
    let data = {
        trimmedPath: 'register',
        queryStringObject: {},
        method: 'put',
        headers: {
            "x-api-key": process.env.TEST_API_KEY,
            'user-agent': 'PostmanRuntime/7.26.8',
            accept: '*/*',
            'postman-token': '07e3a08c-c266-481a-9a3f-6ea4749e8276',
            host: 'localhost:3000',
            'accept-encoding': 'gzip, deflate, br',
            connection: 'keep-alive',
            'content-type': 'application/x-www-form-urlencoded',
            'content-length': '17'
        },
        payload: customerData
     };
    handlers.register(data,(status,message) => {
        assert.strictEqual(status,501);
        console.log(message);
    });
});
// eslint-disable-next-line no-undef
test('Should return 401 with no API key.', () => {
    let data = {
        trimmedPath: 'register',
        queryStringObject: {},
        method: 'post',
        headers: {
            // "x-api-key": process.env.TEST_API_KEY,
            'user-agent': 'PostmanRuntime/7.26.8',
            accept: '*/*',
            'postman-token': '07e3a08c-c266-481a-9a3f-6ea4749e8276',
            host: 'localhost:3000',
            'accept-encoding': 'gzip, deflate, br',
            connection: 'keep-alive',
            'content-type': 'application/x-www-form-urlencoded',
            'content-length': '17'
        },
        payload: customerData
     };
    handlers.register(data,(status,message) => {
        assert.strictEqual(status,401);
        console.log(message);
    });
});
// eslint-disable-next-line no-undef
test('Should return 204 with no API key.', () => {
    let data = {
        trimmedPath: 'register',
        queryStringObject: {},
        method: 'post',
        headers: {
            "x-api-key": process.env.TEST_API_KEY,
            'user-agent': 'PostmanRuntime/7.26.8',
            accept: '*/*',
            'postman-token': '07e3a08c-c266-481a-9a3f-6ea4749e8276',
            host: 'localhost:3000',
            'accept-encoding': 'gzip, deflate, br',
            connection: 'keep-alive',
            'content-type': 'application/x-www-form-urlencoded',
            'content-length': '17'
        },
        // payload: customerData
     };
    handlers.register(data,(status,message) => {
        assert.strictEqual(status,204);
        console.log(message);
    });
});