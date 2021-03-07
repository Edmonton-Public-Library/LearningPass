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

// Test getBarcode strict.
test("getBarcode() should return '21221012345678'", () => {
    let str = '21221012345678';
    let barcode = '21221012345678';
    assert.strictEqual(helpers.getBarcode(11,14,str), barcode);
});

test("getBarcode(11,14,212210123456789) should return ''", () => {
    let str = '212210123456789';
    let barcode = '';
    assert.strictEqual(helpers.getBarcode(11,14,str), barcode);
});

test("getBarcode(7,14,123456) should return ''", () => {
    let str = '123456';
    let barcode = '';
    assert.strictEqual(helpers.getBarcode(7,14,str), barcode);
});

test("getBarcode(14,10,01234567890123) should return '01234567890123'", () => {
    let str = '01234567890123';
    let barcode = '01234567890123';
    assert.strictEqual(helpers.getBarcode(14,10,str), barcode);
});

test("getBarcode(11,10,01234567890123) should return ''", () => {
    let str = '01234567890123';
    let barcode = '';
    assert.strictEqual(helpers.getBarcode(11,10,str), barcode);
});

test("getBarcode(5,10,12345) should return ''", () => {
    let str = '12345';
    let barcode = '';
    assert.strictEqual(helpers.getBarcode(5,10,str), barcode);
});

// Test loose barcode matching.
test('getBarcodeRelaxed("some_bar_code") should return "SOME_BAR_CODE"', () => {
    let str = 'some_bar_code';
    let result = "SOME_BAR_CODE";
    assert.strictEqual(helpers.getBarcodeRelaxed(str), result);
});

test('getBarcodeRelaxed("USER-ID") should return ""', () => {
    let str = 'USER-ID';
    let result = "";
    assert.strictEqual(helpers.getBarcodeRelaxed(str), result);
});

test('getBarcodeRelaxed("user+id") should return ""', () => {
    let str = 'user+id';
    let result = "";
    assert.strictEqual(helpers.getBarcodeRelaxed(str), result);
});

test('getBarcodeRelaxed(andrew@example.com) should return ""', () => {
    let str = 'andrew@example.com';
    let result = '';
    assert.strictEqual(helpers.getBarcodeRelaxed(str), result);
});

test('getBarcodeRelaxed(m5z6CvpDi_65436a0b-74dc-4ec1-a08a-028ac78752c6) should return ""', () => {
    let str = 'm5z6CvpDi_65436a0b-74dc-4ec1-a08a-028ac78752c6';
    let result = '';
    assert.strictEqual(helpers.getBarcodeRelaxed(str), result);
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

test('getFirstName(nisbet, andrew) should return "Andrew"', () => {
    let str = 'nisbet, andrew';
    let result = 'Andrew';
    assert.strictEqual(helpers.getFirstName(str), result);
});

test('getFirstName(nisbet,andrew) should return "Andrew"', () => {
    let str = 'nisbet,andrew';
    let result = 'Andrew';
    assert.strictEqual(helpers.getFirstName(str), result);
});

test('getFirstName(nisbet,   andrew) should return "Andrew"', () => {
    let str = 'nisbet,   andrew';
    let result = 'Andrew';
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

test('getLastName(nisbet, andrew) should return "Nisbet"', () => {
    let str = 'nisbet, andrew';
    let result = 'Nisbet';
    assert.strictEqual(helpers.getLastName(str), result);
});

test('getLastName(nisbet,andrew) should return "Nisbet"', () => {
    let str = 'nisbet,andrew';
    let result = 'Nisbet';
    assert.strictEqual(helpers.getLastName(str), result);
});

test('getLastName(nisbet,   andrew) should return "Nisbet"', () => {
    let str = 'nisbet,   andrew';
    let result = 'Nisbet';
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

// Test getDate()
test('getDate(2021-01-02) should return "20210102"', () => {
    let result = 20210102;
    let str = '2021-01-02';
    assert.strictEqual(helpers.getANSIDate(str), result);
});

// Test getDate()
test('getDate(1821-01-02) should return ""', () => {
    let result = 18210102;
    let str = '1821-01-02';
    assert.strictEqual(helpers.getANSIDate(str), result);
});

// Test getDate()
test('getDate(22/08/1963) should return 19630822', () => {
    let result = 19630822;
    let str = '22/08/1963';
    assert.strictEqual(helpers.getANSIDate(str), result);
});

test('getDate(22-08-1963) should return 19630822', () => {
    let result = 19630822;
    let str = '22-08-1963';
    assert.strictEqual(helpers.getANSIDate(str), result);
});

test('getDate(1963-08-22) should return 19630822', () => {
    let result = 19630822;
    let str = '1963-08-22';
    assert.strictEqual(helpers.getANSIDate(str), result);
});

test('getDate(1963/08/22) should return 19630822', () => {
    let result = 19630822;
    let str = '1963/08/22';
    assert.strictEqual(helpers.getANSIDate(str), result);
});

test('getDate(19630822) should return 19630822', () => {
    let result = 19630822;
    let str = '19630822';
    assert.strictEqual(helpers.getANSIDate(str), result);
});

test('getDate(196308222) should return ""', () => {
    let result = '';
    let str = '196308222';
    assert.strictEqual(helpers.getANSIDate(str), result);
});

test('getDate(1963082) should return ""', () => {
    let result = '';
    let str = '1963082';
    assert.strictEqual(helpers.getANSIDate(str), result);
});

// Test hasDictData()
test('should return that dictionary has data.', () => {
    assert.strictEqual(helpers.hasDictData({"name" : "andrew"}), true);
});

// What happens if we send an array.
test('should return false for array.', () => {
    assert.strictEqual(helpers.hasDictData([1]), false);
});

test('should return false for empty dictionary.', () => {
    assert.strictEqual(helpers.hasDictData({}), false);
});

test('should return true for an array with data.', () => {
    assert.strictEqual(helpers.hasArrayData([1,"two"]), true);
});
test('should return false for empty array.', () => {
    assert.strictEqual(helpers.hasArrayData([]), false);
});

// Test hasStringData.
test('hasStringData() should return true for a non-zero length string.', () => {
    assert.strictEqual(helpers.hasStringData("two"), true);
});
test('hasStringData() should return false for an array.', () => {
    assert.strictEqual(helpers.hasStringData([1,"two"]), false);
});
test('hasStringData() should return false for empty string.', () => {
    assert.strictEqual(helpers.hasStringData(''), false);
});
test('hasStringData() should return false for null.', () => {
    assert.strictEqual(helpers.hasStringData(null), false);
});
test('hasStringData() should return false for undefined.', () => {
    assert.strictEqual(helpers.hasStringData(undefined), false);
});

// Test is a date is in the past.
test('dateInPast() should return fasle for 2020-03-13.', () => {
    let oldDate = new Date('2020-03-13');
    assert.strictEqual(helpers.compareToday(oldDate), -1);
});
test('dateInPast() should return true for 2112-03-13.', () => {
    let futureDate = new Date('2112-03-13');
    assert.strictEqual(helpers.compareToday(futureDate), 1);
});
test('dateInPast() should return true for today().', () => {
    let today = new Date();
    assert.strictEqual(helpers.compareToday(today), 0);
});



// Test date daysYearsFromToday
test('daysYearsFromToday() should return how many days and years since "1963-08-22".', () => {
    let longAgo = new Date("1963-08-22");
    let howLongDict = helpers.daysYearsFromToday(longAgo);
    console.log("It was a long time ago: ",howLongDict);
});

// Test date daysYearsFromToday()
test('daysYearsFromToday() should return how many days and years until "2025-08-22".', () => {
    let longAgo = new Date("2025-08-22");
    let howLongDict = helpers.daysYearsFromToday(longAgo);
    console.log("It was a long time ago: ",howLongDict);
});

// Test hasDateData()
test('hasDateData() should return true for ansi date "19740822".', () => {
    let longAgo = "19740822";
    assert.strictEqual(helpers.hasDateData(longAgo), true);
});
test('hasDateData() should return true for ansi date "1974-08-22".', () => {
    let longAgo = new Date("1974-08-22");
    assert.strictEqual(helpers.hasDateData(longAgo), true);
});
test('hasDateData() should return true for ansi date "197408222".', () => {
    let weirdDate = "197408222";
    assert.strictEqual(helpers.hasDateData(weirdDate), false);
});
test('hasDateData() should return false for null.', () => {
    let weirdDate = null;
    assert.strictEqual(helpers.hasDateData(weirdDate), false);
});
test('hasDateData() should return false for undefined.".', () => {
    let weirdDate = undefined;
    assert.strictEqual(helpers.hasDateData(weirdDate), false);
});
test('hasDateData() should return false for {}.".', () => {
    let weirdDate = {};
    assert.strictEqual(helpers.hasDateData(weirdDate), false);
});
test('hasDateData() should return false for [].".', () => {
    let weirdDate = [];
    assert.strictEqual(helpers.hasDateData(weirdDate), false);
});

