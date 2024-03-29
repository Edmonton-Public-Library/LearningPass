/* eslint-disable no-undef */
/**
 * This file helpers-test.js contains utility functions for testing 
 * Learning Pass's customer registration functions.
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

// Test options for capitalization.
test('Should Capitalize street', () => {
    let street = "414 JENNINGS BAY NW";
    let expected = "414 Jennings Bay Nw";
    let result = helpers.getStreet(street);

    assert.deepStrictEqual(result, expected);
});

// We do not need to import the test functions since
// they are made global variables by test.js
test('should return a JSON object', () => {
    assert.deepStrictEqual(
        helpers.parseJsonToObject('{"name" : "lewis"}'), {"name":"lewis"});
});

test('Should fail on non-json object', () => {
    assert.deepStrictEqual(
        helpers.parseJsonToObject('hello'), {});
});

// Test for valid email.
test('lewis@example.com should return true', () => {
    let possibleAddr = 'lewis@example.com';
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
    assert.strictEqual(helpers.getPhone(str), "1-780-242-5555");
});

test('+1 780 242-5555 should return '+phone, () => {
    let str = '+1 780 242-5555';
    assert.strictEqual(helpers.getPhone(str), "1-780-242-5555");
});

test('780 242-5555 should return '+phone, () => {
    let str = '780 242-5555';
    assert.strictEqual(helpers.getPhone(str), phone);
});

test('Should return valid phone', () => {
    let str = '380-128-303-0897';
    assert.strictEqual(helpers.getPhone(str), '380-128-303-0897');
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


// Test capitalize function.
test('capitalize(aBc) should return "Abc"', () => {
    let str = 'aBc';
    let result = 'Abc';
    assert.strictEqual(helpers.capitalize(str), result);
});

test('capitalize(some string of words) should return "Some String Of Words"', () => {
    let str = 'some string of words';
    let result = 'Some String Of Words';
    assert.strictEqual(helpers.capitalize(str), result);
});

test('capitalize(1277 Elgin Cres. Oakville Ontario) should return "1277 Elgin Cres. Oakville Ontario"', () => {
    let str = '1277 ElGIn CreS. OakVILLe oNTaRio';
    let result = '1277 Elgin Cres. Oakville Ontario';
    assert.strictEqual(helpers.capitalize(str), result);
});

test('capitalize(a) should return "A"', () => {
    let str = 'a';
    let result = 'A';
    assert.strictEqual(helpers.capitalize(str), result);
});

test('capitalize() should return ""', () => {
    let str = '';
    let result = '';
    assert.strictEqual(helpers.capitalize(str), result);
});

test('capitalize(1) should return "1"', () => {
    let str = '1';
    let result = '1';
    assert.strictEqual(helpers.capitalize(str), result);
});

test('capitalize(USER-ID) should return "User-Id"', () => {
    let str = 'USER-ID';
    let result = 'User-Id';
    assert.strictEqual(helpers.capitalize(str), result);
});

test('capitalize(capt. mike stink-belly) should return "Capt. Mike Stink-Belly"', () => {
    let str = 'capt. mike stink-belly';
    let result = 'Capt. Mike Stink-Belly';
    assert.strictEqual(helpers.capitalize(str), result);
});

test('capitalize(capt.-mike-stink-belly) should return "Capt.-Mike-Stink-Belly"', () => {
    let str = 'capt.-mike-stink-belly';
    let result = 'Capt.-Mike-Stink-Belly';
    assert.strictEqual(helpers.capitalize(str), result);
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


// Test first name last name functions.
test('getFirstName(Hakeem Sancto) should return "Hakeem"', () => {
    let str = 'Hakeem Sancto';
    let result = 'Hakeem';
    assert.strictEqual(helpers.getFirstName(str), result);
});

test('getFirstName(Hakeem) should return "Hakeem"', () => {
    let str = 'Hakeem';
    let result = 'Hakeem';
    assert.strictEqual(helpers.getFirstName(str), result);
});

test('getFirstName() should return ""', () => {
    let str = '';
    let result = '';
    assert.strictEqual(helpers.getFirstName(str), result);
});

test('getFirstName(hamilton, lewis) should return "Lewis"', () => {
    let str = 'hamilton, lewis';
    let result = 'Lewis';
    assert.strictEqual(helpers.getFirstName(str), result);
});

test('getFirstName(hamilton,lewis) should return "Lewis"', () => {
    let str = 'hamilton,lewis';
    let result = 'Lewis';
    assert.strictEqual(helpers.getFirstName(str), result);
});

test('getFirstName(hamilton,   lewis) should return "Lewis"', () => {
    let str = 'hamilton,   lewis';
    let result = 'Lewis';
    assert.strictEqual(helpers.getFirstName(str), result);
});

test('getFirstName(Coleen-Launce Coe) should return "Coleen-Launce"', () => {
    let str = 'Coleen-Launce Coe';
    let result = 'Coleen-Launce';
    assert.strictEqual(helpers.getFirstName(str), result);
});

test('getFirstName(Grouer, Joline) should return "Joline"', () => {
    let str = 'Grouer, Joline';
    let result = 'Joline';
    assert.strictEqual(helpers.getFirstName(str), result);
});

test('getFirstName(Mufi-Zacharia, Kensley) should return "Kensley"', () => {
    let str = 'Mufi-Zacharia, Kensley';
    let result = 'Kensley';
    assert.strictEqual(helpers.getFirstName(str), result);
});

// Tests for getMiddleName()
test('getMiddleName(HAKEEM) should return "Hakeem"', () => {
    let str = 'HAKEEM';
    let result = 'Hakeem';
    assert.strictEqual(helpers.getMiddleName(str), result);
});

test('getMiddleName(big city) should return "Big City"', () => {
    let str = 'big city';
    let result = 'Big City';
    assert.strictEqual(helpers.getMiddleName(str), result);
});

// Testing for getLastName()
test('getLastName(Hakeem Sancto) should return "Sancto"', () => {
    let str = 'Hakeem Sancto';
    let result = 'Sancto';
    assert.strictEqual(helpers.getLastName(str), result);
});

test('getLastName(Hakeem) should return "Hakeem"', () => {
    let str = 'Hakeem';
    let result = 'Hakeem';
    assert.strictEqual(helpers.getLastName(str), result);
});

test('getLastName() should return ""', () => {
    let str = '';
    let result = '';
    assert.strictEqual(helpers.getLastName(str), result);
});

test('getLastName(hamilton, lewis) should return "Hamilton"', () => {
    let str = 'hamilton, lewis';
    let result = 'Hamilton';
    assert.strictEqual(helpers.getLastName(str), result);
});

test('getLastName(hamilton,lewis) should return "Hamilton"', () => {
    let str = 'hamilton,lewis';
    let result = 'Hamilton';
    assert.strictEqual(helpers.getLastName(str), result);
});

test('getLastName(hamilton,   lewis) should return "Hamilton"', () => {
    let str = 'hamilton,   lewis';
    let result = 'Hamilton';
    assert.strictEqual(helpers.getLastName(str), result);
});

test('getLastName(Coleen-Launce Coe) should return "Coe"', () => {
    let str = 'Coleen-Launce Coe';
    let result = 'Coe';
    assert.strictEqual(helpers.getLastName(str), result);
});

test('getLastName(Grouer, Joline) should return "Grouer"', () => {
    let str = 'Grouer, Joline';
    let result = 'Grouer';
    assert.strictEqual(helpers.getLastName(str), result);
});

test('getLastName(mufi-zacharia, kensley) should return "Mufi-Zacharia"', () => {
    let str = 'mufi-zacharia, kensley';
    let result = 'Mufi-Zacharia';
    assert.strictEqual(helpers.getLastName(str), result);
});


// Test password field.
test('getPassword(6gd~aqui.j1fo~tl) should return "6gd~aqui.j1fo~tl"', () => {
    let str = '6gd~aqui.j1fo~tl';
    let result = '6gd~aqui.j1fo~tl';
    assert.strictEqual(helpers.getPassword(str), result);
});

test('getPassword(&3mp!&^08d0@g7) should return "&3mp!&^08d0@g7"', () => {
    let str = '&3mp!&^08d0@g7';
    let result = '&3mp!&^08d0@g7';
    assert.strictEqual(helpers.getPassword(str), result);
});

test('getPassword(123) should return ""', () => {
    let str = '123';
    let result = '';
    assert.strictEqual(helpers.getPassword(str), result);
});

test('getPassword(    ) should return ""', () => {
    let str = '    ';
    let result = '';
    assert.strictEqual(helpers.getPassword(str), result);
});

// PIN and hash tests.
test('hashCode() should computes Java equiv hash.".', () => {
    // ref: https://www.w3schools.com/java/tryjava.asp?filename=demo_ref_string_hashcode
    let password = "HelloWorld";
    assert.strictEqual(helpers.hashCode(password), 439329280);
});
test('getFourDigitPin() should compute a 4-digit PIN.".', () => {
    let password = "HelloWorld";
    assert.strictEqual(helpers.getFourDigitPin(password), 9280);
});
test('getFourDigitPin() should return empty string.', () => {
    let password = "";
    assert.strictEqual(helpers.getFourDigitPin(password), '');
});
test('Should split "EDMONTON,AB" into Edmonton and Ab', () => {
    let commaString = "EDMONTON,AB";
    let city = "EDMONTON";
    let prov = "AB"
    assert.strictEqual(helpers.splitCommaString(commaString,true),city);
    assert.strictEqual(helpers.splitCommaString(commaString,false),prov);
});
test('Should return "Barney"', () => {
    let commaString = "Barney";
    let name = "Barney";
    assert.strictEqual(helpers.splitCommaString(commaString,true),name);
});