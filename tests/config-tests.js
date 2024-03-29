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
const dotenv = require('dotenv');
dotenv.config();

// Test that we get the right version by default.
test('should return config version number', () => {
    // console.log('888>',environment.getVersion());
    assert.strictEqual(environment.getVersion(), '1.02.01');
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
/** This test is config dependent. Uncomment after setting up config.json */
// test('Should return flat dir for staging.', () => {
//     let correctDir = "../tests/Incoming";
//     let actualDir = environment.getFlatDir();
//     assert.strictEqual(actualDir, correctDir);
// });
/** @deprecated Use .env to specify the cert and key files. */
// test('Should return certs dir for staging.', () => {
//     let correctDir = "../https";
//     let actualDir = environment.getCertsDir();
//     assert.strictEqual(actualDir, correctDir);
// });

/** 
 * If this fails your .env may not be setup correctly.
 * It should include:
 * LPASS_SSL_PRIVATE_KEY=/etc/ssl/private/some.key
 * LPASS_SSL_CERTIFICATE=/etc/ssl/certs/some.crt
 * or the like.
 */
test('Should return certs file name.', () => {
    let correctCert = process.env.LPASS_SSL_CERTIFICATE;
    let actualCert = environment.getSSLCertificate();
    assert.strictEqual(actualCert, correctCert);
});

/** 
 * If this fails your .env may not be setup correctly.
 * It should include:
 * LPASS_SSL_PRIVATE_KEY=/etc/ssl/private/some.key
 * LPASS_SSL_CERTIFICATE=/etc/ssl/certs/some.crt
 * or the like.
 */
test('Should return private key.', () => {
    let correctKey = process.env.LPASS_SSL_PRIVATE_KEY;
    let actualKey = environment.getSSLKey();
    assert.strictEqual(actualKey, correctKey);
});

// Test environment name.
test('Should return environment name "staging".', () => {
    let correctName = "staging";
    let actualName = environment.getEnvName();
    assert.strictEqual(actualName, correctName);
});

// Test if strict mode is set for the 'default' partner.
test('Tests the strict checks mode for the default partner.', () => {
    // Not set for NEOS
    if (environment.useTestMode()){
        // Set for 'default'
        let env = environment.getPartnerConfig('QJnc2JQLICWASpVj6eIR');
        // console.log(`>>> ${JSON.stringify(env)}`);
        assert.equal(env.strictChecks, false);
    } else {
        console.log('Server is not in testMode.');
    }
});