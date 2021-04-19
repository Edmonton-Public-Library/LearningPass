/* eslint-disable no-undef */
/**
 * This file contains test functions for Learning Pass configuration
 * for production server.
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
    assert.strictEqual(environment.getVersion(), '1.0');
});

// Test the server ports and directories.
test('Should return http port for production.', () => {
    let correctPort = 5000;
    let actualPort = environment.getHttpPort();
    assert.strictEqual(actualPort, correctPort);
});

// Test the server ports and directories.
test('Should return https port for production.', () => {
    let correctPort = 5001;
    let actualPort = environment.getHttpsPort();
    assert.strictEqual(actualPort, correctPort);
});

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
test('Should return environment name "production".', () => {
    let correctName = "production";
    let actualName = environment.getEnvName();
    assert.strictEqual(actualName, correctName);
});
