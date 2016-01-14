[![Build Status](https://travis-ci.org/dicksont/retoken.svg?branch=master)](https://travis-ci.org/dicksont/retoken)
[![npm version](https://badge.fury.io/js/retoken.svg)](http://badge.fury.io/js/retoken)
[![Bower version](https://badge.fury.io/bo/retoken.svg)](http://badge.fury.io/bo/retoken)

Retoken is a string tokenization library for JavaScript. It provides a Tokenizer class that is based on your standard JavaScript array. This allows us to provide features like:

- **[In-place extraction & storage](#inplace)**
- **[Retraction](#retraction)**

Retoken is also **[cross-platform](#crossplatform)** compatible and has a **[light footprint](#footprint)**.


## Features

### <a name="inplace">In-place Extraction & Storage</a>
Tokens are neatly kept in a single array.

### <a name="retraction">Retraction</a>
Extraction can be undone. State/tokens can be modified & back-tracked.

### <a name="crossplatform">Cross-platform</a>
Should work under various environments including the following:
* Browser script tags
* AMD loaders
* Node.js modules

###  <a name="footprint">Light footprint</a>
1. Single file
2. < 500 lines unminified
3. Single dependency on **[rfline](https://github.com/dicksont/rfline)**

## Installation
### Node
```javascript
npm install retoken
```


## Usage


## API



## License
The MIT License (MIT)

Copyright (c) 2015 Dickson Tam

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
