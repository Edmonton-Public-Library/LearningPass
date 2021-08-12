/**
 * This file customer.js contains utility functions for Learning Pass.
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

const { hasArrayData } = require("./util");

const INIT_CODE = 200;

/**
 * Registration status is the bridge between the web service and the 
 * result of the customer registration. It computes the web response 
 * based results of the registration process. It provides the header 
 * status for the server, and any messages that the web service 
 * consumer should be aware of.
 */
const registrationStatus = function() {
    var status = Object.create(registrationStatus.prototype);
    registrationStatus.messages.length = 0;
    registrationStatus.headerCode = INIT_CODE;
    registrationStatus.customerId = '';
    registrationStatus.bulkStatus.length = 0;
    return status;
}


// The types of errors that can meaningfully map to a response header.
registrationStatus.statusTypes = {
    'success'         : 200, // Success.
    'created'         : 201, // account created successfully 
    'accepted'        : 202, // Valid accounts that fail to load because server is in loopback mode. 
    'noContent'       : 204, // reject 
    'incomplete'      : 206, // rejected account missing required fields. 
    'malFormed'       : 400, // rejected malformed data. 
    'apiKeyProblem'   : 401, // invalid or no API key. 
    'notAllowed'      : 405, // rejected account because underage or type not recognized.
    'tooManyRequests' : 429, // reject - config how many a minute. 
    'internalError'   : 500, // ILS unavailable (or something but let’s not get specific). 
    'notImplemented'  : 501  // Unfinished code-subs (under-construction).
};

const baseMessage = {
    200 : "Thank you for registering!", // Success. 
    201 : "Thank you for registering!", // account created successfully 
    202 : "Thank you, your account will be loaded shortly.", // Valid accounts that fail to load. 
    204 : "No customer data received.", // reject 
    206 : "Some required fields are incorrect or missing", // rejected account missing required fields. 
    400 : "Hmm, required fields are missing or broken", // rejected malformed data. 
    401 : "Sorry, your API key is missing, or invalid.", // invalid or no API key. 
    405 : "Sorry, this customer isn't allowed to use this service", // rejected account because underage or type not recognized.
    429 : "Why do you keep hounding me?", // reject - config how many a minute. 
    500 : "Somethings not right at our end.", // ILS unavailable (or something but let’s not get specific). 
    501 : "Are you using the correct request method?"     // Unfinished code-subs (under-construction).
};



// The list of messages to be sent back to the service caller.
registrationStatus.messages = [];
registrationStatus.bulkStatus = [];

/**
 * Sets the customer id for the response.
 * 
 * @param {*} id - String of the customer's ID.
 */
registrationStatus.prototype.setCustomerId = function(id) {
    if (id && typeof(id) === 'string') {
        registrationStatus.customerId = id;
    }
};

/**
 * 
 * @returns true if the response object currently has a response code
 * less than 202.
 */
registrationStatus.prototype.hasErrors = function(){
    return registrationStatus.headerCode >= 202;
};

/**
 * Get status computes the web service's status code.
 * 
 * Normally it is just 200, but there are systemic errors that are helpful
 * for the caller to know. The stuff you sent is broken in some fundamental
 * way, please check how your submission, or it's not you, it's me, if there
 * is a server problem that is preventing registrations, like a configuration
 * error.
 * 
 * @returns integer http status.
 */
registrationStatus.prototype.getStatus = function() {
    return registrationStatus.headerCode;
};

/**
 * Compiles a useful message for the web service caller.
 * 
 * If everything went well, it might be a simple message like
 * Thank you for joining EPL we look forward to seeing you soon!
 * 
 * But if things went bad, it could include things like 
 * The account ... had the following issues.
 */
registrationStatus.prototype.getMessages = function(reset = false) {
    let finalMessage = baseMessage[registrationStatus.headerCode];
    if (registrationStatus.customerId.length > 0) {
        finalMessage += `: ${registrationStatus.customerId}`;
    }
    registrationStatus.messages.forEach(element => {
        finalMessage += `, ${element}`;
    });
    if (reset) {
        registrationStatus.messages.length = 0;
        registrationStatus.headerCode = INIT_CODE;
    }
    return finalMessage;
};

/**
 * Alternate way to report how the registration went.
 * @since 2.1.00
 * @param {*} reset boolean true, resets the message list for this object after
 * the results have been returned.
 * @returns messageObject.
 */
registrationStatus.prototype.getMessageObject = function(reset = false) {
    let messageObj = {};
    
    messageObj.messages = [];
    if (registrationStatus.bulkStatus.length > 0) {
        return registrationStatus.bulkStatus;
    } else {
        messageObj.error = registrationStatus.prototype.hasErrors();
        messageObj.barcode = registrationStatus.customerId;
        registrationStatus.messages.forEach(element => {
            messageObj.messages.push(element);
        });
    }
    if (reset) {
        registrationStatus.messages.length = 0;
        registrationStatus.headerCode = INIT_CODE;
        registrationStatus.bulkStatus.length = 0;
    }
    return messageObj;
}

/**
 * Sets a given response type which will be compiled down to 
 * the most meaningful result when the dust settles. 
 * 
 * Every call adds the status to the existing code. Once
 * getStatus is called it will return the highest status submitted.
 * 
 * Tests
 * Be default returns 200.
 * Given an unrecognizable errorType getStatus() should return 500.
 * Given a errorType getStatus will report the highest error submitted.
 * 
 * @param {*} errorType from the errorTypes dictionary above. 
 */
registrationStatus.prototype.setStatus = function(errorType,message="") {
    // If the caller sent something we can't look up, 
    // that's a programming error, and the server is broken.
    registrationStatus.headerCode = errorType && typeof(registrationStatus.statusTypes[errorType]) !== 'undefined' ? registrationStatus.statusTypes[errorType] : 500;
    if (message) {
        if (typeof(message) === 'string') {
            registrationStatus.messages.push(message);
        } else if (hasArrayData(message)) {
            registrationStatus.bulkStatus = message;
        }
    } 
};

/**
 * Resets the response object.
 */
registrationStatus.prototype.reset = function() {
    registrationStatus.headerCode = INIT_CODE;
    registrationStatus.getMessages(true);
};

module.exports = registrationStatus;