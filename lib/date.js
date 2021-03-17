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

/**
 * Functions for testing verious Javascript datatypes.
 */
const dateHelpers = {};
dateHelpers._ansiDateRx = new RegExp(/^[12]\d{7}$/);


/**
 * Tests if an object is a non-empty string.
 * @param {*} str any object.
 * @returns true if the argument was a non-empty string, and false otherwise.
 */
dateHelpers.hasStringData = function(obj){
    if(!obj) return false;
    if (obj instanceof Array) return false;
    return typeof(obj) === 'string' && obj.trim().length > 0 ? true : false;
};

/**
 * Test if the argument object is an integer.
 * @param {*} daysInt any object.
 * @returns true if the argument is an integer and false otherwise.
 */
dateHelpers.isInt = function(obj,strictlyPositive=false){
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
};

/**
 * Returns an ANSI date (yyyymmdd) required of Symphony dates, based on either
 * 'mm/dd/yyyy' or 'mm-dd-yyyy' or 'yyyy-mm-dd' or 'yyyy/mm/dd' or 'yyyymmdd'.
 * 
 * @param {*} str date string to convert to ANSI (integer).
 * @returns The argument date as an ANSI (yyyymmdd) integer on success and 
 * an empty string otherwise.
 */
 dateHelpers.getANSIDate = function(str){
    if (!str){
        return '';
    }
    if (dateHelpers.hasDateData(str)) {
        let dateStr = dateHelpers.stringToDate(str);
        return (dateStr).toISOString().slice(0,10).replace(/-/g,"");
    } else {
        return '';
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
dateHelpers.stringToDate = function(str){
    if (dateHelpers.hasStringData(str)){
        // the string could be an ANSI date.
        if (str.match(dateHelpers._ansiDateRx)){
            let parms = str.split('');
            let yyyy = parseInt(parms.slice(0,4).join(''),10);
            let mm   = parseInt(parms.slice(4,6).join(''),10);
            mm = (mm>9 ? '' : '0') + mm;
            let dd   = parseInt(parms.slice(6).join(''),10);
            dd = (dd>9 ? '' : '0') + dd;
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
 dateHelpers.compareToday = function(testDate) {
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
dateHelpers.daysAndYearsAgo = function(testDate) {
    let msPerMinute = 60 * 1000;
    let msPerHour = msPerMinute * 60;
    let msPerDay = msPerHour * 24;
    let msPerYear = msPerDay * 365;
    let elapsed;

    elapsed = new Date() - testDate;
    
    let daysYears = {};
    let days = Math.round(elapsed/msPerDay);   
    let years= Math.round(elapsed/msPerYear);
    daysYears.days = parseInt(days,10);
    daysYears.years = parseInt(years,10);
    return daysYears;
};

/**
 * Get a Date daysInt days from now. If the value is negative the date
 * will be in the past, if positive, in the future.
 * @param {*} daysInt a date object of the number of days in the future.
 * @returns Date object if the argument was an integer, and an empty string
 * otherwise.
 */
dateHelpers.getDateFromDays = function(daysInt){
    if (dateHelpers.isInt(daysInt)) {
        let now = new Date();
        now.setDate(now.getDate() + daysInt);
        now.setHours(0,0,0,0);
        return new Date(now);
    } else {
        console.log(`Error, request for '${daysInt}' days from now is invalid.`);
        return '';
    }
};

/**
 * Tests if a string is a date.
 * @param {*} obj Any object including undefined and null.
 * @returns true if the string was a date-like thing, and false otherwise.
 */
 dateHelpers.hasDateData = function(obj){
    if (!obj) return false;
    if (obj instanceof Array) return false;
    let testDate = dateHelpers.stringToDate(obj);
    return (testDate !== "Invalid Date") && !isNaN(testDate);
};

module.exports = dateHelpers;