[![Build Status](https://travis-ci.org/dicksont/retoken.svg?branch=master)](https://travis-ci.org/dicksont/retoken)
[![npm version](https://badge.fury.io/js/retoken.svg)](http://badge.fury.io/js/retoken)
[![Bower version](https://badge.fury.io/bo/retoken.svg)](http://badge.fury.io/bo/retoken)

Retoken is a string tokenization library for JavaScript. It provides a Tokenizer class that is based on your standard JavaScript array. This facilitates features like:

- **[In-place extraction & storage](#inplace)**
- **[Retraction](#retraction)**

Retoken is also **[cross-platform](#crossplatform)** compatible and has a **[light footprint](#footprint)**.


## Installation
You can install retoken with either NPM or bower:

### Install with NPM on Node
```javascript
npm install retoken
```

### Install with Bower
```javascript
bower install retoken
```


## Features

### <a name="inplace">In-place Extraction & Storage</a>
Because the retoken Tokenizer class is subclassed directly from an array, tokenization occurs within the context of an array. Extracted tokens are essentially elements of the array, and can be manipulated as such.

Here we demonstrate how to extract words from a sentence:

```javascript
var retoken = require('retoken');

// Construct a tokenizer that splits on the space character
var tokenizer = retoken(' ');

// Insert our test string into the tokenizer
tokenizer.push('The quick brown fox jumped over the lazy dog')

// Nicely inspect the tokenizer
console.log(tokenizer.toArray())
// [ 'The quick brown fox jumped over the lazy dog' ]

// Extract our first token
tokenizer.extract()

// Nicely inspect the tokenizer
console.log(tokenizer.toArray())
// [ 'The', 'quick brown fox jumped over the lazy dog' ]

```

### <a name="retraction">Retraction</a>
Tokens can be re-incorporated back into the untokenized string via a process
we call retraction. Retraction can be used to undo extraction.

Continuing from our previous example, we can undo the extractions and reconstruct
the original sentence.

```javascript

// Nicely inspect the tokenizer
console.log(tokenizer.toArray())
// [ 'The', 'quick brown fox jumped over the lazy dog' ]

// Retract a token
tokenizer.retract()

// Nicely inspect the tokenizer
console.log(tokenizer.toArray())
// [ 'The quick brown fox jumped over the lazy dog' ]

```

Retraction works, because we keep track of delimiters as we extract tokens.



### <a name="crossplatform">Cross-platform</a>
This library should work under various environments including the following:
* Browser script tags
* AMD loaders
* Node.js modules

###  <a name="footprint">Light footprint</a>
Retoken is relatively light. It is:

1. Single file,
2. < 500 lines unminified,
3. Free from runtime dependencies



## Access
Retoken exposes a few properties to facilitate access to tokens within the tokenizer:

### .head
Use this property to get/set the element at index 0 within the tokenizer.

```javascript
// Nicely inspect the tokenizer
console.log(tokenizer.toArray())    
// [ 'The', 'quick brown fox jumped over the lazy dog' ]

// Output the element at index 0
console.log(tokenizer[0])           
// The

// Output the element at index 0 with the .head property
console.log(tokenizer.head)         
// The


```

### .tail
Use this property to get/set the element at the last index within the tokenizer.


```javascript
// Nicely inspect the tokenizer
console.log(tokenizer.toArray())
// [ 'The', 'quick brown fox jumped over the lazy dog' ]

// Output the element at the last index
console.log(tokenizer[tokenizer.length - 1])
// quick brown fox jumped over the lazy dog

// Output the element at the last index w/ the .tail property
console.log(tokenizer.tail)
// quick brown fox jumped over the lazy dog

```


### .origin
Use this property to get/set the untokenized string.

```javascript
// Nicely inspect the tokenizer
console.log(tokenizer.toArray())
// [ 'The', 'quick brown fox jumped over the lazy dog' ]

// Output the position of the untokenized string
console.log(tokenizer.origin)
// quick brown fox jumped over the lazy dog

```

### .originIndex
Use this property to get the position of untokenized string.


```javascript
// Nicely inspect the tokenizer
console.log(tokenizer.toArray())
// [ 'The', 'quick brown fox jumped over the lazy dog' ]

// Output the position of the untokenized string
console.log(tokenizer.originIndex)
// 1

```


### .tap
Use this property to get/set token closest to the origin.


```javascript
// Nicely inspect the tokenizer
console.log(tokenizer.toArray())
// [ 'The', 'quick brown fox jumped over the lazy dog' ]

// Output the token closest to the origin
console.log(tokenizer.tap)
// The

```


## Usage
The following examples illustrates how retoken can be used:


### Word Splitting
This example shows how to split words from a sentence:

```javascript
var retoken = require('retoken');

// Construct a tokenizer that splits on the space character
var tokenizer = retoken(' ');

// Insert our test string into the tokenizer
tokenizer.push('The quick brown fox jumped over the lazy dog')

// Nicely inspect the tokenizer
console.log(tokenizer.toArray()) // [ 'The quick brown fox jumped over the lazy dog' ]

// Extract our first token
tokenizer.extract()

// Nicely inspect the tokenizer
console.log(tokenizer.toArray()) // [ 'The', 'quick brown fox jumped over the lazy dog' ]

```


## API

### Import Library on Node

```javascript
var retoken = require('retoken');

```



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
