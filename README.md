
# Learning Pass

### TODO list
* Handle customer status. *Done*
* Complete PIN helpers. *Done*
* Complete password checking for customer. *Done*
* Manage expiry.*Done*
* Manage customer's preferred branch.*Done*
* Stub notes.js for future dev if required.*Done*
* Implement issuing library cards in barcodes section. *Pending*
* Create flat file of customer data.*Done*
* Server
    * Upload library card list if admin. *Pending*
    * New route to show available branches. *Pending*

# License
Copyright 2021 Andrew Nisbet and Edmonton Public Library

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.

# Project Goals
Learning Pass is a web service that creates customer accounts on a SirsiDynix Symphony ILS. It was originally designed to allow students to register their student ID as a library card at Edmonton Public Library. The project is re-written to meet the following objectives.
* Allow organizations that partner with a library to create library accounts on behalf of that partner.
* Scale to allow multiple organizations to use the same web service.
* Allow different business rules for different organizations. For example, age restrictions, or expiry dates can be managed independently. 

# Project History
The Learning Pass is a re-write of the University of Albert's L-Pass. The move to Learning Pass was prompted by Edmonton Public Library moving off of University servers, offering an opportunity to modernize this business system.

# Overview
The Learning Pass is an application that is written in pure node.js. There are no npm dependencies to install.

## HTTP and HTTPS
The server can run with either http or https. If https is desired, ensure SSL key and certificate are installed correctly, and up-to-date.

### Certificates
Set the following variables to the values for your server. Note that you will have to 
LPASS_SSL_PRIVATE_KEY=/etc/ssl/private/eplwild.key
LPASS_SSL_CERTIFICATE=/etc/ssl/certs/eplwild.crt

* The https directory is where Learning Pass looks for the certificate and key to run Learning Pass with SSL and HTTPS.

# Customer Schema
Learning Pass expects registration data to conform to the following JSON schema.
```json
{
  "firstName": "Stacey",
  "lastName": "Milner",
  "dob": "1974-08-22",
  "gender": "",
  "email": "example@gmail.com",
  "phone": "780-555-1212", 
  "street": "11535 74 Ave.", 
  "city": "Edmonton", 
  "province": "AB", 
  "country": "", 
  "postalCode": "T6G0G9",
  "barcode": "21221012345678",
  "pin": "I_like_Bread!",
  "type": "STUDENT",
  "expiry": "20210822",
  "branch": "",
  "status": "OK",
  "notes": "Grad student"
}
```

The example above include a complete set of fields, but the library can control which fields are required and those that are optional.

## [Required fields](#library-required) (required)
An account is created if the customer data contains all the fields the library and / or partner organization have decided are required.

## [Optional fields](#library-optional) (optional but recommended)
If an optional field is present the data is included in the registration. If a field is not indicated as required or optional may be ignored.

## Hints for fields
[x] The few the fields that are marked as required, the less chance the account will be rejected.
[x] The library should decide what their minimal requirement is and set that in their ```config.json```.
[x] Further refinement can be controlled in the ```partner.json``` file, depending on their ability to provide information. For example, if a partner can, and agrees to supply gender information, the server can treat it as required or optional without impacting other organizations.

# Setup
Learning Pass has a main ```config.json``` file for the library and server settings, including a dictionary of partners and where to find their configuration file.
# Library settings and dictionaries (config.json)
```json
{
    "application" : "Learning Pass",
    "version" : "1.0",
    "loopbackMode" : false,
    "testMode" : false,
    "customerSettings" : { ... },
    "production" : { ... },
    "staging" : { ... },
    "partners" : { ... }
}
```
## Application (optional)
The name of the application, which can be anything you wish. It can be used in welcome messaging.
```json
"application" : "Learning Pass",
```

## Version (optional)
The version of the ```config.json``` file. This can be anything and is meant to help with version control.
```json
"version" : "1.1",
```

## Loop back mode (required)
Puts the server into loopback mode. When registrations arrive the server will write flat files, but will append '.loopback' to the file name. This will stop any service from attempting to load the data on the ILS if it is not available during a planned outage. Once the outage is over, change the file(s)' name(s) by removing '.loopback' and they should be loaded on the next tick of [watcher.sh](https://github.com/anisbet/watcher). See [watcher.sh](https://github.com/anisbet/watcher) for more details.

```json
"loopbackMode" : false,
```

## Test mode (required)
Similar to loopback mode, but the files are output with a '.test' extension. This allows inspection of Learning Pass flat files with actually loading test data.
```json
"testMode" : false
```

## Production and Staging (required)
Dictionaries for controlling what ports Learning Pass will listen on for inbound requests, depending on if the instance is a test or production server.
```json
"production" : {
    "httpPort" : 5000,
    "httpsPort" : 5001,
    "envName" : "production",
    "directories" : {
        "flat" : "../Incoming",
        "certs" : "./https"
    }
}
```

## Partners
An array of partner dictionaries that list which organizations that are allowed to use Learning Pass. Each dictionary has three entries, all required.
```json
[{
  "name" : "Partner Name",
  "key" : "partners_api_key",
  "config" : "./path/to/partner.json"
},
...
]
```
The API key can be any string you want but should be shared with only that organization. Learning Pass uses that API key to identify which organization is sending a registration request and will parse, and modify registration information to meet the SLA of the library and partner.

You can add as many partner dictionaries as are needed to differentiate customer registrations. Think; for every class of customer, have a different partner configuration file. For example, if a school wanted student accounts to expire on August 31, but staff registration to never expire, the partner could have 2 different configuration files though, in this case it is highly likely students and staff could be differentiated in a more efficient way.

It is also helpful to have a test partner configuration to sandbox settings.

## Customer settings
A dictionary of settings used by Learning Pass to correctly configure customer data for loading in the ILS. There are controls for things like valid password limitations, reasonable default values for missing data, and other features explored in the sections below.
```json
"customerSettings" : {
  "library" : "EPL",
  "expiry" : { ... },
  "branch" : { ... },
  "flatDefaults" : { ... },
  "defaults" : { ... },
  "required" : [ ... ],
  "optional" : [ ... ],
  "merge" : { ... },
  "passwords" : { ... }
}
```
### Library (required)
Name of the library implementing Learning Pass.
```json
"library" : "Edmonton Public Library",
```

### Expiry (required)
Controls when accounts expire by default. The partner may also have an expiry dictionary which will supersede the library's. For example, if the library, by default, does not expire cards, the keyword 'NEVER' should be used.
```json
"expiry" : { 
  "date" : "NEVER"
},
```

Other values are allowed such as a specific date in the future, or "date" can be replaced with "days", which requires an integer of the number of days an account will have before expiry.
```json
"expiry" : { 
  "days": 365
},
```
### Branch (default required)
Describes choices of branches customers can choose as their 'home' branch. The 'valid' list is all the possible branches of the library.
```json
"branch" : {
      "default" : "EPLMNA",
      "valid" : ["EPLMNA","EPLWMC","EPLCAL","EPLJPL",
          "EPLCPL","EPLSTR","EPLWOO","EPLHIG","EPLCSD",
          "EPLMCN","EPLLON","EPLRIV","EPLWHP","EPLMEA",
          "EPLIDY","EPLMLW","EPLABB"
      ]},
```
### Flat default values (optional) {#library-flat-defaults}
Flat defaults are values used during customer creation that are standard for all regular library patrons.
```json
"flatDefaults" : {
      "USER_CATEGORY5" : "ECONSENT",
      "USER_ACCESS" : "PUBLIC",
      "USER_ENVIRONMENT" : "PUBLIC",
      "USER_MAILINGADDR" : 1,
      "NOTIFY_VIA" : "PHONE",
      "RETRNMAIL" : "YES"
  },
```

### Defaults dictionary (optional) {#library-defaults}
Accounts that are missing required data can be rejected. To help improve registration success rates, reasonable default values can be substituted for missing or malformed data fields.
```json
"defaults" : {
    "city" : "Edmonton",
    "province" : "AB"
}
```
### Password limitations (optional)
Learning Pass can be configured to enforce good password selection, or to guard against local limitations. For example, the ILS may allow a wide variety of characters in passwords, but the web interface to the OPAC may have login restrictions. In such a case Learning Pass can reject accounts that do not conform to password restrictions. Some sites may require the PIN to be a four-digit number, or not contain any special characters. 

Learning Pass uses javascript regular expression syntax consistent with Google's V-8 engine.
```json
"passwords" : {
  "minimum" : 4,
  "maximum" : 125,
  "passwordToPin" : false,
  "regex" : "^[a-zA-Z0-9-!_\\s]{4,125}$"
}
```
In the above example passwords must be a minimum of four characters, maximum of 125, and consist of upper and lower-case letters, numbers, dashes, underscores, exclamation marks, and / or spaces in any combination. Note the use of double-escaped 's' for spaces in JSON. 

The default regex restricts passwords using the following regular expression.
```^[a-zA-Z0-9-!#$@&^,.:;()[\]~^%@*_+=\s]{4,125}$```

### Merged fields (optional)
It may be necessary to merge two or more fields in customer data to make a new value. An example could be city and province. In some Symphony instances they may be concatenated into a single value of 'city, province'. Use the merge dictionary to indicate which fields are to be merged. 
```json
"merge" : {
  "delimiter" : ", ",
  "fields" : {
    "city" : ["city","province"],
    "USER_NAME" : ["lastName","firstName"]
  }
}
```
In the above example, province would be appended to the end of the city value, separated by a comma and space, and replaces the city field. Note in the second example, the last name and first name are appended with a comma and space, then used as the flat field 'USER_NAME' in the final flat file.

### Required fields (required) {#library-required}
A successful registration contains valid data in all the fields marked required. In the following example config, the library specifies that the minimum registration information is first name, last name, barcode, and email.
```json
"required" : [
  "firstName",
  "lastName",
  "barcode",
  "email"
],
```
Missing or malformed data in these fields will cause the account to be rejected with an explanation sent back in the response to the caller.

### Optional fields (optional) {#library-optional}
Optional fields are fields that may or may not be present in the customer data. If they are they are filtered and cleaned like required fields, but unlike required fields missing optional fields do not cause the registration to be rejected.
```json
"optional" : [
  "city",
  "province",
  "phone",
  "gender",
  "dob"
],
```

# Partner organization settings
Each partner has a configuration json file that can be named anything.json. In it are the partner organization's settings, each of which define the agreement of expectations between the library and partner organization.

Many of the dictionaries in the partner.json are similar to the library, and if present supersede the library settings, except for ```"age"```. Age is the only setting where the library setting trumps the partner's. In this way the library can stop anyone under age using the service, but since that can be confusing and lead to complicated rules later, it is not recommended to add an ```"age"``` dictionary to the ```config.json```.

In other cases some settings are only available in the partner.json file. These include ```"typeProfiles"```, ```"genderMap"```, ```"barcodes"```,```"statusMap"```, and ```"notes"```.

```json
{
    "name" : "default",
    "barcodes" : { ... },
    "expiry" : { ... },
    "typeProfiles" : { ... },
    "genderMap": { ... },
    "statusMap" : { ... },
    "age" : { ... },
    "required" : [ ... ],
    "optional" : [ ... ],
    "defaults" : { ... },
    "flatDefaults" : { ... },
    "notes" : { ... }
}
```

## Name (required)
The name of the partner organization. This value is used for reporting and logging, and can be any descriptive string.

## Barcodes (optional)
TODO required or optional
Controls expected values from the customer. A partner want the registrant's barcode to be the employee number or student number. ```minimum``` and ```maximum``` indicate the range of the number of characters in the user's library ID. If the organization has IDs that conflict with other partners' ID, a prefix can be pre-pended to stop each organization over-writing the other's data. 

For example, two companies become partners and register employee number 1234. In this case a prefix can be added to each registration to ensure the IDs do not clash during registration. The ID is further padded with '0' (zeros) to create an ID of ```"maximum"``` characters. In this example the resultant ID is ```21221800001234```.

```json
"barcodes" : {
  "prefix" : "212218",
  "minimum" : 13,
  "maximum" : 14
},
```
```"prefix"``` is required but can be an empty string.
```"minimum"``` required. TODO guard for reasonable values.

## Expiry (optional)
Functions exactly like the library's settings, but supersede those values.

## Type profiles (required)
This dictionary maps types or categories of customers from the partner to a Symphony profile.
```json
"typeProfiles" : {
  "Accounting" : "EPL_ADULT", 
  "ITStaff" : "EPL_JUV",
  "Manager" : "EPL_SPECIAL"
},
```

## Gender map (optional)
Gender is a tricky and complicated metric. Some libraries don't bother collecting this data any more, but some do. If the partner is allowed, willing, and able to supply it, they may have potentially dozens of categories. ```"genderMap"``` translates these data to values meaningful to the ILS (as a USER_CATEGORY usually).

```json
"genderMap": {
  "male" : "M",
  "dude" : "M",
  "female" : "F",
  "dude-et" : "F",
  "none of your business" : "NA",
  "prefers not to say" : "X"
},
```
## Status map (optional)
Very occasionally a partner may provide some status for the registrant that may be useful to the library. The ```"statusMap"``` translates their definition of status to something the library can act on.

```json
"statusMap" : {
  "GOOD" : "OK",
  "SUSPENDED" : "DELINQUENT",
  "FIRED" : "BLOCKED"
},
```
## Age restrictions (optional)
Use this dictionary if the partner stipulates an age restriction for registrations. In the example, the organization wants only people over the age of ```18``` to be able to register. Anyone less than this age is rejected. All dates are computed based on the first second of the date provided.

```json
"age" : {
  "minimum" : 18
},
```

## [Required fields](#library-required) (optional)
Functions exactly like the library's settings, but supersede those values.

## [Optional fields](#library-optional) (optional)
Functions exactly like the library's settings, but supersede those values.

## [Defaults](#library-defaults) (optional)
Functions exactly like the library's settings, but supersede those values.

## [Flat defaults](#library-flat-defaults) (optional)
Functions exactly like the library's settings, but supersede those values.

## Notes (optional)
The notes field in a customer registration can be used for two purposes. 
[x] If the ```"notes"``` dictionary is not included in the partner's configuration settings, any note is added as-is to the account.
[x] If the ```"notes"``` dictionary is used, the ```"require"``` path indicates the location of the plugin that Learning Pass uses to further process the customer account. For example, the plugin could compute a user category, access a street address validation service, or check for a duplicate account. Its only limit is your imagination.

```json
"notes" : { "require" : "../path/to/partner.js" }
```
A template of how to set up this functionality can be found in the project's ```plugin/notes.js``` file.
