/**
 * This file helpers.js contains utility functions for basic data
 * conformance testing and conversion.
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

const utils = require('./util');
const logger = require('../logger');

// Helpers object.
const helpers = {};
const _field = {};
_field.emailRx        = new RegExp(/^[_A-Z0-9-+]+(\.[_A-Z0-9-]+)*@[A-Z0-9-]+(\.[A-Z0-9]+)*(\.[A-Z]{2,})/, 'gmi');
_field.phoneRx        = new RegExp(/[0-9-]{3,16}/, 'g');
_field.postalCodeRx   = new RegExp(/[A-Z][0-9][A-Z][0-9][A-Z][0-9]/, 'gi');
_field.streetRx       = new RegExp(/[a-z0-9]+[\s,.-]?.+[a-z0-9.,]/, 'gmi');
// passwords are minimum 4 chars, and those 4 chars can't be white space.
_field.passwordMaxLength = 125;
// As of 2021-04-07 Bibliocommons will not let customers log 
// into the OPAC with passwords with the following characters: 
// ; & " / ` % \ ? ' : $ ^ # * ( ) - = { } [ ] < > . , ~ and +
_field.passwordRx     = new RegExp(/^[a-zA-Z0-9-!#$@&^,.:;()[\]~^%@*_+=\s]{4,125}$/);

/**
 * Creates a hash of a given string.
 * @param {*} str string to hash
 * @returns Hash of the string using the same method used by Java.
 */
helpers.hashCode = function(str){
    let hash = 0;
    let i;
    let chr;
    if (str.length === 0) return hash;
    for (i = 0; i < str.length; i++) {
        chr   = str.charCodeAt(i);
        hash  = ((hash << 5) - hash) + chr;
        hash |= 0; // Convert to 32bit integer
    }
    return Math.abs(hash);
};

/**
 * Horizon system only allow 4-digit pins as passwords. If the customer
 * information inbound contains a real password, you use this function
 * to convert it to a PIN that represents their password.
 * 
 * @param {*} str recommend the person's password so when ever they send 
 * it you always get the same hash for the same password.
 * @returns a 4-digit PIN of the argument string could be hashed  
 * and an empty string otherwise.
 */
helpers.getFourDigitPin = function(str){
    if (utils.hasStringData(str)) {
        return helpers.hashCode(str) % 10000;
    } else {
        return '';
    }
};

/**
 * Checks that the password is present and some minimal length.
 * @param {*} str the customer supplied password.  
 * @TODO: add tests for compliance with allowedChars in configuration.
 */
 helpers.getPassword = function(str,passRx=_field.passwordRx){
    if (!str) {
        return '';
    } else {
        let pass = str.trim().match(passRx);
        if (pass && pass.length > 0){
            return pass[0];
        } else {
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
        for (let j = 0; j < baHyphen.length; j++){
            // For each string between hyphens Capitalize.
            let strArr = baHyphen[j].split(/\s+/);
            if (strArr && strArr.length > 0){
                for (let i = 0; i < strArr.length; i++) {
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
        logger.error(`Error invalid JSON in str: '${jsonStr}'`);
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
        let phone = str.replace(/[+()./]/g, ' ').trim().replace(/\s+/g, '-');
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
 * Ensures name is not ','-separated and returns the capital case
 * or an empty string if the string contains anything other than
 * word chars.
 * @param {*} str name string. 
 */
helpers.getFirstName = function(str){
    // False means get the last word which is the first name in a comma-sep'd string.
    return str.indexOf(',') > -1 ? helpers.capitalize(this.splitCommaString(str,false)) : helpers.capitalize(this.splitCommaString(str,true));
}

/**
 * Ensures name is not ','-separated and returns the capital case
 * or an empty string if the string contains anything other than
 * word chars.
 * @param {*} str name string. 
 */
helpers.getLastName = function(str){
    // return helpers.capitalize(this._splitCommaString(str,true));
    return str.indexOf(',') > -1 ? helpers.capitalize(this.splitCommaString(str,true)) : helpers.capitalize(this.splitCommaString(str,false));
}

helpers.splitCommaString = function(str,firstWord=true) {
    if (!str){
        return '';
    } 
    let strArr = str.split(/[,\s]+/g);
    if (strArr && strArr.length > 1){
        // If the string supplied is 'Kong, King Pin' return either 'Kong' or 'King Pin'
        return firstWord == true ? strArr[0] : strArr.slice(1).join(' ');
    } else {
        // There was no parts to split.
        return str;
    }
}

module.exports = helpers;
