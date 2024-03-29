#
# This Makefile manages Learning Pass testing and starting from the
# command line.
# 
# Copyright 2021 Andrew Nisbet, Edmonton Public Library
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
#
.PHONY: test run customer all util helpers config date flat prod response handlers passwords
passwords:
	clear
	node ./tests/test.js ./password-tests.js

barcodes:
	clear
	node ./tests/test.js ./barcodes-tests.js
	
helpers:
	clear
	node ./tests/test.js ./helpers-tests.js

handlers:
	clear
	node ./tests/test.js ./handlers-tests.js

response:
	clear
	node ./tests/test.js ./response-tests.js

customer:
	clear
	node --trace-warnings ./tests/test.js ./customer-tests.js

prod:
	clear
	NODE_ENV=production node ./tests/test.js ./configprod-tests.js
	
config:
	clear
	node ./tests/test.js ./config-tests.js

test:
	clear
	node ./tests/test.js ./helpers-tests.js 
	node ./tests/test.js ./config-tests.js
	node ./tests/test.js ./customer-tests.js
	node ./tests/test.js ./barcodes-tests.js
	node ./tests/test.js ./util-tests.js
	node ./tests/test.js ./date-tests.js
	### Commented out to stop sperious account creation during testing other library functions.
	node ./tests/test.js ./flat-tests.js
	node ./tests/test.js ./response-tests.js
	node ./tests/test.js ./handlers-tests.js

util:
	clear
	node ./tests/test.js ./util-tests.js
helpers:
	clear
	node ./tests/test.js ./helpers-tests.js 
date:
	clear
	node ./tests/test.js ./date-tests.js
flat:
	clear
	node ./tests/test.js ./flat-tests.js
note:
	clear
	node ./tests/test.js ../plugin/neos-tests.js
	node ./tests/test.js ../plugin/kic-tests.js
run:
	clear
	NODE_ENV=staging node index
