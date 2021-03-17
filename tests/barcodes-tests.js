/* eslint-disable no-undef */
/**
 * This file data.js contains utility functions for Learning Pass.
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
 const bcHelpers = require('../lib/barcodes.js');
 
// Test getBarcode strict.
test("getBarcode(11,14,'21221012345678') should return '21221012345678'", () => {
  let str = '21221012345678';
  let barcode = '21221012345678';
  assert.strictEqual(bcHelpers.getBarcode(11,14,str), barcode);
});

test("getBarcode(11,14,212210123456789) should return ''", () => {
  let str = '212210123456789';
  let barcode = '';
  assert.strictEqual(bcHelpers.getBarcode(11,14,str), barcode);
});

test("getBarcode(7,14,123456) should return ''", () => {
  let str = '123456';
  let barcode = '';
  assert.strictEqual(bcHelpers.getBarcode(7,14,str), barcode);
});

test("getBarcode(14,10,01234567890123) should return '01234567890123'", () => {
  let str = '01234567890123';
  let barcode = '01234567890123';
  assert.strictEqual(bcHelpers.getBarcode(14,10,str), barcode);
});

test("getBarcode(11,10,01234567890123) should return '01234567890123'", () => {
  let str = '01234567890123';
  let barcode = '01234567890123';
  assert.strictEqual(bcHelpers.getBarcode(11,10,str), barcode);
});

test("bcHelpers.getBarcode(6,10,'12345') should return ''", () => {
  let str = '12345';
  let barcode = '';
  assert.strictEqual(bcHelpers.getBarcode(6,10,str), barcode);
});

test("getBarcode(6,-10,01234567890123) should return '01234567890123'", () => {
  let str = '01234567890123';
  let barcode = '01234567890123';
  assert.strictEqual(bcHelpers.getBarcode(6,-10,str), barcode);
});
test("getBarcode(null,null,12345678) should return '12345678'", () => {
  let str = '12345678';
  let barcode = '12345678';
  assert.strictEqual(bcHelpers.getBarcode(null,null,str), barcode);
});
test("getBarcode(undefined,undefined,12345678) should return '12345678'", () => {
  let str = '12345678';
  let barcode = '12345678';
  assert.strictEqual(bcHelpers.getBarcode(undefined,undefined,str), barcode);
});

// Test loose barcode matching.
test('getBarcodeRelaxed("some_bar_code") should return "SOME_BAR_CODE"', () => {
  let str = 'some_bar_code';
  let result = "SOME_BAR_CODE";
  assert.strictEqual(bcHelpers.getBarcodeRelaxed(str), result);
});

test('getBarcodeRelaxed("USER-ID") should return ""', () => {
  let str = 'USER-ID';
  let result = "";
  assert.strictEqual(bcHelpers.getBarcodeRelaxed(str), result);
});

test('getBarcodeRelaxed("user+id") should return ""', () => {
  let str = 'user+id';
  let result = "";
  assert.strictEqual(bcHelpers.getBarcodeRelaxed(str), result);
});

test('getBarcodeRelaxed(andrew@example.com) should return ""', () => {
  let str = 'andrew@example.com';
  let result = '';
  assert.strictEqual(bcHelpers.getBarcodeRelaxed(str), result);
});

test('getBarcodeRelaxed(m5z6CvpDi_65436a0b-74dc-4ec1-a08a-028ac78752c6) should return ""', () => {
  let str = 'm5z6CvpDi_65436a0b-74dc-4ec1-a08a-028ac78752c6';
  let result = '';
  assert.strictEqual(bcHelpers.getBarcodeRelaxed(str), result);
});



// test('getLibraryBarcode() should return a barcode.', () => {
//   let err;
//   let data = {};
//   assert.deepStrictEqual(bcHelpers.getLibraryBarcode(err,data),
//   "21221800000001");
// });
