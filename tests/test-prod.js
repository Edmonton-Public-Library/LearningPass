/* eslint-disable no-undef */
/**
 * This file data.js contains utility functions for Learning Pass.
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
// We use the assert standard library to make assertions
const assert = require('assert');
const environment = require('../config.js');

// Test the server ports and directories.
test('Should return http port for production.', () => {
    // Note: test may fail if the config.json does not include 'testMode' : true.
    // console.log('99999>',environment.getDefaultCustomerSettings());
    let correctPort = 5000;
    let actualPort = environment.getHttpPort();
    assert.strictEqual(actualPort, correctPort);
});

// Test the server ports and directories.
test('Should return https port for production.', () => {
    // Note: test may fail if the config.json does not include 'testMode' : true.
    // console.log('99999>',environment.getDefaultCustomerSettings());
    let correctPort = 5001;
    let actualPort = environment.getHttpsPort();
    assert.strictEqual(actualPort, correctPort);
});