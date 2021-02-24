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

// Testing framework for Learning Pass.
// `tests` is a singleton variable that will contain all our tests
let tests = [];


// The test function accepts a name and a function
function test(name, fn) {
	// it pushes the name and function as an object to
	// the `tests` array
	tests.push({ name, fn });
}

function run() {
	// `run` runs all the tests in the `tests` array
	tests.forEach(t => {
		// For each test, we try to execute the
		// provided function. 
		try {
			t.fn();
			// If there is no exception
			// that means it ran correctly
			console.log('✅', t.name);
		} catch (e) {
			// Exceptions, if any, are caught
			// and the test is considered failed
			console.log('❌', t.name);
			// log the stack of the error
			console.log(e.stack);
		}
	});
}

// Get the list of files from the command line
// arguments
const files = process.argv.slice(2);

// expose the test function as a global variable
global.test = test;

// Load each file using `require`
files.forEach(file => {
	// Once a file is loaded, it's tests are
	// added to the `tests` singleton variable
	require(file)
});

// Now that all the tests from all the files are
// added, run them one after the other
run();

