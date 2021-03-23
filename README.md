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
Copyright 2021 Andrew Nisbet

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
* Allow orgnaizations that partner with a library to create library accounts on behalf of that partner.
* Scale to allow multiple organizations to use the same web service.
* Allow different business rules for different organizations. For example, age restrictions, or expiry dates can be managed independantly. 

# Project History
The Learning Pass is a re-write of the University of Albert's L-Pass. The move to Learning Pass was prompted by Edmonton Public Library moving off of University servers, offering an opportunity to moderize this business system.

# Overview
The Learning Pass is an application that is written in pure node.js. There are no npm dependencies to install.

## HTTP and HTTPS
The server can run with either http or https. If https is desired, ensure SSL key and certificate are installed correctly, and up-to-date.

### Certificates
Set the 
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

@TODO: Setup
