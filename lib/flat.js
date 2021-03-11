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

const fs = require('fs');
const util = require('./util');
const dateHelper = require('./date');

/**
 *  USER_ID("USER_ID"),//21221012345678
 *  USER_GROUP_ID("USER_GROUP_ID"),//BALZAC
 *  USER_NAME("USER_NAME"),//Billy"), Balzac
 *  USER_FIRST_NAME("USER_FIRST_NAME"),//Balzac
 *  USER_LAST_NAME("USER_LAST_NAME"),//Billy
 *  USER_PREFERRED_NAME("USER_PREFERRED_NAME"),//Willy
 *  USER_NAME_DSP_PREF("USER_NAME_DSP_PREF"),//0
 *  USER_LIBRARY("USER_LIBRARY"),//EPLMNA
 *  USER_PROFILE("USER_PROFILE"),//EPL-STAFF
 *  USER_PREF_LANG("USER_PREF_LANG"),//ENGLISH
 *  USER_PIN("USER_PIN"),//64058
 *  USER_STATUS("USER_STATUS"),//OK
 *  USER_ROUTING_FLAG("USER_ROUTING_FLAG"),//Y
 *  USER_CHG_HIST_RULE("USER_CHG_HIST_RULE"),//ALLCHARGES
 *  USER_LAST_ACTIVITY("USER_LAST_ACTIVITY"),//20130201
 *  USER_PRIV_GRANTED("USER_PRIV_GRANTED"),//20120705
 *  USER_PRIV_EXPIRES("USER_PRIV_EXPIRES"),//20130705
 *  USER_BIRTH_DATE("USER_BIRTH_DATE"),//20050303
 *  USER_CATEGORY1("USER_CATEGORY1"),
 *  USER_CATEGORY2("USER_CATEGORY2"),//M - gender, or age group at Shortgrass
 *  USER_CATEGORY3("USER_CATEGORY3"),
 *  USER_CATEGORY4("USER_CATEGORY4"),
 *  USER_CATEGORY5("USER_CATEGORY5"),
 *  USER_ACCESS("USER_ACCESS"),//PUBLIC
 *  USER_ENVIRONMENT("USER_ENVIRONMENT"),//PUBLIC
 *  USER_MAILINGADDR("USER_MAILINGADDR"),//1
 *  USER_ADDR1_BEGIN("USER_ADDR1_BEGIN"),
 *  STREET("STREET"),//7 Sir Winston Churchill Square
 *  CITY_SLASH_STATE("CITY/STATE"),//Edmonton(""), AB
 *  CITY_PROV("CITYPROV"), // Alternate for some libs.
 *  CITY_SLASH_PROV("CITY/PROV"),
 *  POSTALCODE("POSTALCODE"),//T5J 2V4
 *  PHONE("PHONE"),// 780-496-4058
 *  PHONE_1("PHONE1"), // 403-496-4058
 *  EMAIL("EMAIL"),//ilsteam@epl.ca
 *  USER_ADDR1_END("USER_ADDR1_END"),
 *  USER_ADDR2_BEGIN("USER_ADDR2_BEGIN"),
 *  USER_ADDR2_END("USER_ADDR2_END"),
 *  USER_ADDR3_BEGIN("USER_ADDR3_BEGIN"),
 *  USER_ADDR3_END("USER_ADDR3_END"),
 *  USER_XINFO_BEGIN("USER_XINFO_BEGIN"),
 *  NOTIFY_VIA("NOTIFY_VIA"),//PHONE
 *  NOTE("NOTE"),//ILS Team Test Account - DO NOT REMOVE!
 *  RETRNMAIL("RETRNMAIL"),//YES
 *  USER_XINFO_END("USER_XINFO_END"), 
 *  HOMEPHONE("HOMEPHONE")
 */

//  "symphonyDefaults" : {
//     "USER_NAME_DSP_PREF" : 0,
//     "USER_PREF_LANG" : "ENGLISH",
//     "USER_ROUTING_FLAG" : "Y",
//     "USER_CHG_HIST_RULE" : "ALLCHARGES",
//     "USER_CATEGORY2" : "NA",
//     "USER_CATEGORY3" : "ECONSENT",
//     "USER_ACCESS" : "PUBLIC",
//     "USER_ENVIRONMENT" : "PUBLIC",
//     "USER_MAILINGADDR" : 1,
//     "NOTIFY_VIA" : "PHONE",
//     "RETRNMAIL" : "YES"
// }


// The flat file container.
const flat = {};
flat.status = {
    errors: [],
    flat: []
};

flat.registrationData = {

};

flat._msg = {
    noJson: 'Expected customer json data empty or missing.',
    noFlatContainer: 'Expected flat container but none received.'
};

/**
 * Converts json data to flat data. The returned ojbect is also json which can be
 * sent to file with the write() function.
 * 
 * Tests:
 * Customer data exists and is valid; resolve flat data.
 * Customer data exists but is not valid; reject with message.
 * Customer data does not exist; reject with message.
 * @param {*} messages message object where we stash errors and messages back to
 * the caller.
 * @param {*} jsonData the json data of customer registration data.
 * @param {*} flatData an assciative array for the customer's flat data.
 * @param {*} defaults Dictionary of default flat data settings.
 * @resolve message of success.
 * @reject  message(s) of issues with the account data if there was a problem
 * during conversion. 
 */
flat.toFlat = (jsonData,flatData,defaults) => new Promise((resolve,reject) => {
    /** @TODO (re)check customer settings, fill in blanks from 'flatDefaults' */
    if (!util.hasDictData(jsonData)) {
        flat.status.errors.push(flat._msg.noJson);
        reject(new Error(flat._msg.noJson));
    }
    if (!util.hasDictData(flatData)) {
        flat.status.errors.push(flat._msg.noFlatContainer);
        reject(new Error(flat._msg.noFlatContainer));
    }
});

/**
 * Writes flat (json) data to a given file name or to stdout if a file name 
 * is not provided.
 * 
 * Tests:
 * Flat data exists and is complete and no file name provided; write to stdout, resolve with success message.
 * Flat data exists and is complete; write to stream, resolve with success message.
 * Flat data does not exist, or is invalid; reject with message.
 * @param {*} flatData where, and what to call the file. Do not include suffix
 * that will be provided.
 * @param {*} fileName flat data of customer JSON.
 * @resolve if the customer data was successfully written to the argument file,
 * @reject if there was a problem either with the data itself, or while writing
 * to file.
 */
flat.write = (flatData,fileName=false) => new Promise((resolve,reject) => {

});

module.exports = flat;