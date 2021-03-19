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
.PHONY: test run customer all util helpers config date flat prod response handlers

handlers:
	clear
	node test.js ./tests/handlers-tests.js

response: test.js ./tests/response-tests.js
	clear
	node test.js ./tests/response-tests.js

customer:
	clear
	node test.js ./tests/customer-tests.js

prod:
	clear
	NODE_ENV=production node test.js ./tests/configprod-tests.js
	
config:
	clear
	node test.js ./tests/config-tests.js

test:
	clear
	node test.js ./tests/helpers-tests.js 
	node test.js ./tests/config-tests.js
	node test.js ./tests/customer-tests.js
	node test.js ./tests/barcodes-tests.js
	node test.js ./tests/util-tests.js
	node test.js ./tests/date-tests.js
	node test.js ./tests/flat-tests.js
	node test.js ./tests/response-tests.js
	node test.js ./tests/handlers-tests.js

util:
	clear
	node test.js ./tests/util-tests.js
helpers:
	clear
	node test.js ./tests/helpers-tests.js 
date:
	clear
	node test.js ./tests/date-tests.js
flat:
	clear
	node test.js ./tests/flat-tests.js
run:
	clear
	node index
