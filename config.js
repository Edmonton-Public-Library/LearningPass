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
// Read the configuration from JSON in the ./config/config.json file.
const fs = require('fs');
const helpers = require('./lib/helpers');

const environment = {};

// Staging environment object.
// environment.staging = {
//     'httpPort' : 3000,
//     'httpsPort' : 3001,
//     'envName' : 'staging'
// };

// production environment object.
// environment.production = {
//     'httpPort' : 5000,
//     'httpsPort' : 5001,
//     'envName' : 'production'
// };

/**
 * 
 * Read the config file and load the environment.
 */
environment.getVersion = function (err, callback) {
    fs.readFile('./config/config.json', 'utf8', function (err, data) {
        if (!err) {
            // var environmentName = typeof(process.env.NODE_ENV) == 'string' ? process.env.NODE_ENV.toLowerCase() : "";
            let config = helpers.parseJsonToObject(data);
            if (config){
                // environment._env.server = typeof(environmentName) == 'string' && environmentName.length > 0 ? config[environmentName] : config['staging'];
                // This currently is not fatal but could be important later.
                // console.log("I did get here BTW:",config);
                version = typeof(config.version) == 'string' ? config.version : "0.1";
                callback(version);
            } else {
                console.log('Error: config/config.json is not valid JSON. Check for errors in config/config.json');
                callback('Error: server failed to load config.');
            }
        } else {
            console.log('Error: reading config.json. Check it exists, and is not empty.',err);
            callback('Error: server failed to load config.');
        }
    });
};



// // determine which should be exported.
// var environmentName = typeof(process.env.NODE_ENV) == 'string' ? process.env.NODE_ENV.toLowerCase() : "";

// // Check that the user has selected an environment that is defined.
// var environmentToExport = typeof(environment[environmentName]) == 'object' ? environment[environmentName] : environment.staging;
// module.exports = environmentToExport;
module.exports = environment;
