/**
 * This file config.js, loads the Learning Pass's configuration.
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

const utils = require('./lib/util');
const process = require('process');
// Check the .env for test partner keys and settings for the startup environment.
const dotenv = require('dotenv');
dotenv.config();
// Read the configuration from JSON in the ./config/config.json file.
const configFile = './config/config.json';

// The environment object of helper functions.
const environment = {};

// Staging environment object.
const defaultServerSettings = {
    'httpPort' : 3000,
    'httpsPort' : 3001,
    'envName' : 'staging'
};


// Default partner settings for testing purposes.
const testPartners = [{
    "name" : "default",
    "key" : "QJnc2JQLICWASpVj6eIR",
    "config" : "./config/default.json"
}];

/**
 * These are the canonical set and spelling of field names  
 * Learning Pass understands.
 * 
 * Theoretically, you could change these to another language as 
 * long as they match those in the config.json, default.json and 
 * any partner.json files.
 * 
 */
environment._fields = [
    "firstName","lastName","dob","gender","email",
    "phone","street","city","province","country","postalCode",
    "barcode","pin","type","expiry","branch","status","notes"
];

/**
 * Validates that the fields marked required match field 
 * names in the Learning Pass specification.
 * 
 * @param {*} partnerConfigs - 'required' fields read from JSON.
 * @returns true if at least all the partner's required fields 
 * match spelling and case of fields of JSON data inbound 
 * from partner. 
 */
const validatePartnerConfigs = function(partnerConfigs){
    let errors = [];

    // Test for special sub-objects.
    let requiredList = partnerConfigs.required;
    if (utils.hasArrayData(requiredList)) {
        requiredList.forEach(pField => {
            if (environment._fields.indexOf(pField) < 0){
                errors.push(pField);
            }
        });
    } else { 
        errors.push(`the "required" list is empty.`);
    } 


    // Optional may be a list and if it is, check for spelling
    if (utils.hasArrayData(partnerConfigs.optional)){
        let optionalList = partnerConfigs.optional;
        optionalList.forEach(pField => {
            if (environment._fields.indexOf(pField) < 0){
                errors.push(pField);
            }
        });
    }
    
    return errors;
};

/**
 * Load all the server configs from the configFile.
 */
(function(){
    let config;
    try {
        config = require(configFile);
    } catch (error) {
        // Happens if the file is missing.
        console.log(`Error in ${configFile}.`);
    }
    if (config){

        // Read in version from JSON and if it does not exist report '0.0' which could be diagnostic.
        environment.version = typeof(config.version) === 'string' || typeof(config.version) === 'number' ? config.version : "0.0";
        // Test if the server should be in loopback mode for situations like outages.
        environment.loopbackMode = typeof(config.loopbackMode) === 'boolean' ? config.loopbackMode : false;
        // Test if the server should be in loopback mode for situations like outages.
        environment.testMode = typeof(config.testMode) === 'boolean' ? config.testMode : false;
        

        // Load the server settings.
        // Read in the server configuration object, and have a default standing by if there isn't one.
        let envName = utils.hasStringData(process.env.NODE_ENV) ? process.env.NODE_ENV.toLowerCase() : "staging";
        // console.log('888>',envName);
        environment.serverConfig = utils.hasDictData(config[envName]) ? config[envName] : defaultServerSettings;
        console.log(`Server starting as '${environment.serverConfig.envName}'.`);


        // Load the default customer settings from the config.json
        if (utils.hasDictData(config.customerSettings)){
            let libraryName = config.customerSettings.library;
            if (utils.hasStringData(libraryName)){
                console.log(`Using customer settings for ${libraryName}`);
                environment.customerSettings = config.customerSettings;
            } else {
                throw new Error(`Error: ${configFile}'s 'customerSettings' must contain a 'library' entry.`)
            }
        } else {
            throw new Error(`Error config.json: ${configFile} is missing "customerSettings".`);
        }
        


        if (environment.testMode){
            // Test if the default had to be used because partner array is missing.
            environment.partners = testPartners;
            console.log(`TEST_MODE: using default partner settings for testing.`);
            console.log(`TEST_MODE: See documentation for more information.`);
        } else {
            // Load the partner preferences. If the server is in loopback mode server should return message, but if in testMode load
            // the defaultPartners defined above.
            // Find configs for partners, and if there isn't any listed, suggest using loopback mode and throw exception.
            // environment.partners = typeof(config[names.partners]) == 'object' ? config[names.partners] : {};
            environment.partners = config.partners;
        }

        // Create a dictionary with { key : {"./config/partner.json"}}
        // Find the apiKey
        // Find the partner's configuration.json.
        environment.partners.forEach(partner => {
            if (!utils.hasStringData(partner.key)) {
                console.log(`Error: cannot find partner api key for ${partner.name}! They will not be able to create new accounts.`);
            }
            try {
                let partnerConfigs = require(partner.config);
                // check the required fields definition.
                /** @TODO test the other objects in the partnerConfig object. */
                let anyErrors = validatePartnerConfigs(partnerConfigs);
                if (anyErrors.length > 0){
                    console.log(`**Error: ${partner.config} has errors: "${anyErrors}".`);
                } else {
                    // Save the partner's config.json data as their api key, value pair.
                    environment[partner.key] = partnerConfigs;
                    console.log(` - ${partner.name} configs loaded successfully.`);
                }
            } catch (err) {
                console.log(`Error in ${configFile}.`,err);
            }
        });
        console.log(`Finished loading valid partner configurations.`);

        // Test that the partners' required and optional fields contain valid names that match environment._fields.
    } else {
        console.log(`It may be missing or contain errors.`);
    }
})();


/**
 * Returns the version number of the json config file
 * or '0.0' if one is not in the json config file.
 */
environment.getVersion = function(){
    return environment.version;
};

/**
 * Returns the server configs or an empty object if none were read
 * from the config.json.
 */
environment.getServerConfig = function(){
    // if (typeof(environment.serverConfig) == 'object'){
    if (utils.hasDictData(environment.serverConfig)){
        return environment.serverConfig;
    } else {
        console.log(`Error server configs not set.`);
        return {};
    }
};

/**
 * Returns the configs for a given partner's API key.
 * @param {*} apiKey api key for a given customer.
 */
environment.getPartnerConfig = function(apiKey){
    if (!utils.hasStringData(apiKey)) {
        console.log(`Error no api key was submitted.`);
        return {};
    } else {
        if (utils.hasDictData(environment[apiKey])){
            return environment[apiKey];
        } else {
            console.log(`Error: invalid API key.`);
            return {};
        }
    }
};

/**
 * Returns all the default customer configurations required
 * to complete a well-formed flat file, as dictated by 
 * library policy.
 */
environment.getDefaultCustomerSettings = function(){
    if (utils.hasDictData(environment.customerSettings)){
        return environment.customerSettings;
    } else {
        console.log(`Error customer default configs not set.`);
        return {};
    }
};

/**
 * 
 * @returns the http port for the environment set by process.env.NODE_ENV.
 */
environment.getHttpPort = function() {
    return environment.serverConfig.httpPort;
}

/**
 * 
 * @returns the https port for the environment set by process.env.NODE_ENV.
 */
environment.getHttpsPort = function() {
    return environment.serverConfig.httpsPort;
}

/**
 * Returns true if the 'loopbackMode' key-value pair exists in the config.json
 * and is set to true, and false otherwise.
 */
environment.useLoopbackMode = function(){
    return environment.loopbackMode;
}

/**
 * The config file can contain a 'certs' entry in "staging" : { "directories" : { "certs" : "../https" } }.
 * As of release 1.0 it is preferrable to use .env and use the following instead.
 * LPASS_SSL_PRIVATE_KEY=/etc/ssl/private/some.key
 * LPASS_SSL_CERTIFICATE=/etc/ssl/certs/some.crt
 * 
 * @returns determines where to find the certs directory for the environment
 * as set by process.env.NODE_ENV.
 * @deprecated
 */
environment.getCertsDir = function() {
    return environment.serverConfig.directories.certs;
}

/**
 * Returns the certificate file name found in process.env.LPASS_SSL_CERTIFICATE
 * @returns the name and path of the SSL certificate for the LPass domain. 
 * set in process.env.LPASS_SSL_CERTIFICATE.
 */
environment.getSSLCertificate = function() {
    return process.env.LPASS_SSL_CERTIFICATE;
}

/**
 * Returns the private key file name found in process.env.LPASS_SSL_PRIVATE_KEY
 * @returns the name and path of the SSL private key for the LPass domain. 
 * set in process.env.LPASS_SSL_PRIVATE_KEY.
 */
environment.getSSLKey = function() {
    return process.env.LPASS_SSL_PRIVATE_KEY;
}

/**
 * Determines where to write flat files.
 * 
 * @returns the flat directory depending on the installation
 * environment set by process.env.NODE_ENV.
 */
environment.getFlatDir = function() {
    return environment.serverConfig.directories.flat;
}

/**
 * @returns true if the 'testMode' key-value pair exists in the config.json
 * and is set to true, and false otherwise.
 */
environment.useTestMode = function(){
    return environment.testMode;
}

/**
 * @returns the configured environment name.
 */
environment.getEnvName = function(){
    return environment.serverConfig.envName;
}

module.exports = environment;
