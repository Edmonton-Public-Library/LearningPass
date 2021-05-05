/* eslint-disable no-undef */
/**
 * This file passwords-tests.js contains utility functions for testing 
 * Learning Pass's password restriction configuration.
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
const helpers = require('../lib/helpers');
const customerHelper = require('../lib/customer');

test('Should allow password', () => {
    let password = "mikeMoz3r";
    let expected = "mikeMoz3r";
    let regex = "^[a-zA-Z0-9-!_\\s]{4,125}$";
    let result = helpers.getPassword(password, regex);
    assert.deepStrictEqual(result, expected);
});
test('Should NOT allow password', () => {
    let password = "mikeMoz3r?";
    let expected = "";
    let regex = "^[a-zA-Z0-9-!_\\s]{4,125}$";
    let result = helpers.getPassword(password, regex);
    assert.deepStrictEqual(result, expected);
});
test('Should turn password into PIN', () => {
    let password = "mikeMoz3r";
    let expected = '2239';
    let libConfig = {"passwords" : {
        "minimum" : 4,
        "maximum" : 125,
        "passwordToPin" : true,
        "regex" : "^[a-zA-Z0-9-!_\\s]{4,125}$"
    }}
    let result = customerHelper.getPassword(password, libConfig);
    assert.deepStrictEqual(result, expected);
});
test('Should keep four-digit PIN', () => {
    let password = "1234";
    let expected = '1234';
    let libConfig = {"passwords" : {
        "minimum" : 4,
        "maximum" : 125,
        "passwordToPin" : true,
        "regex" : "^[a-zA-Z0-9-!_\\s]{4,125}$"
    }}
    let result = customerHelper.getPassword(password, libConfig);
    assert.deepStrictEqual(result, expected);
});
test('getPassword() Should allow legit password.', () => {
    let libConfig = {};
    let password  = "123456789";
    let result = password;
    assert.strictEqual(
      customerHelper.getPassword(password,libConfig), result);
  });
  
test('getPassword() Should allow legit password more than 4 digits', () => {
    let libConfig = {"passwords" : {
      "minimum" : 4
    }};
    let password  = "123456789";
    let result = password;
    assert.strictEqual(
      customerHelper.getPassword(password,libConfig), result);
});
test('getPassword() Should not allow legit password less than 4 digits', () => {
    let libConfig = {"passwords" : {
      "minimum" : 4
    }};
    let password  = "123";
    assert.strictEqual(
      customerHelper.getPassword(password,libConfig), "");
});
test('getPassword() Should not allow legit password more than max digits', () => {
    let libConfig = {"passwords" : {
      "minimum" : 4,
      "maximum" : 5
    }};
    let password  = "123456";
    assert.strictEqual(
      customerHelper.getPassword(password,libConfig), "");
});
test('getPassword() Should get PIN from password when passwordToPin = true', () => {
    let libConfig = {"passwords" : {
      "minimum" : 4,
      "maximum" : 100,
      "passwordToPin" : true
    }};
    let password  = "HelloWorld";
    let result = '9280';
    assert.strictEqual(
      customerHelper.getPassword(password,libConfig), result);
});
test('getPassword() Should get password when passwordToPin = false', () => {
    let libConfig = {"passwords" : {
      "minimum" : 4,
      "maximum" : 6,
      "passwordToPin" : false
    }};
    let password  = "123456";
    let result = password;
    assert.strictEqual(
      customerHelper.getPassword(password,libConfig), result);
});
test('getPassword() Should get password with user defined regex', () => {
    let libConfig = {"passwords" : {
      "minimum" : 4,
      "maximum" : 100,
      "passwordToPin" : false,
      "regex" : "^\\d{8}$"
    }};
    let password  = "12345678";
    let result = password;
    assert.strictEqual(
      customerHelper.getPassword(password,libConfig), result);
});
test('getPassword() Should return "" if regex password does not match regex', () => {
    let libConfig = {"passwords" : {
      "minimum" : 4,
      "maximum" : 100,
      "passwordToPin" : false,
      "regex" : "^[a-z]$"
    }};
    let password  = "abcdef8";
    let result = '';
    assert.strictEqual(
      customerHelper.getPassword(password,libConfig), result);
});
test('Should NOT allow password', () => {
  let password = "$$$$";
  let expected = "";
  let regex = "^[a-zA-Z0-9-!_\\s]{4,125}$";
  let result = helpers.getPassword(password, regex);
  assert.deepStrictEqual(result, expected);
});
test('getPassword() Should return "" if regex password does not match regex', () => {
  let libConfig = {"passwords" : {
    "minimum" : 4,
    "maximum" : 100,
    "passwordToPin" : false,
    "regex" : "^[a-zA-Z0-9-!_\\s]{4,125}$"
  }};
  let password  = "$$$$";
  let result = '';
  assert.strictEqual(
    customerHelper.getPassword(password,libConfig), result);
});