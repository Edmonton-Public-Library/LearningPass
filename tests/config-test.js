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
// We use the assert standard library to make assertions
const assert = require('assert');
const environment = require('../config.js');

// Test that we get the right version by default.
test('should return config version number', () => {
    // console.log('888>',environment.getVersion());
    assert.strictEqual(environment.getVersion(), '1.0');
});

// Test that we get the right HTTP port by default.
test('should return default HTTP port', () => {
    // console.log('888>',environment.getServerConfig());
    let env = environment.getServerConfig();
    let port = env['httpPort'];
    assert.strictEqual(port, 3000);
});

// Test that we get the right HTTPS port by default.
test('should return default HTTPS port', () => {
    // console.log('888>',environment.getServerConfig());
    let env = environment.getServerConfig();
    let port = env['httpsPort'];
    assert.strictEqual(port, 3001);
});

// The default is loaded which does not have a "envName" entry
// so you can test if the server started with 'staging' 
// on purpose or because the JSON config.json is malformed.
test('should fail to find default envName', () => {
    // console.log('888>',environment.getServerConfig());
    let env = environment.getServerConfig();
    let name = env.envName;
    // should 
    assert.strictEqual(typeof(name), 'undefined');
});

// Test that default settings are available from config.js.
test('should find branch => default (EPLMNA) in default customer settings.', () => {
    // console.log('888>',environment.getServerConfig());
    let env = environment.getDefaultCustomerSettings();
    let defaultBranch = env.branch.default;
    assert.strictEqual(defaultBranch, 'EPLMNA');
});

