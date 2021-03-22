/* eslint-disable no-undef */
/**
 * This file date-tests.js tests date.js functions.
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



const assert = require('assert');
const dateHelpers = require('../lib/date');


// Test getDate()
test('getANSIDate(2021-01-02) should return "20210102"', () => {
    let result = '20210102';
    let str = '2021-01-02';
    assert.strictEqual(dateHelpers.getANSIDate(str), result);
});

// Test getANSIDate()
test('getANSIDate(1821-01-02) should return ""', () => {
    let result = "18210102";
    let str = '1821-01-02';
    assert.strictEqual(dateHelpers.getANSIDate(str), result);
});

// Test getANSIDate()
test('getANSIDate(22/08/1963) should return nothing.', () => {
    let result = '';
    let str = '22/08/1963';
    assert.strictEqual(dateHelpers.getANSIDate(str), result);
});

test('getANSIDate(22-08-1963) should return nothing', () => {
    let result = '';
    let str = '22-08-1963';
    assert.strictEqual(dateHelpers.getANSIDate(str), result);
});

test('getANSIDate(1963-08-22) should return 19630822', () => {
    let result = '19630822';
    let str = '1963-08-22';
    assert.strictEqual(dateHelpers.getANSIDate(str), result);
});

test('getANSIDate(1963/08/22) should return 19630822', () => {
    let result = '19630822';
    let str = '1963/08/22';
    assert.strictEqual(dateHelpers.getANSIDate(str), result);
});

test('getANSIDate(19630822) should return 19630822', () => {
    let result = '19630822';
    let str = '19630822';
    assert.strictEqual(dateHelpers.getANSIDate(str), result);
});

test('getANSIDate(196308222) should return ""', () => {
    let result = '';
    let str = '196308222';
    assert.strictEqual(dateHelpers.getANSIDate(str), result);
});

test('Should return ANSI version of Date() object.', () => {
    let result = '19630822';
    let dateStr = new Date("1963-08-22");
    assert.strictEqual(dateHelpers.getANSIDate(dateStr), result);
});

test('getANSIDate(1963082) should return ""', () => {
    let result = '';
    let str = '1963082';
    assert.strictEqual(dateHelpers.getANSIDate(str), result);
});

// Test is a date is in the past.
test('dateInPast() should return false for 2020-03-13.', () => {
    let oldDate = new Date('2020-03-13');
    assert.strictEqual(dateHelpers.compareToday(oldDate), -1);
});
test('dateInPast() should return true for 2112-03-13.', () => {
    let futureDate = new Date('2112-03-13');
    assert.strictEqual(dateHelpers.compareToday(futureDate), 1);
});
test('dateInPast() should return true for today().', () => {
    let today = new Date();
    today.setHours(0,0,0,0);
    assert.strictEqual(dateHelpers.compareToday(today), 0);
});



// Test date daysAndYearsAgo
test('daysAndYearsAgo() should return how many days and years since "1963-08-22".', () => {
    let longAgo = new Date("1963-08-22");
    let howLongDict = dateHelpers.daysAndYearsAgo(longAgo);
    console.log("It was a long time ago: ",howLongDict);
});

// Test date daysAndYearsAgo()
test('daysAndYearsAgo() should return how many days and years since "2025-08-22".', () => {
    let longAgo = new Date("2025-08-22");
    let howLongDict = dateHelpers.daysAndYearsAgo(longAgo);
    console.log("It will be a long time ago: ",howLongDict);
});

// Test hasDateData()
test('hasDateData() should return true for ansi date "19740822".', () => {
    let longAgo = "19740822";
    assert.strictEqual(dateHelpers.hasDateData(longAgo), true);
});
test('hasDateData() should return true for ansi date "1974-08-22".', () => {
    let longAgo = new Date("1974-08-22");
    assert.strictEqual(dateHelpers.hasDateData(longAgo), true);
});
test('hasDateData() should return true for ansi date "197408222".', () => {
    let weirdDate = "197408222";
    assert.strictEqual(dateHelpers.hasDateData(weirdDate), false);
});
test('hasDateData() should return false for null.', () => {
    let weirdDate = null;
    assert.strictEqual(dateHelpers.hasDateData(weirdDate), false);
});
test('hasDateData() should return false for undefined.".', () => {
    let weirdDate = undefined;
    assert.strictEqual(dateHelpers.hasDateData(weirdDate), false);
});
test('hasDateData() should return false for {}.".', () => {
    let weirdDate = {};
    assert.strictEqual(dateHelpers.hasDateData(weirdDate), false);
});
test('hasDateData() should return false for [].".', () => {
    let weirdDate = [];
    assert.strictEqual(dateHelpers.hasDateData(weirdDate), false);
});

test('Should return string value of date .', () => {
    let dateStrIn = "2021-03-18";
    let testDate = new Date(dateStrIn);
    assert.strictEqual(dateHelpers.dateToString(testDate), dateStrIn);
});
