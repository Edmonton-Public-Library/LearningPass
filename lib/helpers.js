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
_field.emailRx        = new RegExp(/^[_A-Z0-9-+]+(\.[_A-Z0-9-]+)*@[A-Z0-9-]+(\.[A-Z0-9]+)*(\.[A-Z]{2,})/, 'gmi');
_field.phoneRx        = new RegExp(/[0-9]{3}-[0-9]{3}-[0-9]{4}/, 'gi');
_field.postalCodeRx   = new RegExp(/[A-Z][0-9][A-Z][0-9][A-Z][0-9]/, 'gi');
_field.streetRx       = new RegExp(/[a-z0-9]+[\s,\.\-]?.+[a-z0-9\.,]/, 'gmi');
// @TODO: Confirm the max width of a user ID in the Symphony schema.
// I chose 6 as the min because it seemed to be the smallest valid student ID I could find. 
_field.min_width      = 6;
_field.barcodeStrictRx= new RegExp(`\\d{${_field.min_width},100}`, 'gm');
// Loose user ids in Symphony are uppercase but the incoming may not be.
_field.barcodeLooseRx = new RegExp(/^[a-z0-9_]{1,}$(?!\@)/, 'gmi');
// passwords are minimum 4 chars, and those 4 chars can't be white space.
_field.passwordRx     = new RegExp(/^[a-zA-Z0-9-!#$@&^,.:;\(\)\[\]~^%@*_+=\s]{4,125}$/);
_field.ansiDateRx     = new RegExp(/^[12]\d{7}$/);

/**
 * Returns an ANSI date (yyyymmdd) required of Symphony dates, based on either
 * 'mm/dd/yyyy' or 'mm-dd-yyyy' or 'yyyy-mm-dd' or 'yyyy/mm/dd' or 'yyyymmdd'.
 * 
 * @param {*} str date string to convert to ANSI (integer).
 * @returns The argument date as an ANSI (yyyymmdd) integer on success and 
 * an empty string otherwise.
 */
helpers.getDate = function(str){
    if (!str){
        return '';
    }
    // Replace any date with slashes with '-'.
    let parmsStr = str.trim().replace(/\//g, '-');
    parms = parmsStr.split(/-/);
    // if there were no delimiters, test for 'yyyymmdd'.
    if (parms.length == 1) {
        // If the date string is too short it messes with slicing algorithm below.
        if (! parms[0].match(_field.ansiDateRx)) {
            return '';
        }
        // Reassign params with each character.
        parms = parms[0].split('');
        let yyyy = parseInt(parms.slice(0,4).join(''),10);
        let mm   = parseInt(parms.slice(4,6).join(''),10);
        let dd   = parseInt(parms.slice(6).join(''),10);
        let date = new Date(yyyy,mm-1,dd,0,0,0,0);
        if ((date.getFullYear() + date.getMonth()+1) && dd === date.getDate() && yyyy === date.getFullYear()){
            return parseInt(`${yyyy}${mm.toString().padStart(2,'0')}${dd.toString().padStart(2,'0')}`);
        } else {
            return '';
        }
    }

    // There were delimiters so try 'mm/dd/yyyy' first.
    let yyyy = parseInt(parms[2],10);
    let mm   = parseInt(parms[1],10);
    let dd   = parseInt(parms[0],10);
    let date = new Date(yyyy,mm-1,dd,0,0,0,0);
    // console.log('========================================>',date,dd,mm,yyyy,parms);
    if ((date.getFullYear() + date.getMonth()+1) && dd === date.getDate() && yyyy === date.getFullYear()){
        return parseInt(`${yyyy}${mm.toString().padStart(2,'0')}${dd.toString().padStart(2,'0')}`);
    } else {
        // Okay so how about 'yyyy-mm-dd' cause if this fails, it isn't a date.
        yyyy = parseInt(parms[0],10);
        mm   = parseInt(parms[1],10);
        dd   = parseInt(parms[2],10);
        date = new Date(yyyy,mm-1,dd,0,0,0,0);
        if ((date.getFullYear() + date.getMonth()+1) && dd === date.getDate() && yyyy === date.getFullYear()){
            return parseInt(`${yyyy}${mm.toString().padStart(2,'0')}${dd.toString().padStart(2,'0')}`);
        } else {
            // Well I give up then, what you gave me either is not a date, or is in a unexpected format.
            return '';
        }
    }
};

/**
 * Capital cases all the words in a string.
 * @param {*} strArr a non-empty list of strings.
 */
helpers.capitalize = function(str){
    if (!str){
        return '';
    } else {
        // The words that are hyphenated are individually capitalized.
        let baHyphen = str.trim().split(/-+/);
        for (j = 0; j < baHyphen.length; j++){
            // For each string between hyphens Capitalize.
            let strArr = baHyphen[j].split(/\s+/);
            if (strArr && strArr.length > 0){
                for (i = 0; i < strArr.length; i++) {
                    strArr[i] = strArr[i][0].toUpperCase() + strArr[i].slice(1).toLowerCase();
                }
            }
            baHyphen[j] = strArr.join(' ');
        }
        return baHyphen.join('-');
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
        let bcArr = str.trim().match(_field.barcodeStrictRx);
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
        let userIdArr = str.trim().match(_field.barcodeLooseRx);
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
helpers.getFirstName = function(str){
    if (!str){
        return '';
    } else {
        let strArr = str.split(/[,\s]+/g);
        // console.log("==========>",strArr);
        if (strArr && strArr.length > 1){
            // If the string supplied is 'Kong, King' return the second
            return str.indexOf(',') > -1 ? helpers.capitalize(strArr[1]) : helpers.capitalize(strArr[0]);
        } else {
            return typeof(strArr) !== 'null' && strArr.length > 0 ? helpers.capitalize(strArr[0]) : '';
        }
    }
}

/**
 * Ensures name is not ','-separated and returns the capital case
 * or an empty string if the string contains anything other than
 * word chars.
 * @param {*} str name string. 
 */
helpers.getLastName = function(str){
    if (!str){
        return '';
    } else {
        let strArr = str.split(/[,\s]+/g);
        // console.log("==========>",strArr);
        if (strArr && strArr.length > 1){
            // If the string supplied is 'Kong, King' return the second
            return str.indexOf(',') > -1 ? helpers.capitalize(strArr[0]) : helpers.capitalize(strArr[1]);
        } else {
            return typeof(strArr) !== 'null' && strArr.length > 0 ? helpers.capitalize(strArr[0]) : '';
        }
    }
}

/**
 * Checks that the pin is present and some minimal length.
 * @param {*} str the customer supplied password.
 * @TODO: add tests for compliance with allowedChars in configuration.
 */
helpers.getPassword = function(str){
    if (!str) {
        return '';
    } else {
        let pass = str.trim().match(_field.passwordRx);
        if (pass && pass.length > 0){
            return pass[0];
        } else {
            return '';
        }
    }
};

module.exports = helpers;
