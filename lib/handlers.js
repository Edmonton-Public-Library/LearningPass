/**
 * This file handlers.js contains route-handler object for Learning Pass.
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
const logger = require('../logger');
const environment = require('../config');
const registrationStatus = require('./response');
const customerHelper = require('./customer');
const helpers = require('./helpers');

/**
 * Convenience function for testing for data in a dictionary.
 * @param {*} obj any object
 * @returns true if the object is a dictionary and has data, and false otherwise.
 */
const hasDictData = function(obj){
    if(!obj) return false;
    if(Array.isArray(obj)) return false;
    if(obj.constructor != Object) return false;
    if(Object.keys(obj).length == 0) return false;
    return true;
};

// Routes object
const handlers = {};

/**
 * Registers a customer.
 * @param {*} data customer's registration data.
 * @param {*} callback 
 */
handlers.register = function(data, callback){
    if (environment.useTestMode()) {
        logger.debug(`registration request: '${JSON.stringify(data)}'`);
    }
    
    if (data.method === 'post') {
        // Check if apiKey was sent. We need that to determine which org is calling.
        if (data.headers["x-api-key"]) {
            // payload is checked in the server
            let key = data.headers["x-api-key"];
            let json = helpers.parseJsonToObject(data.payload);
            if (hasDictData(json)) {
                customerHelper.createAccount(registrationStatus,key,json);
            } else {
                registrationStatus.setStatus('noContent');
            }
        } else {
            registrationStatus.setStatus('apiKeyProblem');
        }
    } else {
        registrationStatus.setStatus('notImplemented');
    }
    // return what happened.
    callback(registrationStatus.getStatus(), 
     {"status" : registrationStatus.getStatus(), "message" : registrationStatus.getMessages(true)});
};

/**
 * Returns okay status if the server is running.
 * @param {*} data {'status' : 'okay'} 
 * @param {*} callback 
 */
handlers.status = function(data, callback){
    if (environment.useTestMode()) {
        logger.info(`status request: ${JSON.stringify(data)}'`);
    }
    callback(200, {"status" : 200, "message" : "ok"});
};

/**
 * 
 * @param {*} data is written to console if the server is in test mode.
 * @param {*} callback 404 and empty object.
 */
handlers.notFound = function(data, callback){
    if (environment.useTestMode()) {
        logger.info(`404 request: '${JSON.stringify(data)}'`);
    }
    callback(404, {"status": 404, "message" : "Resource not found"});
};

module.exports = handlers;