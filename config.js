/**
 * This file config.js, loads the Learning Pass's configuration.
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

const { env } = require("process");
const fs = require('fs');

// Read the configuration from JSON in the ./config/config.json file.
const configFile = './config/config.json';

// A well formed config.json file contains these objects.
const names = {
    serverSettings : "serverConfig",
    customerSettings : "customerSettings",
    partners : "partners"
};


const environment ={};


// Staging environment object.
const defaultServerSettings = {
    'httpPort' : 3000,
    'httpsPort' : 3001,
    'envName' : 'staging'
};


// Default customer configs.
const defaultCustomerSettings = {
    "library": "default",
    "pin" : {
        "min" : 4,
        "max" : 125,
        "charsAllowed" : "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ!#$@,.:; -_+="
    },
    "branch" : {
        "default" : "EPLMNA",
        "valid" : ["EPLMNA","EPLWMC","EPLCAL","EPLJPL",
            "EPLCPL","EPLSTR","EPLWOO","EPLHIG","EPLCSD",
            "EPLMCN","EPLLON","EPLRIV","EPLWHP","EPLMEA",
            "EPLIDY","EPLMLW","EPLWMC","EPLCPL","EPLABB"
        ]},
    "fields" : [
        "customer","firstName","lastName","dob","gender","email",
        "phone","street","city","province","country","postalCode",
        "barcode","pin","type","expiry","branch","status","notes"
    ],
    "defaults" : {
        // "city" : "Edmonton",
        // "province" : "AB",
        // "country" : "Canada"
    },
    "symphonyDefaults" : {
        "USER_NAME_DSP_PREF" : 0,
        "USER_PREF_LANG" : "ENGLISH",
        "USER_ROUTING_FLAG" : "Y",
        "USER_CHG_HIST_RULE" : "ALLCHARGES",
        "USER_CATEGORY2" : "NA",
        "USER_CATEGORY3" : "ECONSENT",
        "USER_ACCESS" : "PUBLIC",
        "USER_ENVIRONMENT" : "PUBLIC",
        "USER_MAILINGADDR" : 1,
        "NOTIFY_VIA" : "PHONE",
        "RETRNMAIL" : "YES"
    }
};


// Default partner settings for testing purposes.
const testPartners = [{
    "name" : "default",
    "key" : "12345678",
    "config" : "./config/default.json"
}];

environment._fields = [
    "firstName","lastName","dob","gender","email",
    "phone","street","city","province","country","postalCode",
    "barcode","pin","type","expiry","branch","status","notes"
];

/**
 * Validates that the fields marked required match field 
 * names in the Learning Pass specification.
 * 
 * @param {*} jsonFile - string name of the file with errors.
 * @param {*} pFields - 'required' fields read from JSON.
 * @returns true if at least all the partner's required fields 
 * match spelling and case of fields of JSON data inbound 
 * from partner. 
 */
environment.validateFields = function(objName,pFields){
    let errors = [];
    if (!pFields || typeof(pFields) != 'object' || pFields.length == 0) { 
        errors.push(`the "${objName}" object is empty.`);
        return errors;
    } else {
        pFields.forEach(pField => {
            if (environment._fields.indexOf(pField) < 0){
                errors.push(pField);
            }
        });
        return errors;
    }
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
        let envName = typeof(process.env.NODE_ENV) == 'string' ? process.env.NODE_ENV.toLowerCase() : "";
        // console.log('888>',envName);
        environment.serverConfig = typeof(config[envName]) == 'object' ? config[envName] : defaultServerSettings;
        if (! environment.serverConfig.envName){
            console.log(`Warning: using default server configuration. No server settings for '${envName}' in ${configFile}.`);
        } else {
            console.log(`Server starting as '${environment.serverConfig.envName}'.`);
        }


        // Load the default customer settings.
        environment.customerSettings = typeof(config[names.customerSettings]) == 'object' ? config[names.customerSettings] : defaultCustomerSettings;
        let csName = environment.customerSettings.library;
        // A custom config may not have included 'library' or have assigned an object to it.
        if (!csName || typeof(csName) != 'string' || csName === 'default'){
            console.log(`Warning: using default ${names.customerSettings} in in ${configFile}. They may be missing or invalid json.`);
            console.log(`See documentation for more information. Using 'default' customer settings.`);
        } else {
            console.log(`Using customer settings for ${csName}`);
        }


        if (environment.testMode){
            // Test if the default had to be used because partner array is missing.
            environment.partners = testPartners;
            console.log(`Warning: using default partner settings for testing.`);
            console.log(`See documentation for more information. Using TEST partner settings.`);
        } else {
            // Load the partner preferences. If the server is in loopback mode server should return message, but if in testMode load
            // the defaultPartners defined above.
            // Find configs for partners, and if there isn't any listed, suggest using loopback mode and throw exception.
            environment.partners = typeof(config[names.partners]) == 'object' ? config[names.partners] : {};
        }


        // Confirm that the partners object has content, but only if server is not in loopback mode.
        if (Object.keys(environment.partners).length == 0 && environment.loopbackMode == false){
            console.log(`Error: no partner organizations found in config.`);
            console.log(`Consider putting the server into loopback with 'loopbackMode':true in ${configFile}`);
            throw new Error(`Error, no partner organizations listed in ${configFile}`);
        }


        // Create a dictionary with { key : {"./config/partner.json"}}
        // Find the apiKey
        // Find the partner's configuration.json.
        environment.partners.forEach(partner => {
            let partnerKey = partner.key;
            if (!partnerKey) {
                console.log(`Error: cannot find partner api key for ${partner.name}! They will not be able to create new accounts.`);
            }
            try {
                let partnerConfigs = require(partner.config);
                // check the required fields definition.
                let anyErrors = environment.validateFields('required', partnerConfigs.required);
                if (anyErrors.length > 0){
                    console.log(`**Error: ${partner.config} has errors: "${anyErrors}".`);
                } else {
                    // Save the partner's config.json data as their api key, value pair.
                    environment[partner.key] = partnerConfigs;
                    console.log(` - ${partner.name} configs loaded successfully.`);
                }
            } catch (error) {
                console.log(`Error in ${configFile}. Cannot find file ${partner.config}.`);
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
    if (typeof(environment.serverConfig) == 'object'){
        return environment.serverConfig;
    } else {
        console.log(`Error server configs not set.`);
        return {};
    }
};

/**
 * Returns the configs for a given partner's API key.
 * @param {*} str api key for a given customer.
 */
environment.getPartnerConfig = function(str){
    if (!str) {
        console.log(`Error no api key was submitted.`);
        return {};
    } else {
        if (typeof(str) === 'string' && str.trim().length > 0){
            let apiKey = str.trim();
            if (typeof(environment[apiKey]) == 'object'){
                return  environment[apiKey];
            } else {
                console.log(`Error: invalid API key.`);
                return {};
            }
        } else {
            console.log(`Error: expected API key.`);
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
    if (typeof(environment.customerSettings) == 'object'){
        return environment.customerSettings;
    } else {
        console.log(`Error customer default configs not set.`);
        return {};
    }
};

/**
 * Returns true if the 'loopbackMode' key-value pair exists in the config.json
 * and is set to true, and false otherwise.
 */
environment.useLoopbackMode = function(){
    return environment.loopbackMode;
}

/**
 * Returns true if the 'testMode' key-value pair exists in the config.json
 * and is set to true, and false otherwise.
 */
environment.useTestMode = function(){
    return environment.testMode;
}

module.exports = environment;
