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

/**
 * These functions support CRUD of barcodes.
 * 
 * In the simple case bar codes are checked if they meet the library's
 * expectations, but more complex scenerios are also possible.
 * 
 * @example 
 * 1) The partner organization wants the library to supply a 
 * new library card.
 * 2) The partner organization wants to use student IDs as barcodes
 * but the student IDs clash with pre-existing barcodes in the ILS.
 * 
 * In the first case, the barcode can be fetched from a cache of cards
 * stored in a database and replenished periodically. They could also
 * be generated from onother source.
 * 
 * In the second case the barcodes may need to have a prefix added to
 * the student ID, which the library pre-defines, and Learning Pass
 * appends to the incoming ID at the time of account creation.
 */
const helpers = require('./helpers');
const { assert } = require("console");

// The barcode helper functions object for export.
const barcodeHelper = {};
const _barcode = {};
/** @TODO Confirm the max width of a user ID in the Symphony schema. */
/** @TODO check max is needed and get from config.json. */
// I chose 6 as the min because it seemed to be the smallest valid student ID I could find. 
_barcode.minWidth = 6;
_barcode.barcodeStrictRx= new RegExp(`\\d{${_barcode.minWidth},100}`, 'gm');
// Loose user ids in Symphony are uppercase but the incoming may not be.
_barcode.barcodeLooseRx = new RegExp(/^[a-z0-9_]{1,}$(?!\@)/, 'gmi');
// passwords are minimum 4 chars, and those 4 chars can't be white space.

/**
 * Tests if the barcode can be used as a valid user ID in Symphony.
 * This version of Learning Pass does not support emails as user IDs,
 * because of the complication of dynamic indexing.
 * 
 * @param {*} str user id sent from other institution.
 */
 barcodeHelper.getBarcodeRelaxed = function(str){
    if (!str){
        return '';
    } else {
        let userIdArr = str.trim().match(_barcode.barcodeLooseRx);
        if (userIdArr && userIdArr.length > 0){
            // console.log('=======got here>:',userIdArr[0]);
            let userId = userIdArr[0].toUpperCase();
            return userId.length >= _barcode.minWidth ? userId : '';
        } else {
            return '';
        }
    }
};

/**
 * Returns the barcode if str must be a number between 'n' and 'm' digits in length.
 * Negative min and max values are not allowed, and are changed with Math.abs(m).
 * @param {*} min Min length of barcode which has a hard limit of 6 in the regex.
 * @param {*} max Max length of barcode
 * @param {*} str barcode string from customer account.
 */
 barcodeHelper.getBarcode = function(min,max,str){
    if (min && max && str){
        assert(typeof(min) == 'number', "min barcode length must be a number.");
        assert(typeof(max) == 'number', "max barcode length must be a number.");

        // stop the use of negative numbers.
        min = Math.abs(min);
        max = Math.abs(max);

        // If min and max got mixed up swap them.
        if (min > max){
            let p = min;
            min = max;
            max = p;
        }

        // Min width of customer ID usefully could be a student ID of no fewer than _barcode.minWidth digits.
        if (min < _barcode.minWidth) {
            console.log(`Warning illegal value. Length of user ID: ${min}, setting to ${_barcode.minWidth}. See helper.js.`);
            min = _barcode.minWidth;
        }

        // Clean trailing white space and check against just numbers 6,100
        let bcArr = str.trim().match(_barcode.barcodeStrictRx);
        if (bcArr != null && bcArr.length > 0){
            let maybe_number = bcArr[0];
            // console.log('=======got here>:',min);
            if (maybe_number.length >= min && maybe_number.length <= max){
                return maybe_number;
            } else {
                return '';
            }
        } else {
            return '';
        }
    } else {
        return '';
    }
};

module.exports = barcodeHelper;
