# Learning Pass

### TODO list
* Handle customer status.
* Complete PIN helper.
* Manage expiry.
* Manage customer's preferred branch.
* Stub notes.js for future dev if required.
* Implement issuing library cards in barcodes section.
* Create flat file of customer data.
* Server
    * Upload library card list if admin.
    * New route to show available branches.
* Use Map and Set.

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

## Standard Directory Structure
I have followed a directory structure recommended by those that teach node.js, but have opted to add directories for mutable data so the project can be dockerized.

* The .data directory is where the application has a simple database.
* The https directory is where Learning Pass looks for the certificate and key to run Learning Pass with SSL and HTTPS.

@TODO: This is now moved to google drive. Copy it back when finished.
 
