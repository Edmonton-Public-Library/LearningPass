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

const { assert } = require("console");

// Helpers object.
const helpers = {};
const _field = {};
_field.emailRx      = new RegExp('^[_A-Z0-9-+]+(\.[_A-Z0-9-]+)*@[A-Z0-9-]+(\.[A-Z0-9]+)*(\.[A-Z]{2,})', 'gmi');
_field.phoneRx      = new RegExp('[0-9]{3}-[0-9]{3}-[0-9]{4}', 'gi');
_field.postalCodeRx = new RegExp('[A-Z][0-9][A-Z][0-9][A-Z][0-9]', 'gi');
_field.streetRx     = new RegExp('[a-z0-9]+[\s,\.\-]?.+[a-z0-9\.,]', 'gmi');
// @TODO: Confirm the max width of a user ID in the Symphony schema.
// I chose 6 as the min because it seemed to be the smallest valid student ID I could find. 
_field.min_width    = 6;
_field.barcodeStrict= new RegExp(`\\d{${_field.min_width},100}`, 'gm');
// Loose user ids in Symphony are uppercase but the incoming may not be.
_field.barcodeLoose = new RegExp('^[a-z0-9_]{1,}$(?!\@)', 'gmi');
// _field.firstName    = new RegExp('^[a-z-\s+,]{1,}$(?!\@)', 'gmi');

/**
 * Capital cases all the words in a string.
 * @param {*} strArr a non-empty list of strings.
 */
helpers.capitalize = function(str){
    if (!str){
        return '';
    } else {
        let strArr = str.trim().split(/\s+/);
        if (strArr && strArr.length > 0){
            // console.log("=====>",strArr);
            for (i = 0; i < strArr.length; i++) {
                strArr[i] = strArr[i][0].toUpperCase() + strArr[i].slice(1).toLowerCase();
            }
            return strArr.join(' ');
        } else {
            return str;
        }
    }
};

/**
 * Takes an arbitrary string and try to parse it into JSON, 
 * but handle errors gracefully. if something goes wrong 
 * return an empty object.
 * @param {*} jsonStr 
 */
helpers.parseJsonToObject = function(jsonStr){
    try{
        return JSON.parse(jsonStr);
    } catch(e) {
        console.log('Error invalid JSON in str: "',jsonStr,'"');
        return {};
    }
};

/**
 * Checks if the argument string a well-formed email address.
 * @param {*} str string that is supposed to be an email.
 */
helpers.getEmail = function(str){
    if (str)
    {
        let email = str.match(_field.emailRx);
        if (email && email.length > 0){ 
            return typeof(email[0]) == 'string' && email[0].length > 0 ? email[0] : '';
        } else {
            return '';
        }
    } else {
        return '';
    }
    
};

/**
 * Checks for valid phone number and returns a clean version.
 * +1(780) 242-5555 => 780-242-5555
 * @param {*} str string that is supposed to be a phone number.
 */
helpers.getPhone = function(str){
    if (!str){
        return '';
    } else {
        
        let phone = str.replace(/^\+\d/g, '');
        phone = phone.replace(/\(|\)/g, '');
        phone = phone.replace(/\s+/g, '-');
        let phoneArr = phone.match(_field.phoneRx);
        if (phoneArr && phoneArr.length > 0){
            return phoneArr[0];
        } else {
            return '';
        }
    }
};

/**
 * Checks for valid postal code and returns a clean version
 * or an empty string if the postal code is invalid.
 * 
 * @param {*} str string to compare for Canadian postal code.
 */
helpers.getPostalCode = function(str){
    if (!str){
        return '';
    } else {
        // clean of any '-' or ' ' characters.
        let postalCode = str.replace(/-|\s+/g, '');
        let pcArr = postalCode.match(_field.postalCodeRx);
        if (pcArr && pcArr.length > 0){
            return typeof(pcArr[0]) == 'string' ? pcArr[0].toUpperCase() : '';
        } else {
            return '';
        }
    }
};

/**
 * Street is tough, but all should have numbers and letters,
 * and not end in a digit, meh.
 * 
 * @param {*} str suspected street string.
 */
helpers.getStreet = function(str){
    if (!str){
        return '';
    } else {
        // clean of any '-' or ' ' characters.
        let street = str.toLowerCase().trim().replace(/-/g, ' ');
        let stArr = street.match(_field.streetRx);
        if (stArr && stArr.length > 0){
            // Capitalize each word.
            return helpers.capitalize(stArr[0]);
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
helpers.getBarcode = function(min,max,str){
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

        // Min width of customer ID usefully could be a student ID of no fewer than _field.min_width digits.
        if (min < _field.min_width) {
            console.log(`Warning illegal value. Length of user ID: ${min}, setting to ${_field.min_width}. See helper.js.`);
            min = _field.min_width;
        }

        // Clean trailing white space and check against just numbers 6,100
        let bcArr = str.trim().match(_field.barcodeStrict);
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

/**
 * Tests if the barcode can be used as a valid user ID in Symphony.
 * This version of Learning Pass does not support emails as user IDs,
 * because of the complication of dynamic indexing.
 * 
 * @param {*} str user id sent from other institution.
 */
helpers.getBarcodeRelaxed = function(str){
    if (!str){
        return '';
    } else {
        let userIdArr = str.trim().match(_field.barcodeLoose);
        if (userIdArr && userIdArr.length > 0){
            // console.log('=======got here>:',userIdArr[0]);
            let userId = userIdArr[0].toUpperCase();
            return userId.length >= _field.min_width ? userId : '';
        } else {
            return '';
        }
    }
};

/**
 * Ensures name is not ','-separated and returns the capital case
 * or an empty string if the string contains anything other than
 * word chars.
 * @param {*} str name string. 
 */
helpers.getName = function(str){
    
}

module.exports = helpers;
