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

 // This module is specifically writing json files to the .data directory.
 // That would include statitics, or tokens if we decide to get fancy.
 // Dependencies
 const fs = require('fs');
 const path = require('path');
 var helpers = require('./helpers');


// container for this module
var lib = {};
// the base directory on the data folder 
lib.basedir = path.join(__dirname, '/../.data');


// write data to a file
lib.create = function(dir, file, data, callback){
    // Open the file for writing.
    fs.open(lib.basedir+'/'+dir+'/'+file+'.json', 'wx', function(err,fileDescriptor){
        if(!err && fileDescriptor) {
            // convert data to a string because we want to store just string versions of json.
            var stringData = JSON.stringify(data);
            // write the data to file.
            fs.writeFile(fileDescriptor, stringData, function(err){
                if (!err) {
                    // close the file when done.
                    fs.close(fileDescriptor, function(err){
                        if (!err) {
                            callback(false); // good.
                        } else {
                            callback('Error closing file.');
                        }
                    });
                } else {
                    callback('Error while writing to file.');
                }
            });
        } else {
            callback('Could not create new file, it may already exist.');
        }
    });
};

// Reads a json file.
// Required data: dir, file.
// Optional data: none.
lib.read = function(dir, file, callback){
    fs.readFile(lib.basedir+'/'+dir+'/'+file+'.json', 'utf8', function(err, data){
        if (!err) {
            var parsedData = helpers.parseJsonToObject(data);
            callback(false, parsedData);
        } else {
            callback(err, data);
        }
    });
};

lib.update = function(dir, file, data, callback) {
    // open the file for writing.
    fs.open(lib.basedir+'/'+dir+'/'+file+'.json', 'r+', function(err,fileDescriptor){
        if (!err && fileDescriptor) {
            var stringData = JSON.stringify(data);

            // Truncate the file, actually make it bigger or smaller.
            fs.truncate(fileDescriptor, function(err){
                if (!err && fileDescriptor){
                    fs.writeFile(fileDescriptor, stringData, function(err){
                        if (!err){
                            fs.close(fileDescriptor, function(err){
                                if (!err){
                                    callback(false); // Success.
                                } else {
                                    callback('Error closing the file.');
                                }
                            })
                        } else {
                            callback('Error writing to file.');
                        }
                    });
                    
                } else {
                    callback('Error truncating the file or bad file descriptor.');
                }
            });
        } else {
            callback('Could not open file for updating. It may not exist yet.');
        }
    });
};

// Deletes a given function.
// Required data: dir, file.
// Optional data: none.
lib.delete = function(dir, file, callback) {
    fs.unlink(lib.basedir+'/'+dir+'/'+file+'.json', function(err){
        if (!err) {
            callback(false);
        } else {
            callback('Error deleting file.');
        }
    });
};

module.exports = lib;
