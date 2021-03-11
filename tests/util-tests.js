/**
 * This file util.tests.js contains utility functions testing data types.
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

 const assert = require('assert');
 const util = require('../lib/util');

// Test hasDictData()
test('Should return true if dictionary has data.', () => {
    assert.strictEqual(util.hasDictData({"name" : "andrew"}), true);
});

// What happens if we send an array.
test('Should return false for an array.', () => {
    assert.strictEqual(util.hasDictData([1]), false);
});

test('Should return false for empty dictionary.', () => {
    assert.strictEqual(util.hasDictData({}), false);
});

test('Should return true for an array with data.', () => {
    assert.strictEqual(util.hasArrayData([1,"two"]), true);
});
test('Should return false for empty array.', () => {
    assert.strictEqual(util.hasArrayData([]), false);
});
test('Should return false for string.', () => {
    assert.strictEqual(util.hasArrayData('a string'), false);
});

// Test hasStringData.
test('Should return true for a non-zero length string.', () => {
    assert.strictEqual(util.hasStringData("two"), true);
});
test('Should return false for an array.', () => {
    assert.strictEqual(util.hasStringData([1,"two"]), false);
});
test('Should return false for empty string.', () => {
    assert.strictEqual(util.hasStringData(''), false);
});
test('Should return false for null.', () => {
    assert.strictEqual(util.hasStringData(null), false);
});
test('Should return false for undefined.', () => {
    assert.strictEqual(util.hasStringData(undefined), false);
});
test('Should return false for an empty array.', () => {
    assert.strictEqual(util.hasStringData([]), false);
});
test('Should return false when testing a dictionary.', () => {
    assert.strictEqual(util.hasStringData({"one" : 2}), false);
});
test('Should return false for empty dictionary.', () => {
    assert.strictEqual(util.hasStringData({}), false);
});