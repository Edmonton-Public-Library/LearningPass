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

 const fs = require('fs');
 
 // The flat file container.
 const flat = {};

 // Takes customer data as JSON and converts it to 
 // into a format suitable to be loaded into a Symphony system
 // in the form of a string.
 flat.toFlat = function(customerdata){
    
 };

 // Takes flat data and writes it to a file in a directory 
 // specified in config.
 flat.write = function(filename,flatdata){

 };

 module.exports = flat;