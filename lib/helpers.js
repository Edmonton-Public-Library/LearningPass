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

// Helpers object.
const helpers = {};
const _field = {};
_field.emailRx        = new RegExp(/^[_A-Z0-9-+]+(\.[_A-Z0-9-]+)*@[A-Z0-9-]+(\.[A-Z0-9]+)*(\.[A-Z]{2,})/, 'gmi');
_field.phoneRx        = new RegExp(/[0-9]{3}-[0-9]{3}-[0-9]{4}/, 'gi');
_field.postalCodeRx   = new RegExp(/[A-Z][0-9][A-Z][0-9][A-Z][0-9]/, 'gi');
_field.streetRx       = new RegExp(/[a-z0-9]+[\s,\.\-]?.+[a-z0-9\.,]/, 'gmi');
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
helpers.getANSIDate = function(str){
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
 * This function do its best to return a date.
 * 
 * If the argument string is empty, a new Date object is returned with 
 * today's date. If an ANSI string is sent, it will be converted into a
 * Date object.
 * 
 * @param {*} str with ansi date (yyyymmdd).
 * @returns A Date object no matter what.
 * @throws Invalid Date exception if the argument string is nonsense
 * null or undefined.
 */
helpers.stringToDate = function(str){
    if (helpers.hasStringData(str)){
        // the string could be an ANSI date.
        if (str.match(_field.ansiDateRx)){
            let parms = str.split('');
            let yyyy = parseInt(parms.slice(0,4).join(''),10);
            let mm   = parseInt(parms.slice(4,6).join(''),10);
            let dd   = parseInt(parms.slice(6).join(''),10);
            return new Date(`${yyyy}-${mm}-${dd}`);
        }
    }
    return new Date(str);
};

/**
 * Compares a given date to today's date.
 * @param {*} testDate Date obj.
 * @returns -1 if the date is in the past, 0 if the date is today, 
 * and 1 if the date is in the future.
 */
 helpers.compareToday = function(testDate) {
    let today = new Date();
    if (testDate - today > 0) {
        return 1;
    } 
    if (testDate - today < 0) {
        return -1;
    } else {
        return 0;
    }
};


/**
 * Computes how many days and years ago a given date is from today.
 * 
 * The function returns negative integers for days and years in the
 * future, positive integers for the past.
 * @param {*} testDate 
 * @returns {days, years} asscociative array. (-) days, years
 * in the past, (+) days, years from now.
 */
helpers.daysAndYearsAgo = function(testDate) {
    let msPerMinute = 60 * 1000;
    let msPerHour = msPerMinute * 60;
    let msPerDay = msPerHour * 24;
    let msPerYear = msPerDay * 365;
    let sign = '';
    let elapsed;
    // Dates greater than today are -days in the past.
    // if (testDate.getTime() > new Date().getTime()){
    //     sign = '-';
    //     elapsed = testDate - new Date();
    // } else {
    //     sign = '+';
        elapsed = new Date() - testDate;
    // }
    
    let daysYears = {};
    let days = Math.round(elapsed/msPerDay);   
    let years= Math.round(elapsed/msPerYear);
    daysYears.days = parseInt(days,10);
    daysYears.years = parseInt(years,10);
    return daysYears;
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

/**
 * Tests if the argument is a dictionary with data in it.
 * @param {*} obj - any javascript object.
 * @returns true if obj is a dictionary and contains data, 
 * and false otherwise.
 */
helpers.hasDictData = function(obj){
    if(!obj) return false;
    if(Array.isArray(obj)) return false;
    if(obj.constructor != Object) return false;
    if(Object.keys(obj).length == 0) return false;
    return true;
};

/**
 * Tests if the argument is an array with data in it.
 * @param {*} obj - any javascript object.
 * @returns true if obj is an array and contains data, 
 * and false otherwise.
 */
helpers.hasArrayData = function(obj){
    if(!obj) return false;
    return obj instanceof Array && obj.length > 0 ? true : false;
};

/**
 * Tests if the argument is a non-zero length string.
 * @param {*} obj - any javascript object.
 * @returns true if obj is a non-zero length string, 
 * and false otherwise.
 */
helpers.hasStringData = function(obj){
    if(!obj) return false;
    if (obj instanceof Array) return false;
    return typeof(obj) === 'string' && obj.trim().length > 0 ? true : false;
};

/**
 * Tests if a string is a date.
 * @param {*} str Any object including undefined and null.
 * @returns true if the string was a date-like thing, and false otherwise.
 */
 helpers.hasDateData = function(str){
    if (!str) return false;
    if (str instanceof Array) return false;
    let testDate = helpers.stringToDate(str);
    return (testDate !== "Invalid Date") && !isNaN(testDate);
};

/**
 * Test if an object is a positive integer. '0' = true, 'one' = false
 * 1 = true.
 * 
 * @param {*} obj any object. If a string is passed, it is checked if it
 * has a positive integer.
 * @returns true if the value is a positive integer and false otherwise.
 */
helpers.hasIntData = function(obj,strictlyPositive = false){
    if (!obj) return false;
    if (obj instanceof Array) return false;
    // Can be an integer posing as a string.
    if (typeof(obj) === 'string'){
        try {
            return parseInt(obj) >= 0;
        } catch (err){
            return false;
        }        
    }
    if (isNaN(obj)) return false;
    if (strictlyPositive && Math.sign(obj) < 0) {
        return false;
    }
    return true;
}

/**
 * 
 * @param {*} obj checks if the argument is an integer.
 * @returns true if the obj is an integer or string representation
 * of an integer and false otherwise.
 */
helpers.hasPosIntData = function(obj){
    return helpers.hasIntData(obj,true);
};

module.exports = helpers;
