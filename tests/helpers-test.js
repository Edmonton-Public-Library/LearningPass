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
const helpers = require('../lib/helpers');

// We do not need to import the test functions since
// they are made global variables by test.js
test('should return a JSON object', () => {
    assert.deepStrictEqual(
        helpers.parseJsonToObject('{"name" : "andrew"}'), {"name":"andrew"});
});

// Test for valid email.
test('andrew@example.com should return true', () => {
    let possibleAddr = 'andrew@example.com';
    assert.strictEqual(helpers.getEmail(possibleAddr), possibleAddr);
});

test('_@_._ should return ""', () => {
    let possibleAddr = '_@_._';
    assert.strictEqual(helpers.getEmail(possibleAddr), '');
});

test('a@b should return ""', () => {
    let possibleAddr = 'a@b';
    assert.strictEqual(helpers.getEmail(possibleAddr), '');
});

test('a@b@c should return ""', () => {
    let possibleAddr = 'a@b@c';
    assert.strictEqual(helpers.getEmail(possibleAddr), '');
});

test('-a@B.com should return "-a@B.com"', () => {
    let possibleAddr = '-a@B.com';
    assert.strictEqual(helpers.getEmail(possibleAddr), '-a@B.com');
});

// Tests for valid phone
const phone = '780-242-5555';
test('+1(780) 242-5555 should return '+phone, () => {
    let str = '+1(780) 242-5555';
    assert.strictEqual(helpers.getPhone(str), phone);
});

test('+1 780 242-5555 should return '+phone, () => {
    let str = '+1 780 242-5555';
    assert.strictEqual(helpers.getPhone(str), phone);
});

test('780 242-5555 should return '+phone, () => {
    let str = '780 242-5555';
    assert.strictEqual(helpers.getPhone(str), phone);
});

test('78O 242-5555 should return ""', () => {
    let str = '78O 242-5555';
    let phone = '';
    assert.strictEqual(helpers.getPhone(str), phone);
});

// Tests for valid Postal code.
const pc = 'N2V2V4';
test(`getPostalCode() should return ${pc}`, () => {
    let str = 'N2V2V4';
    assert.strictEqual(helpers.getPostalCode(str), pc);
});

test(`getPostalCode() should return ${pc}`, () => {
    let str = 'N2V 2V4';
    assert.strictEqual(helpers.getPostalCode(str), pc);
});

test(`getPostalCode() should return ${pc}`, () => {
    let str = ' N2V 2V4 ';
    assert.strictEqual(helpers.getPostalCode(str), pc);
});

test(`getPostalCode() should return ${pc}`, () => {
    let str = ' n2V-2V4 ';
    assert.strictEqual(helpers.getPostalCode(str), pc);
});

test(`getPostalCode() should return ${pc}`, () => {
    let str = '(N2V-2V4)';
    assert.strictEqual(helpers.getPostalCode(str), pc);
});

test("getPostalCode() should return ''", () => {
    let str = 'h0h0ho';
    assert.strictEqual(helpers.getPostalCode(str), '');
});

// Test for street.
test("getStreet() should return '11811 74 Ave.'", () => {
    let str = '11811 74 Ave.';
    let street = '11811 74 Ave.';
    assert.strictEqual(helpers.getStreet(str), street);
});

test("getStreet() should return '11811 74 Ave.'", () => {
    let str = '11811 74 AVE.';
    let street = '11811 74 Ave.';
    assert.strictEqual(helpers.getStreet(str), street);
});

test("getStreet() should return '11811 74 Ave.'", () => {
    let str = '11811-74 AVE.';
    let street = '11811 74 Ave.';
    assert.strictEqual(helpers.getStreet(str), street);
});

test("getStreet() should return '20 A B Street.'", () => {
    let str = '20 a-b STREET.';
    let street = '20 A B Street.';
    assert.strictEqual(helpers.getStreet(str), street);
});

test("getStreet() should return '1277 Elgin Cres. Oakville Ontario'", () => {
    let str = '1277 ElGIn CreS. OakVILLe oNTaRio';
    let street = '1277 Elgin Cres. Oakville Ontario';
    assert.strictEqual(helpers.getStreet(str), street);
});

test("getStreet() should return 'Stanley Milner Library, not 27 Calgary street'", () => {
    let str = 'Stanley Milner Library, not 27 Calgary street';
    let street = 'Stanley Milner Library, Not 27 Calgary Street';
    assert.strictEqual(helpers.getStreet(str), street);
});

test("getStreet() should return 'Apt. 12 53-Rubbish Lane.'", () => {
    let str = 'Apt. 12 53-Rubbish Lane.';
    let street = 'Apt. 12 53 Rubbish Lane.';
    assert.strictEqual(helpers.getStreet(str), street);
});

test("getStreet() should return '123 456 Street.'", () => {
    let str = '-123 456 street.';
    let street = '123 456 Street.';
    assert.strictEqual(helpers.getStreet(str), street);
});

