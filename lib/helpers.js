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
_field.emailRx = new RegExp("^[_A-Za-z0-9-\+]+(\.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\.[A-Za-z0-9]+)*(\.[A-Za-z]{2,})$", "gm");
_field.phoneRx = new RegExp("[0-9]{3}-[0-9]{3}-[0-9]{4}", "gi");

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

module.exports = helpers;
