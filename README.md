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
    * Upload library card list if admin.
    * New route to show available branches.

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
  "pin": "IlikeBread!",
  "type": "STUDENT",
  "expiry": "20210822",
  "branch": "",
  "status": "OK",
  "notes": "Grad student"
}
```

The example above include a complete set of fields, but the library can control which fields are required and those that are optional.

## Required fields
An account is created if the customer data contains all the fields the library and / or partner organization have decided are required.

## Optional fields
If an optional field is present the data is included in the registration. If a field is not indicated as required or optional is ignored.

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
  "key" : "parnters_api_key",
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
  "expiry" : { 
      "date" : "NEVER"
  },
  "branch" : {
      "default" : "EPLMNA",
      "valid" : ["EPLMNA","EPLWMC","EPLCAL","EPLJPL",
          "EPLCPL","EPLSTR","EPLWOO","EPLHIG","EPLCSD",
          "EPLMCN","EPLLON","EPLRIV","EPLWHP","EPLMEA",
          "EPLIDY","EPLMLW","EPLWMC","EPLCPL","EPLABB"
      ]},
  "flatDefaults" : {
      "USER_CATEGORY5" : "ECONSENT",
      "USER_ACCESS" : "PUBLIC",
      "USER_ENVIRONMENT" : "PUBLIC",
      "USER_MAILINGADDR" : 1,
      "NOTIFY_VIA" : "PHONE",
      "RETRNMAIL" : "YES"
  },
  "defaults" : {
      "city" : "Edmonton",
      "province" : "AB"
  },
  "required" : [
      "firstName",
      "lastName",
      "email"
  ],
  "optional" : [
      "city",
      "province",
      "phone",
      "dob"
  ],
  "merge" : {
      "delimiter" : ", ",
      "fields" : {
          "city" : ["city","province"],
          "USER_NAME" : ["lastName","firstName"]
      }
  },
  "passwords" : {
      "minimum" : 4,
      "maximum" : 125,
      "passwordToPin" : false,
      "regex" : "^[a-zA-Z0-9-!_\\s]{4,125}$"
  }
}
```
### Library
Name of the library implementing Learning Pass.
```json
"library" : "Edmonton Public Library",
```

### Expiry
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


## Partner organization settings
Each partner has a configuration json file that can be named anything.json. In it are the partner organization's settings, each of which are explained below.
