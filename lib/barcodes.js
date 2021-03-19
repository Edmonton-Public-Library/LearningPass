/**
 * This file barcoes.js contains utility functions for managing
 * library barcodes.
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
const util = require('./util');

// The barcode helper functions object for export.
const barcodeHelper = {};
const _barcode = {};

// I chose 6 as the min because it seemed to be the smallest valid student ID I could find. 
_barcode.minWidth = 1;
_barcode.maxWidth = 100;

// Loose user ids in Symphony are uppercase but the incoming may not be.
_barcode.barcodeLooseRx = new RegExp(/^[a-z0-9_]{1,}$(?!\@)/, 'gmi');

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
 * Supplies a new library barcode from a pre-loaded selection
 * @returns library barcode.
 */
barcodeHelper.getLibraryBarcode = (error,customer) => new Promise((resolve,reject) => {
    /** @TODO get database lookup of barcodes. */
    // use MongoDB for this.
    resolve(customer);
});

/**
 * Adds more barcodes to the barcode database.
 * @param {*} err object if there was a database CRUD issue.
 * @param {*} barcodeList list of barcodes, one-per-line.
 */
barcodeHelper.replenishBarcodeDatabase = (error,barcodeList) => new Promise((resolve,reject) => {
    /** @TODO finish me so I load a list of barcodes into a database. */
    resolve(true);
});

/**
 * Returns the barcode if str must be a number between 'n' and 'm' digits in length.
 * Negative min and max values are not allowed, and are changed with Math.abs(m).
 * @param {*} min Min length of barcode which has a hard limit of 6 in the regex.
 * @param {*} max Max length of barcode
 * @param {*} str barcode string from customer account.
 */
 barcodeHelper.getBarcode = function(min,max,str){
    // if (min && max && str){
    if (str){


        let myMin;
        let myMax;
        if (util.hasPosIntData(max) && max > _barcode.minWidth && max > min){
            myMax = max;
        } else {
            console.log(`Warning illegal value for barcode max width '${max}'. Using defaults: ${_barcode.maxWidth}.`);
            myMax = _barcode.maxWidth;
        }
        if (util.hasPosIntData(min) && min >= _barcode.minWidth && min < max){
            myMin = min;
        } else {
            console.log(`Warning illegal value for barcode min width '${min}'. Using defaults: ${_barcode.minWidth}.`);
            myMin = _barcode.minWidth;
        }
 
        

        let barcodeStrictRx= new RegExp(`^\\d{${myMin},${myMax}}$`, 'gm');
        // Clean trailing white space and check against just numbers 6,100
        let bcArr = str.trim().match(barcodeStrictRx);
        if (bcArr != null && bcArr.length > 0){
            let maybe_number = bcArr[0];
            if (maybe_number.length >= myMin && maybe_number.length <= myMax){
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
