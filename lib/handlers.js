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

/**
 * Tests if the argument is an array with data in it.
 * @param {*} obj - any javascript object.
 * @returns true if obj is an array and contains data, 
 * and false otherwise.
 */
 const hasArrayData = function(obj){
    if(!obj) return false;
    return obj instanceof Array && obj.length > 0 ? true : false;
};

// Routes object
const handlers = {};
const learningPassVersion = "v2.1.00";

/**
 * Registers a customer.
 * @param {*} data customer's registration data.
 * @param {*} callback 
 */
handlers.register = function(data, callback){
    if (environment.useTestMode()) {
        logger.debug(`register request: '${JSON.stringify(data)}'`);
    }
    let regStatus = registrationStatus();
    if (data.method === 'post') {
        // Check if apiKey was sent. We need that to determine which org is calling.
        if (data.headers["x-api-key"]) {
            // payload is checked in the server
            let key = data.headers["x-api-key"];
            let json = helpers.parseJsonToObject(data.payload);
            if (hasDictData(json)) {
                regStatus = customerHelper.createAccount(key,json);
            } else if (hasArrayData(json)) {
                let allResponses = [];
                json.forEach(customer => {
                    let rs = customerHelper.createAccount(key,customer);
                    allResponses.push(rs.getMessageObject());
                });
                regStatus.setStatus('success',allResponses);
            } else {
                regStatus.setStatus('noContent');
            }
        } else {
            regStatus.setStatus('apiKeyProblem');
        }
    } else {
        regStatus.setStatus('notImplemented');
    }
    // return what happened.
    callback(regStatus.getStatus(), regStatus.getMessageObject());
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
 * Returns okay status and server version.
 * @param {*} data {'status' : 'okay'} 
 * @param {*} callback 
 */
 handlers.version = function(data, callback){
    if (environment.useTestMode()) {
        logger.info(`version request: ${JSON.stringify(data)}'`);
    }
    callback(200, {"status" : 200, "message" : `${learningPassVersion}`});
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