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

const { spawnSync } = require( 'child_process' );

/**
 * Functions for testing various Javascript data types.
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

/**
 * Fetches the named data from a dictionary.
 * 
 * Both parameters are tested for their types before testing if 
 * the key is actually defined.
 * 
 * @param {*} obj Dictionary
 * @param {*} key String key to retrieve.
 * @returns the value stored by the given key or an empty string if 
 * the values doesn't exist or is anything other than a string.
 */
utilityTests.getDataByKey = function(obj,key) {
    if (this.hasDictData(obj) && this.hasStringData(key)) {
        return typeof(obj[key]) === 'string' ? obj[key] : '';
    } else {
        return '';
    }
}

/**
 * Removes empty strings from an array. If the argument object is not an
 * array or is empty the original object is returned, otherwise a new 
 * array without empty strings is returned.
 * 
 * @param {*} obj Tested for array with data.
 * @returns a new array with empty strings filtered out, 
 * if the parameter is an array of data, and the original object otherwise.
 */
 utilityTests.filterEmptyStrings = function(obj) {
    if (this.hasArrayData(obj)){
        let filtered = obj.filter(function (el) {
            return el != null && el !== ''; 
        });
        return filtered;
    } else {
        return obj;
    }
}

// definition of a command-based router. Only these commands are allowed.
const commands = {
    'isDuplicate' : 'check_user.sh',
    'false' : 'false'                 // Default run the false command.
};

/**
 * Helper to create consistent return object for results from system commands.
 * @param {*} cmd spawned with process's spawnSync method.
 * @returns dictionary object with stdout and stderr key value pairs.
 */
const _getCmdOutput = function(cmd,isTest=false) {
    let out = "LearningPass";
    let err = "operation not permitted";
    // guard that the system command exists and can be called as requested.
    out = cmd.stdout == null ? out : cmd.stdout.toString().split(/\r?\n/);
    out = utilityTests.filterEmptyStrings(out);
    err = cmd.stderr == null ? err : cmd.stderr.toString().split(/\r?\n/);
    err = utilityTests.filterEmptyStrings(err);
    if (isTest) {
        console.log('stdout = ',out);
        console.log('stderr = ',err);
    }
    return {"stdout":out,"stderr":err};
}

/**
 * A general implementation of a linux command and args, but restricted to 
 * the commands listed in command{}.
 * @param {*} command any linux command defined in the commands dictionary.
 * @param {*} args 
 * @returns stderr and stdout from the command run.
 */
 utilityTests.systemCmd = function(command,args,isTest=false) {
    // Only allow predefined commands to run otherwise use 'false' command as default.
    let sysCommand = typeof(commands[command]) === 'undefined' ? commands['false'] : commands[command];
    args = this.hasArrayData(args) ? args : [];
    let cmd = spawnSync(sysCommand, args);
    return _getCmdOutput(cmd,isTest);
}

module.exports = utilityTests;