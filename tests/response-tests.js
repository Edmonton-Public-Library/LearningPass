/* eslint-disable no-undef */
/**
 * This file handlers.js contains utility functions for Learning Pass.
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
 'use strict';
// We use the assert standard library to make assertions
const assert = require('assert');
const registrationStatus = require('../lib/response');

test("Should send back 200 if nothing else happens.", () => {
    let expected = 200;
    let response = registrationStatus();
    response.headerCode = 200;
    let actual = response.getStatus();
    assert.deepStrictEqual(actual,expected);
});
test("Should getStatus() of 500 for unrecognized error type.", () => {
    let expected = 500;
    let response = registrationStatus();
    response.setStatus('andrew',"some message");
    let actual = response.getStatus();
    assert.deepStrictEqual(actual,expected);
});
test("Should getStatus() of 204 for empty content.", () => {
    let expected = 204;
    let response = registrationStatus();
    response.setStatus('noContent',"");
    let actual = response.getStatus();
    assert.deepStrictEqual(actual,expected);
});
test("Should getStatus() of 405 for not allowed.", () => {
    let expected = 405;
    let response = registrationStatus();
    response.setStatus('notAllowed','too young.');
    let actual = response.getStatus();
    assert.deepStrictEqual(actual,expected);
});
test("Should pass getMessage() for 405 'too young'.", () => {
    let response = registrationStatus();
    let expected = "Sorry, this customer isn't allowed to use this service" + ', too young.';
    response.setStatus('notAllowed','too young.');
    let actual = response.getMessages();
    assert.deepStrictEqual(actual,expected);
});
test("Should hasErrors() returns true for 204.", () => {
    let expected = true;
    let response = registrationStatus();
    response.setStatus('noContent',"");
    let actual = response.hasErrors();
    assert.strictEqual(actual,expected);
});
test("Should hasErrors() returns false for 202.", () => {
    let expected = true;
    let response = registrationStatus();
    response.setStatus('accepted',"");
    let actual = response.hasErrors();
    assert.strictEqual(actual,expected);
    response.getStatus(true);
    response.getMessages(true);
});

// Test if response object is reset.
test("Should reset the response object.", () => {
    let expected = 401;
    let expectedMessage = "Sorry, your API key is missing, or invalid., x-api-key problem";
    let response = registrationStatus();
    response.getMessages(true);
    response.setStatus('apiKeyProblem','x-api-key problem');
    assert.deepStrictEqual(response.getStatus(),expected);
    assert.deepStrictEqual(response.getMessages(),expectedMessage);
    assert.deepStrictEqual(response.getStatus(),expected);
    assert.deepStrictEqual(response.getMessages(true),expectedMessage);
    assert.strictEqual(response.getStatus(),200);
    assert.strictEqual(response.getMessages(),"Thank you for registering!");
});