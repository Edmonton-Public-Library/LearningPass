/**
 * This file index.js, is part of the Learning Pass project.
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
// Dependencies
const http = require('http');
const https = require('https');
const url = require('url');
const StringDecoder = require('string_decoder').StringDecoder;
const config = require('./config');
// Read cert and key
const fs = require('fs');
// Location of the cache database
// @TODO: create cache database of already registered customers.
var _data = require('./lib/data');
var handlers = require('./lib/handlers');


// TESTING
// @TODO: delete when done.
// _data.create('test', 'newFile', {'foo' : 'bar'}, function(err) {
//     console.log('file created, is_err? ',err);
// });

_data.read('test', 'config', function(err, data){
    console.log('read got back: ', err, data);
});

// The http server should respond to all requests with a string.
var httpServer = http.createServer(function(req, res){
    unifiedServer(req, res);
});

// Start the server and listen on port 3000
httpServer.listen(config.httpPort, function() {
    console.log('The server is listening on port '+config.httpPort+', env: ' + config.envName);
});

// The https server.
var httpsServerOptions = {
    // since we want the file to be read before proceeding...
    'key' : fs.readFileSync('./https/key.pem'),
    'cert' : fs.readFileSync('./https/cert.pem')
};

var httpsServer = https.createServer(httpsServerOptions, function(req, res){
    unifiedServer(req, res);
});

// Start the server and listen on port 3000
httpsServer.listen(config.httpsPort, function() {
    console.log('The server is listening on port '+config.httpsPort+', env: ' + config.envName);
});

// Handle creating both http and https servers.
var unifiedServer = function(req, res) {

    // Get url and parse it.
    const baseURL   = 'http://' + req.headers.host + '/';
    // use this instead of parse() which is now deprecated.
    const parsedUrl = new URL(req.url, baseURL);

    // Get the path from the URL.
    var path = parsedUrl.pathname;
    var trimmedPath = path.replace(/^\/+|\/+$/g, '');

    // get the query string as an object.
    // Use search with new URL()
    var queryStringObject = parsedUrl.searchParams;

    // Make sure you are consistent using either uppperCase or lowerCase 'GET' or 'get'.
    // This is part of the HEADER not part of the request itself.
    var method = req.method.toLowerCase();

    // get the headers.
    var headers = req.headers;

    // get the payload (if any)
    var decoder = new StringDecoder('utf-8');
    var buffer = '';
    // on the event called 'data' we want this callback
    // to handle the event that was emitted.
    req.on('data', function(data){
        buffer += decoder.write(data);
    });

    req.on('end', function(){
        buffer += decoder.end();
        // choose the handler to route to.
        var chooseHandler = typeof(router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notFound;
        // if one is not found use notFound handler.
        var data = {
            'trimmedPath' : trimmedPath,
            'queryStringObject' : queryStringObject,
            'method' : method,
            'headers' : headers,
            'payload' : buffer
        };

        chooseHandler(data, function(statusCode, payload){
            // use the status defined by the handler or default to 200
            statusCode = typeof(statusCode) == 'number' ? statusCode : 200;
            // use the payload defined by the handler, or default to an empty object
            
            payload = typeof(payload) == 'object' ? payload : {};
            // convert the payload from an object to a string.
            payloadString = JSON.stringify(payload);
            // return the response
            // Let the user know we are returning JSON
            res.setHeader('Content-type', 'application/json');
            res.writeHead(statusCode);
            res.end(payloadString);

            // Log out status code, payload.
            console.log("log: ", statusCode, payloadString);
        });
    });
};

// defininition of a request router.
var router = {
    'sample' : handlers.sample,
    'ping' : handlers.ping
};