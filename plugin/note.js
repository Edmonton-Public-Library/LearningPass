/**
 * This file note.js contains utility functions for Learning Pass.
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

/**
 * This is a template file of how to extend Learning Pass 
 * to compile data in note fields.
 */
const noteCompiler = {};

noteCompiler.compile = (str,resultDict) => new Promise((resolve,reject) => {
    console.log('doing work...');
    resultDict.result = "SUCCESS";
    // Some condition to resolve or reject...
    let err = true;
    if (err) {
        resolve('...done.');
    } else {
        resultDict.errors = "customer is not nice";
        reject(new Error('customer is not nice'));
    }
});

module.exports = noteCompiler;