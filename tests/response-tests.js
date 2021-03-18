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

// We use the assert standard library to make assertions
const assert = require('assert');
const response = require('../lib/response');

test("Should send back 200 if nothing else happens.", () => {
    let expected = 200;
    let actual = response.getStatus();
    assert.deepStrictEqual(actual,expected);
});
test("Should getStatus() of 500 for unrecognized error type.", () => {
    let expected = 500;
    response.setStatus('andrew',"some message");
    let actual = response.getStatus();
    assert.deepStrictEqual(actual,expected);
});
test("Should getStatus() of 204 for empty content.", () => {
    let expected = 204;
    response.headerCode = 200;
    response.setStatus('noContent',"");
    let actual = response.getStatus();
    assert.deepStrictEqual(actual,expected);
});
test("Should getStatus() of 405 for not allowed.", () => {
    let expected = 405;
    response.headerCode = 200;
    response.setStatus('notAllowed','too young.');
    let actual = response.getStatus();
    assert.deepStrictEqual(actual,expected);
});
test("Should pass getMessage() for 405 'too young'.", () => {
    let expected = response.baseMessage[405] + ', too young.';
    response.messages = [];
    response.setStatus('notAllowed','too young.');
    let actual = response.getMessages();
    assert.deepStrictEqual(actual,expected);
});