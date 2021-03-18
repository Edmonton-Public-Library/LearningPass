/**
 * This file handlers.js contains utility functions for Learning Pass.
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

 const isTestMode = require('../config').useTestMode;

// Routes object
const handlers = {};

/**
 * Registers a customer.
 * @param {*} data customer's registration data.
 * @param {*} callback 
 */
handlers.register = function(data, callback){
    if (isTestMode) {
        console.log('registration request: ',data);
    }
    /** @TODO finish customer registration. */
    callback(200, {'name' : 'sample handler'});
};

/**
 * Returns okay status if the server is running.
 * @param {*} data {'status' : 'okay'} 
 * @param {*} callback 
 */
handlers.status = function(data, callback){
    callback(200, {'status' : 'okay'});
};

/**
 * 
 * @param {*} data is written to console if the server is in test mode.
 * @param {*} callback 404 and empty object.
 */
handlers.notFound = function(data, callback){
    if (isTestMode) {
        console.log('404 request: ',data);
    }
    callback(404);
};

module.exports = handlers;