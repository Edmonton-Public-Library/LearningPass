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


// Read the configuration from JSON in the ./config/config.json file.
const configFile = './config/config.json';
const names = {
    serverSettings : "serverConfig",
    version : "version",
    customerSettings : "customerSettings",
    partners : "partners"
};


const environment ={};


// Staging environment object.
const defaultServerSettings = {
    'httpPort' : 3000,
    'httpsPort' : 3001
    // Do not include an 'envName' because neg. test for it warns that 
    // the default is being used, but not because the process.env.NODE_ENV
    // was set that way.
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
        "userGroupId" : "",
        "userNameDspPref" : 0,
        "userPrefLang" : "ENGLISH",
        "userRoutingFlag" : "Y",
        "userChgHistRule" : "ALLCHARGES",
        "userCategory1" : "",
        "userCategory2" : "NA",
        "userCategory3" : "",
        "userCategory4" : "",
        "userCategory5" : "",
        "userAccess" : "PUBLIC",
        "userEnvironment" : "PUBLIC",
        "userMailingaddr" : 1,
        "notifyVia" : "PHONE",
        "retrnmail" : "YES"
    }
};


// Default partner settings for testing purposes.
const defaultPartners = [{
    "name" : "default",
    "key" : "12345678",
    "config" : "./config/default.json"
}];


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
        environment.version = typeof(config.version) !== 'null' ? config.version : "0.0";
        
        // Read in the server configuration object, and have a default standing by if there isn't one.
        let envName = typeof(process.env.NODE_ENV) == 'string' ? process.env.NODE_ENV.toLowerCase() : "";
        // console.log('888>',envName);
        environment.serverConfig = typeof(config[envName]) == 'object' ? config[envName] : defaultServerSettings;
        if (! environment.serverConfig.envName){
            console.log(`Warning: using default server configuration. No server settings for '${envName}' in ${configFile}.`);
        } else {
            console.log(`Server starting as '${environment.serverConfig.envName}'.`);
        }

        // Load the customer settings.
        environment.customerSettings = typeof(config[names.customerSettings]) == 'object' ? config[names.customerSettings] : defaultCustomerSettings;
        let csName = environment.customerSettings.library;
        // A custom config may not have included 'library' or have assigned an object to it.
        if (!csName || typeof(csName) != 'string' || csName === 'default'){
            console.log(`Warning: using default ${names.customerSettings} in in ${configFile}. They may be missing or invalid json.`);
            console.log(`See documentation for more information. Using 'default' customer settings.`);
        } else {
            console.log(`Using customer settings for ${csName}`);
        }

        // Find configs for partners.
        environment.partners = typeof(config[names.partners]) == 'object' ? config[names.partners] : defaultPartners;

        // Test if the default had to be used because partner array is missing.
        let partnerName = environment.partners[0].name;
        if (!partnerName || typeof(partnerName) != 'string' || partnerName === 'default'){
            console.log(`Warning: using default ${names.partners} in ${configFile}. They may be missing or invalid json.`);
            console.log(`See documentation for more information. Using TEST partner settings.`);
        } else {

            // Create a dictionary with { key : {"./config/partner.json"}}
            // Find the apiKey
            // Find the partner's configuration.json.
            environment.partners.forEach(partner => {
                let partnerKey = partner.key;
                if (!partnerKey) {
                    console.log(`Error: cannot find partner api key for ${partner.name}! They will not be able to create new accounts.`);
                }
                try {
                    let partnerConfig = require(partner.config);
                    // Save the partner's config.json data as their api key, value pair.
                    environment[partner.key] = partnerConfig;
                    console.log(`${partner.name} configs loaded.`);
                } catch (error) {
                    console.log(`Error in ${configFile}. Cannot find ${partner.name} configuration file.`);
                }
            });
            console.log(`Partner configs loaded.`,environment);
        }
    } else {
        console.log(`It may be missing or contain errors.`);
    }
})();

/**
 * Returns the version number of the json config file
 * or '0.0' if one is not in the json config file.
 */
environment.getVersion = function(){
    if (typeof(environment.version) == 'string'){
        return environment.version;
    } else {
        console.log(`Error config version not set.`);
        return {};
    }
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
        if (typeof(str) == 'string' && str.trim().length() > 0){
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

module.exports = environment;
