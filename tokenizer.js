/*
 * Copyright (c) 2015 Dickson Tam
 *
 * Permission is hereby granted, free of charge, to any person
 * obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without
 * restriction, including without limitation the rights to use,
 * copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following
 * conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 *
 */



(function() {

  function Tokenizer(delimiter, opts) {
    var instance = [ ];

    instance.__proto__ = Tokenizer.prototype;

    instance.opts = opts || {};
    instance.delimiters = [];
    instance.extractionLevel = 0;

    var reCore;

    if (delimiter instanceof RegExp) {
      reCore = delimiter.source.replace('/^\^/', '').replace('/\$$/', '');
    } else {
      reCore = delimiter.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
    }

    Object.defineProperty(instance, 'regex', {
      value: new RegExp('^(.*?)(' + reCore + ')(.*)$'),
      enumerable: true
    });

    return instance;
  }

  Tokenizer.prototype.__proto__ = Array.prototype

  Tokenizer.prototype.extract = function(times) {
    times = times || 1;

    if (this.length < 1)  return this;

    var matches = this[this.length - 1].match(this.regex);
    var newToken, rest;

    if (matches) {
      if (this.opts.incorporateDelimiter) {
        if (matches[1].length > 0) {
          newToken = matches[1];
          rest = matches[2] + matches[matches.length - 1];
        } else {
          newToken = matches[1] + matches[2];
          rest = matches[matches.length - 1];
        }
        this.delimiters.push('');
      } else {
        newToken = matches[1];
        this.delimiters.push(matches[2]);
        rest = matches[3];
      }
      this.lastDelimiterExtracted = matches[2];
      this[this.length - 1] = newToken;
      this[this.length] = rest;
      this.extractionLevel++;
    }


    return (times > 1)? this.extract(times - 1) : this;
  }

  Tokenizer.prototype.extractAll = function() {
    var plength = 0;
    while (plength != this.length) {
      plength = this.length;
      this.extract();
    }

    return this;
  }


  Tokenizer.prototype.retract = function(times) {
    times = times || 1;
    if (this.length < 2) return;

    var delimiter = this.delimiters[this.delimiters.length - 1] || '';

    if (typeof(this[this.length - 2]) != 'string' || typeof(this[this.length - 1]) != 'string')
      throw new Error('retoken: Tried to retract a token that is not a string');

    if (typeof(delimiter) != 'string')
      throw new Error('retoken: Tried to retract a delimiter that is not a string');

    this[this.length - 2] += delimiter + this[this.length - 1];
    this.pop();
    this.extractionLevel--;

    return (times > 1)? this.retract(times - 1) : this;
  }


  Tokenizer.prototype.replaceToken = function(token, replacement) {
     var index = this.indexOf(token);
     if (!~index) return this;

     this[index] = replacement;

     return this;
  }

  function TOKENIZER_OVERRIDE_NOT_IMPLEMENTED(fxname) {
    Tokenizer.prototype[fxname] = function() {
      throw new Error('retoken: Function ' + fxname + ' not yet implemented in tokenizer');
    }
  }

  Tokenizer.prototype.reverse = function() {
    Array.prototype.reverse.call(this);
    this.delimiters.reverse();
    return this;
  }


  TOKENIZER_OVERRIDE_NOT_IMPLEMENTED('splice');
  TOKENIZER_OVERRIDE_NOT_IMPLEMENTED('sort');

  Tokenizer.prototype.insertToken = function(index, token, delimiter) {
    if (typeof(token) != 'string')
      throw new Error('retoken: Second argument [token] is not a string: ' + token);

    if (delimiter != null && typeof(delimiter) != 'string')
      throw new Error('retoken: Third argument [delimiter] is not a string: ' + delimiter);

    Array.prototype.splice.call(this, index, 0, token);

    if (this.length > 1) {
      delimiter = delimiter || ''
      this.delimiters.splice(index, 0, delimiter);
    }

    return this;
  }

  Tokenizer.prototype.push = function(str, delimiter) {
    Array.prototype.push.call(this, str);

    if (this.length > 1) this.delimiters.push(delimiter || '');

    return this;
  }

  Tokenizer.prototype.unshift = function(str, delimiter) {
    Array.prototype.unshift.call(this, str);
    this.delimiters.unshift(delimiter || '');
    return this;
  }

  Tokenizer.prototype.shift = function() {
    var elem = Array.prototype.shift.call(this);
    this.delimiters.shift();
    return elem;
  }

  Tokenizer.prototype.pop = function() {
    var elem = Array.prototype.pop.call(this);
    this.delimiters.pop();
    return elem;
  }

  Tokenizer.prototype.toArray = function() {
    var arr = new Array(this.length);

    for(var i=0; i < this.length; i++) {
      arr[i] = this[i];
    }

    return arr;
  }

  Object.defineProperty(Tokenizer.prototype, 'head', {
    get: function() { return this[0]; },
    set: function(token) { this[0] = token; },
    enumerable: true
  })

  Object.defineProperty(Tokenizer.prototype, 'tail', {
    get: function() { return this[this.length - 1]; },
    set: function(token) { this[this.length - 1] = token; },
    enumerable: true
  })


  if (typeof module !== 'undefined' && module && module.exports) { // Node.js & CommonJS
    module.exports = Tokenizer;
  } else if (typeof define === 'function' && define.amd) {
    define('retoken', [], function() {
      return Tokenizer;
    });
  } else { // Browser
    window.retoken = Tokenizer;
  }

})();
