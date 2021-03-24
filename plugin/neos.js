/**
 * This file note.js contains utility functions for Learning Pass.
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
 * This is a template file of how to extend Learning Pass 
 * to compile data in note fields.
 */
const noteCompiler = {};

noteCompiler.compile = function(customer) {
    let userCat1s = new Map();
    // UofA
    userCat1s.set("UA-ACADM"  , "UASTAFF");
    userCat1s.set("UA-EXTRNL" , "UASTAFF");
    userCat1s.set("UA-GRAD"   , "UANEW");
    userCat1s.set("UA-STAFF"  , "UASTAFF");
    userCat1s.set("UA-UGRD"   , "UANEW");
    userCat1s.set("UA-UGSPEC" , "UANEW");
    // Concordia
    userCat1s.set("CUA-ACADM ", "CONCACADM");
    userCat1s.set("CUA-GRAD"  , "CONCGRAD");
    userCat1s.set("CUA-STAFF" , "CONCSTAFF");
    userCat1s.set("CUA-UGRD"  , "CONCUGRAD");
    // Kings
    userCat1s.set("KING-ACADM" , "KINGSACADM");
    userCat1s.set("KING-STAFF" , "KINGSSTAFF");
    userCat1s.set("KING-STDNT" , "KINGSSTDNT");
    // GMAC
    userCat1s.set("MAC-DSSTAF" , "GMUDSTAFF");
    userCat1s.set("MAC-DSSTUD" , "GMUDSTU");
    userCat1s.set("MAC-RETIRE" , "GMUSTAFF");
    userCat1s.set("MAC-STAFF"  , "GMUSTAFF");
    userCat1s.set("MAC-STDNT"  , "GMUSTUDENT");
    // NQ
    userCat1s.set("NQ-STAFF"   , "NQSTAFF");
    userCat1s.set("NQ-STAFFOC" , "NQSTAFFOC");
    userCat1s.set("NQ-STDNT"   , "NQSTDNT");
    userCat1s.set("NQ-STUDOC"  , "NQSTUDOC");

    if (userCat1s.has(customer.type)){
        customer["USER_CATEGORY1"] = userCat1s.get(customer.type);
    } else {
        customer.notes = `Error undefined NEOS user cat1:"${customer.type}"`;
    }
};

module.exports = noteCompiler;