/**
 * This file util.js contains utility functions for Learning Pass.
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
/**
 * Functions for testing verious Javascript datatypes.
 */
const utilityTests = {};
/**
 * Tests if the argument is a dictionary with data in it.
 * @param {*} obj - any javascript object.
 * @returns true if obj is a dictionary and contains data, 
 * and false otherwise.
 */
utilityTests.hasDictData = function(obj){
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
utilityTests.hasArrayData = function(obj){
    if(!obj) return false;
    return obj instanceof Array && obj.length > 0 ? true : false;
};

/**
 * Tests if the argument is a non-zero length string.
 * @param {*} obj - any javascript object.
 * @returns true if obj is a non-zero length string, 
 * and false otherwise.
 */
utilityTests.hasStringData = function(obj){
    if(!obj) return false;
    if (obj instanceof Array) return false;
    return typeof(obj) === 'string' && obj.trim().length > 0 ? true : false;
};

/**
 * Test if an object is a positive integer. '0' = true, 'one' = false
 * 1 = true.
 * 
 * @param {*} obj any object. If a string is passed, it is checked if it
 * has a positive integer.
 * @returns true if the value is a positive integer and false otherwise.
 */
utilityTests.hasIntData = function(obj,strictlyPositive = false){
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
utilityTests.hasPosIntData = function(obj){
    return utilityTests.hasIntData(obj,true);
};

module.exports = utilityTests;