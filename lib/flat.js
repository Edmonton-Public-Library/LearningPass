/**
 * This file flat.js contains utility functions for writing patron
 * information into Symphony's flat file format.
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

const fs = require('fs');
const utils = require('./util');
const path = require('path');
const dateHelpers = require('./date');

// The flat file container.
const flat = {};

const flatCustomer = {
    data : [],
    errors : []
};

const symphonyTags = {
   USER_ID : "USER_ID",                       //21221012345678
   USER_GROUP_ID : "USER_GROUP_ID",           // 
   USER_NAME : "USER_NAME",                   // Billy, Balzac
   USER_FIRST_NAME : "USER_FIRST_NAME",       // Balzac
   USER_LAST_NAME : "USER_LAST_NAME",         // Billy
   USER_PREFERRED_NAME : "USER_PREFERRED_NAME",
   USER_NAME_DSP_PREF : "USER_NAME_DSP_PREF", // 0
   USER_LIBRARY : "USER_LIBRARY",             //EPLMNA
   USER_PROFILE : "USER_PROFILE",             // EPL-STAFF
   USER_PREF_LANG : "USER_PREF_LANG",         // ENGLISH, or what-have-you
   USER_PIN : "USER_PIN",                     // password
   USER_STATUS : "USER_STATUS",               // OK, DELINQUENT, BARRED
   USER_ROUTING_FLAG : "USER_ROUTING_FLAG",   //Y
   USER_CHG_HIST_RULE : "USER_CHG_HIST_RULE", //ALLCHARGES
   USER_LAST_ACTIVITY : "USER_LAST_ACTIVITY", //20130201
   USER_PRIV_GRANTED : "USER_PRIV_GRANTED",   //20120705
   USER_PRIV_EXPIRES : "USER_PRIV_EXPIRES",   //20130705
   USER_BIRTH_DATE : "USER_BIRTH_DATE",       //20050303
   USER_CATEGORY1 : "USER_CATEGORY1",
   USER_CATEGORY2 : "USER_CATEGORY2",         //M - gender, or age group at Shortgrass
   USER_CATEGORY3 : "USER_CATEGORY3",
   USER_CATEGORY4 : "USER_CATEGORY4",
   USER_CATEGORY5 : "USER_CATEGORY5",
   USER_ACCESS : "USER_ACCESS",               //PUBLIC
   USER_ENVIRONMENT : "USER_ENVIRONMENT",     //PUBLIC
   USER_MAILINGADDR : "USER_MAILINGADDR",     //1
   USER_ADDR1_BEGIN : "USER_ADDR1_BEGIN",     
   STREET : "STREET",                         //7 123 Street.
   CITY_SLASH_STATE : "CITY/STATE",           // Edmonton : "", AB
   CITY_PROV : "CITYPROV",                    // Alternate for some libs.
   CITY_SLASH_PROV : "CITY/PROV",   
   POSTALCODE : "POSTALCODE",                 // T5J 2V4
   PHONE : "PHONE",                           // 780-496-4058
   PHONE_1 : "PHONE1",                        // 403-555-1212
   EMAIL : "EMAIL",                           // name@example.com
   USER_ADDR1_END : "USER_ADDR1_END",
   USER_ADDR2_BEGIN : "USER_ADDR2_BEGIN",
   USER_ADDR2_END : "USER_ADDR2_END",
   USER_ADDR3_BEGIN : "USER_ADDR3_BEGIN",
   USER_ADDR3_END : "USER_ADDR3_END",
   USER_XINFO_BEGIN : "USER_XINFO_BEGIN",
   NOTIFY_VIA : "NOTIFY_VIA",                 //PHONE
   NOTE : "NOTE",                             //ILS Team Test Account - DO NOT REMOVE!
   RETRNMAIL : "RETRNMAIL",                   //YES
   USER_XINFO_END : "USER_XINFO_END", 
   HOMEPHONE : "HOMEPHONE"
};



/** 
 * Helper object that contains all the Symphony default values. 
 * The calling application will augment and override any of
 * these values.
*/
flat._defaults = new Map();
flat._defaults.set("USER_NAME_DSP_PREF","0");
flat._defaults.set("USER_PREF_LANG"    ,"ENGLISH");
flat._defaults.set("USER_ROUTING_FLAG" ,"Y");
flat._defaults.set("USER_CHG_HIST_RULE","ALLCHARGES");
flat._defaults.set("USER_ACCESS"       ,"PUBLIC");
flat._defaults.set("USER_ENVIRONMENT"  ,"PUBLIC");
flat._defaults.set("USER_MAILINGADDR"  ,"1");
flat._defaults.set("NOTIFY_VIA"        ,"PHONE");
flat._defaults.set("RETRNMAIL"         ,"YES");

/** All customer-centric data related to a registration. */
flat.tagMap = new Map();
flat.tagMap.set("firstName", symphonyTags.USER_FIRST_NAME);
flat.tagMap.set("lastName",  symphonyTags.USER_LAST_NAME);
flat.tagMap.set("dob",       symphonyTags.USER_BIRTH_DATE);
flat.tagMap.set("gender",    symphonyTags.USER_CATEGORY2);
flat.tagMap.set("email",     symphonyTags.EMAIL);
flat.tagMap.set("phone",     symphonyTags.PHONE);
flat.tagMap.set("street",    symphonyTags.STREET);
flat.tagMap.set("city",      symphonyTags.CITY_SLASH_PROV); // These get concatnated.
// flat.tagMap.set("province",  symphonyTags.CITY_PROV);
// flat.tagMap.set("country",   symphonyTags.);
flat.tagMap.set("postalCode",symphonyTags.POSTALCODE);
flat.tagMap.set("barcode",   symphonyTags.USER_ID);
flat.tagMap.set("pin",       symphonyTags.USER_PIN);
flat.tagMap.set("type",      symphonyTags.USER_PROFILE);
flat.tagMap.set("expiry",    symphonyTags.USER_PRIV_EXPIRES);
flat.tagMap.set("branch",    symphonyTags.USER_LIBRARY);
flat.tagMap.set("status",    symphonyTags.USER_STATUS);
flat.tagMap.set("notes",     symphonyTags.NOTE);

/** Arrays of address and extended info blocks. Extend for addr2 and addr3 */
const addr1 = new Map();
const xinfo = new Map();

/** fields in addr1 object which require start and end tags. */
const blocks = new Map();
blocks.set("postalCode", addr1);
blocks.set("phone", addr1);
blocks.set("street", addr1);
blocks.set("city", addr1);
blocks.set("email", addr1); 
blocks.set("notes", xinfo);

/**
 * Common messages required when processing Flat data.
 */
flat._msg = {
    noJson: 'Customer json data empty or missing.',
    noFlatContainer: 'Flat container missing.',
    invalidDate: 'contains an invalid date.',
    missingFlatData: 'Expected an array of flat data to output.',
    errorFileClose: 'Failed to close flat file.',
    errorFileWrite: 'Failed to write flat data to file.',
    errorFileOpen: 'Failed to open flat file for writing.',
    invalidSymphonyTag: 'Failed to update flatDefaults with tag '
};

/**
 * Symphony date fields.
 */
flat.dateFields = ["dob","expiry"];

/**
 * Checks the account for predefined data fields (see flat.dateFields)
 * and replaces the dates with ANSI dates as required by Symphony.
 * 
 * Tests:
 * Should find and convert date fields to ANSI date strings.
 * Date fields with invalid dates are removed from the map, and reported.
 * @param {*} jsonMap Map of the customer's data.
 */
flat._convertDates = function(error,jsonMap){
    flat.dateFields.forEach(element => {
        if (jsonMap.has(element)) {
            let theDate = jsonMap.get(element);
            if (dateHelpers.hasDateData(theDate)) {
                jsonMap.set(element, dateHelpers.getANSIDate(theDate));
            } else {
                error.push(`"${element}" ${flat._msg.invalidDate}`);
            }
        }
    });
};

/**
 * 
 * @param {*} key The key from customer json, like: 'street'.
 * @param {*} value The value for the key, like: '11811 74 Ave.'
 * @returns The string version of the field to store, or false if it was block
 * data which will be added to the blocks object for output later.
 */
flat._getDataSortNStoreBlockData = function(key,value){
    let symphonyTag = flat.tagMap.get(key);
    if (!utils.hasStringData(symphonyTag)) return false;
    if (blocks.has(key)) {
        let blockDict = blocks.get(key);
        // Looks like: addr1{"POSTALCODE" : "T6G0G4"}
        blockDict.set(symphonyTag, value);
        return false;
    } else {
        return `.${symphonyTag}.    |a${value}`;
    }
};

flat._updateDefaults = function(defaultMap, defaults){
    // Add the library defaults.
    let myDefaults = new Map();
    for (let [key,value] of defaultMap){
        myDefaults.set(key,value);
    }
    // Add the partner organizations defaults (if any).
    if (utils.hasDictData(defaults)) {
        let argDefaultMap = new Map(Object.entries(defaults));
        for (let [key,value] of argDefaultMap){
            // test if the argument is actually a sanctioned symphony tag.
            if (symphonyTags[key]) {
                myDefaults.set(key,value);
            } else {
                console.log(`${this._msg.invalidSymphonyTag}: "${key}".`);
            }
        }
    }
    return myDefaults;
};

/**
 * Converts json data to flat data. The returned ojbect is also json which can be
 * sent to file with the write() function.
 * 
 * Tests:
 * Customer data exists and is valid; resolve flat data.
 * Customer data exists but is not valid; reject with message.
 * Customer data does not exist; reject with message.
 * 
 * @param {*} jsonCustomer the json data of customer registration data.
 * @param {*} flatCustomer an assciative array for the customer's flat data.
 * @param {*} flatDefaults Dictionary of default flat values.
 * @resolve message of success.
 * @reject  message(s) of issues with the account data if there was a problem
 * during conversion. 
 */
flat.toFlat = (jsonCustomer,flatCustomer,flatDefaults={}) => new Promise((resolve,reject) => {
    
    
    if (!flatCustomer) {
        reject(new Error(flat._msg.noFlatContainer));
    }
    
    if (!utils.hasDictData(jsonCustomer)) {
        flatCustomer.errors.push(flat._msg.noJson);
        reject(flatCustomer);
    }
    
    
    // clear any data out of the addr1 and xinfo from previous calls.
    addr1.clear();
    xinfo.clear();
    
    // Add the flat file headers.
    flatCustomer.data.push('*** DOCUMENT BOUNDARY ***');
    flatCustomer.data.push('FORM=LDUSER');

    // Map the incoming field to the Symphony tag, and convert dates etc.
    // but only if the value has data.
    let customerDataMap = new Map(Object.entries(jsonCustomer));
    // Convert Date objects or date strings to ANSI date strings.
    flat._convertDates(flatCustomer.errors,customerDataMap);
    for(const [key,value] of customerDataMap.entries()) {
        if (utils.hasStringData(value)) {
            // Test if block data and if it is store it in the right block.
            let nonBlockData = flat._getDataSortNStoreBlockData(key,value);
            if (nonBlockData) {
                // put the result on the flat user.
                flatCustomer.data.push(nonBlockData);
            }
        }
    }

    /** 
     * Add the defaults before the blocks.
     * But first update the default Symphony fields.
     */
    let myDefaults = flat._updateDefaults(flat._defaults, flatDefaults);
    if (myDefaults.size > 0) {
        for (let [key,value] of myDefaults) {
            flatCustomer.data.push(`.${key}.    |a${value}`);
        }
    }

    /** Add the block data. */
    // addr1 = {};
    if (addr1.size > 0) {
        flatCustomer.data.push(`.${symphonyTags.USER_ADDR1_BEGIN}.`);
        for(let [key,value] of addr1.entries()) {
            flatCustomer.data.push(`.${key}.    |a${value}`);
        }
        flatCustomer.data.push(`.${symphonyTags.USER_ADDR1_END}.`);
    }
    // xinfo = {};
    if (xinfo.size > 0) {
        flatCustomer.data.push(`.${symphonyTags.USER_XINFO_BEGIN}.`);
        for(let [key,value] of xinfo.entries()) {
            flatCustomer.data.push(`.${key}.    |a${value}`);
        }
        flatCustomer.data.push(`.${symphonyTags.USER_XINFO_END}.`);
    }
    flatCustomer.json = jsonCustomer;
    resolve(flatCustomer);
});

/**
 * Writes flat (json) data to a given file name or to stdout if a file name 
 * is not provided.
 * 
 * Tests:
 * Flat data exists and is complete and no file name provided; write to stdout, resolve with success message.
 * Flat data exists and is complete; write to stream, resolve with success message.
 * Flat data does not exist, or is invalid; reject with message.
 * 
 * @param {*} flatCustomer a Customer object which includes 'data':[]
 * and 'errors':[];
 * @param {*} fileName name of the flat file including path and file extension.
 * If none provided the flat data is written to STDOUT.
 *  
 * @resolve if the customer data was successfully written to the argument file,
 * @reject if there was a problem either with the data itself, or while writing
 * to file.
 */
flat.write = (flatCustomer,fileName=false) => new Promise((resolve,reject) => {
    
    if (fileName){
        let outStr = '';
        // eslint-disable-next-line no-undef
        let fileAndPath = path.join(__dirname, fileName);
        // String-ify to make one call to write the file.
        for (let i = 0; i < flatCustomer.data.length; i++) {
            outStr += flatCustomer.data[i] + '\n';
        }
        // Empty line may cause loadflat user to emit unnecessary messages to STDERR.
        outStr = outStr.substr(0, (outStr.length-1));
        fs.writeFile (fileAndPath, outStr, (err) => {
            if (err) {
                flatCustomer.errors.push(err);
                reject(flatCustomer);
            }
            resolve(fileAndPath);
        });
    } else {
        fileName = 'console';
        // Write the data to command line.
        for (let i = 0; i < flatCustomer.data.length; i++) {
            console.log(`${flatCustomer.data[i]}`);
        }
        resolve(fileName);
    }
});

module.exports = {flatCustomer, flat};