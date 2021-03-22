/* eslint-disable no-undef */
/**
 * This file contains test functions for Learning Pass configuration.
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
        let env = environment.getPartnerConfig('QJnc2JQLICWASpVj6eIR');
        // console.log('888>',env);
        assert.strictEqual(env.name, 'default');
    } else {
        console.log('Server is not in testMode.');
    }
});

// Test read the loopbackMode.
test('Tests the server loopbackMode.', () => {
    // Note: test may fail if the config.json does not include 'testMode' : true.
    // console.log('99999>',environment.getDefaultCustomerSettings());
    if (environment.useLoopbackMode()){
        assert.strictEqual(environment.useLoopbackMode(), true);
    }
    console.log('Server is not in loopbackMode.');
});

// Test the server ports and directories.
test('Should return http port for staging.', () => {
    let correctPort = 3000;
    let actualPort = environment.getHttpPort();
    assert.strictEqual(actualPort, correctPort);
});

// Test the server ports and directories.
test('Should return https port for staging.', () => {
    let correctPort = 3001;
    let actualPort = environment.getHttpsPort();
    assert.strictEqual(actualPort, correctPort);
});

// Test the server directories.
test('Should return flat dir for staging.', () => {
    let correctDir = "../tests/Incoming";
    let actualDir = environment.getFlatDir();
    assert.strictEqual(actualDir, correctDir);
});
test('Should return certs dir for staging.', () => {
    let correctDir = "../../https";
    let actualDir = environment.getCertsDir();
    assert.strictEqual(actualDir, correctDir);
});

// Test environment name.
test('Should return environment name "staging".', () => {
    let correctName = "staging";
    let actualName = environment.getEnvName();
    assert.strictEqual(actualName, correctName);
});
