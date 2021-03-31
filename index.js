#!/usr/bin/env node
/**
 * This file index.js, is part of the Learning Pass project.
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
// Dependencies
const http = require('http');
const https = require('https');
const StringDecoder = require('string_decoder').StringDecoder;
const config = require('./config');
// Read cert and key
const fs = require('fs');
const handlers = require('./lib/handlers');
const logger = require('./logger');


// The http server should respond to all requests with a string.
const httpServer = http.createServer(function(req, res){
    unifiedServer(req, res);
});

// Start the server and listen on port 3000
httpServer.listen(config.getHttpPort(), function() {
    logger.info('The server is listening on HTTP port '+config.getHttpPort()+', env: ' + config.getEnvName());
});

// The https server.
const httpsServerOptions = {
    // since we want the file to be read before proceeding...
    // 'key' : fs.readFileSync('./https/key.pem'),
    // 'cert' : fs.readFileSync('./https/cert.pem')
    'key' : fs.readFileSync(config.getSSLKey()),
    'cert' : fs.readFileSync(config.getSSLCertificate())
};

const httpsServer = https.createServer(httpsServerOptions, function(req, res){
    unifiedServer(req, res);
});

// Start the server and listen on port 3000
httpsServer.listen(config.getHttpsPort(), function() {
    logger.info('The server is listening on HTTPS port '+config.getHttpsPort()+', env: ' + config.getEnvName());
});

// Handle creating both http and https servers.
const unifiedServer = function(req, res) {

    // Get url and parse it.
    const baseURL   = 'http://' + req.headers.host + '/';
    // use this instead of parse() which is now deprecated.
    const parsedUrl = new URL(req.url, baseURL);

    // Get the path from the URL.
    let path = parsedUrl.pathname;
    let trimmedPath = path.replace(/^\/+|\/+$/g, '');

    // get the query string as an object.
    // Use search with new URL()
    let queryStringObject = parsedUrl.searchParams;

    // Make sure you are consistent using either uppperCase or lowerCase 'GET' or 'get'.
    // This is part of the HEADER not part of the request itself.
    let method = req.method.toLowerCase();

    // get the headers.
    let headers = req.headers;

    // get the payload (if any)
    let decoder = new StringDecoder('utf-8');
    let buffer = '';
    // on the event called 'data' we want this callback
    // to handle the event that was emitted.
    req.on('data', function(data){
        buffer += decoder.write(data);
    });

    req.on('end', function(){
        buffer += decoder.end();
        // choose the handler to route to.
        let chooseHandler = typeof(router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notFound;
        // if one is not found use notFound handler.
        let data = {
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
            let payloadString = JSON.stringify(payload);
            // return the response
            // Let the user know we are returning JSON
            res.setHeader('Content-type', 'application/json');
            res.writeHead(statusCode);
            res.end(payloadString);
        });
    });
};

// defininition of a request router.
const router = {
    'register' : handlers.register,
    'status' : handlers.status,
    'version' : handlers.version
};