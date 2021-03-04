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

// Test that default settings are available from config.js.
test('should find branch => default (EPLMNA) in default customer settings.', () => {
    // console.log('888>',environment.getServerConfig());
    let env = environment.getDefaultCustomerSettings();
    let defaultBranch = env.branch.default;
    assert.strictEqual(defaultBranch, 'EPLMNA');
});

// Test read the testMode.
test('Tests the server testMode.', () => {
    // Note: test may fail if the config.json does not include 'testMode' : true.
    // console.log('888>',environment.getDefaultCustomerSettings());
    if (environment.useTestMode()){
        let env = environment.getPartnerConfig('12345678');
        let defaultPartner = env.name;
        // console.log('888>',env);
        assert.strictEqual(defaultPartner, 'default');
    } else {
        console.log('Server is not in testMode.');
    }
});

// Test read the loopbackMode.
test('Tests the server loopbackMode.', () => {
    // Note: test may fail if the config.json does not include 'testMode' : true.
    // console.log('888>',environment.getDefaultCustomerSettings());
    if (environment.useLoopbackMode()){
        assert.strictEqual(environment.useLoopbackMode(), true);
    } else {
        console.log('Server is not in loopbackMode.');
    }
});

test('should find mis-spelled field name "fistName"', () => {
    // assert.throws(function() { environment.validateFields("andrew",["fistName"]); }, Error);
    assert.deepStrictEqual(environment.validateFields("andrew",["fistName"]), ["fistName"]);
});