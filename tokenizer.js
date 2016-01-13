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

  /* FUNC getCore
   * Returns as a string the core of the regex powering this tokenizer.
   */
  function getCore(regex) {
    if (regex instanceof RegExp) {
      return regex.source.replace('/^\^/', '').replace('/\$$/', '');
    } else {
      return regex.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
    }
  }

  /* FUNC HeadSplitter & TailSplitter
   * These higher-order functions return functions that do NOT actually split
   * the string. Instead, these resulting functions determine what is actually
   * split from the string.
   */


  function HeadSplitter(reDelimiter, separateDelimiter) {
    var regex = new RegExp('^(.*?)(' + getCore(reDelimiter) + ')(.*)$');
    separateDelimiter = (separateDelimiter != null)? separateDelimiter : true;

    return function(str, incorporateDelimiter) {
      var matches = str.match(regex);

      if (!matches)
        return null;

      var token = matches[1];
      var delimiter = matches[2];
      var rest = matches[matches.length - 1];

      if (incorporateDelimiter) {
        if (token.length > 0) {
          rest = delimiter + rest;
        } else {
          token = token + delimiter;
        }
        delimiter = '';
      }

      return {
        delimiter: delimiter,
        token: token,
        rest: rest
      }
    }
  }

  function TailSplitter(reDelimiter) {
    var regex = new RegExp('^(.*)(' + getCore(reDelimiter) + ')(.*?)$');
    separateDelimiter = (separateDelimiter != null)? separateDelimiter : true;

    return function(str, incorporateDelimiter) {
      var matches = str.match(regex);

      if (!matches)
        return null;

      var delimiter = matches[2];
      var token = matches[matches.length - 1];
      var rest = matches[1];

      if (incorporateDelimiter) {
        if (token.length > 0) {
          rest = rest + delimiter;
        } else {
          token = delimiter + token;
        }

        delimiter = '';
      }

      return {
        delimiter: delimiter,
        token: token,
        rest: rest
      }
    }
  }



  /* FUNC HeadExtender & TailExtender
   * These are higher-order functions that manage the extraction of tokens.
   */

  function TailExtender(tokenizer) {

    return function(token, delimiter, rest) {
      var tail = tokenizer.length - 1;

      tokenizer.delimiters[tail] = delimiter;
      tokenizer[tail] = token;
      tokenizer[tail + 1] = rest;
    }
  }

  function HeadExtender(tokenizer) {

    return function(token, delimiter, rest) {
      tokenizer.delimiters.push(delimiter);
      Array.prototype.splice.call(tokenizer, 1, 0, token);
      tokenizer[0] = rest;
    }

  }

  /* FUNC HeadCombiner & TailCombiner
   * These are higher-order functions that manage the retraction of tokens.
   */

  function HeadCombiner(tokenizer) {
    return function() {

      if (typeof(tokenizer.delimiters[0]) != 'string')
        throw new Error('retoken: Tried to retract a delimiter that is not a string');

      if (typeof(tokenizer[1]) != 'string')
        throw new Error('retoken: Tried to retract a token that is not a string');

      tokenizer[1] = tokenizer[0] + tokenizer.delimiters[0] + tokenizer[1];
      tokenizer.shift();
    }
  }

  function TailCombiner(tokenizer) {
    return function() {

      if (typeof(tokenizer[tokenizer.length - 2]) != 'string')
        throw new Error('retoken: Tried to retract a token that is not a string');

      if (typeof(tokenizer.delimiters[tokenizer.delimiters.length - 1]) != 'string')
        throw new Error('retoken: Tried to retract a delimiter that is not a string');

      tokenizer[tokenizer.length - 2] +=  tokenizer.delimiters[tokenizer.delimiters.length - 1] + tokenizer[tokenizer.length - 1];
      tokenizer.pop();
    }
  }

  /* FUNC Tokenizer
   * PARAM reDelimiter - Regular expression that will be used for the tokenization
   * PARAM opts - Object used to control the tokenization
   *    .separateDelimiter  - Set to false if the delimiter should be included in the token. (true)
   *    .reverse - By default, the string is tokenized on the left side. Set to true if
   *               otherwise. (false)
   *
   * Constructs the tokenizer.
   *
   */

  function Tokenizer(reDelimiter, opts) {
    var tk = [ ];
    tk.__proto__ = Tokenizer.prototype;

    opts = opts || {};
    tk.separateDelimiter = (opts.separateDelimiter != null)? !!opts.separateDelimiter : true;
    tk.delimiters = [];
    tk.extractionLevel = 0;
    tk.reverse = opts.reverse || false;

    /*
     * These point to different functions handling extraction and retraction, depending
     * on orientation.
     */

    tk.split = tk.reverse? TailSplitter(reDelimiter) : HeadSplitter(reDelimiter);
    tk.extend = tk.reverse? HeadExtender(tk) : TailExtender(tk);
    tk.combine = tk.reverse? HeadCombiner(tk) : TailCombiner(tk);

    tk.delimiterOffset = tk.reverse? -1 : 0;


    return tk;
  }

  Tokenizer.prototype.__proto__ = Array.prototype

  /* PROP .origin
   * Returns the position of the string used to generate the tokens.
   */
  Object.defineProperty(Tokenizer.prototype, 'origin', {
    get: function() {
      return this.reverse? 0 : this.length - 1;
    },
    enumerable: true
  });

  /* PROP .tap
   * Get/set the token closest to the origin that is not the origin.
   */

  Object.defineProperty(Tokenizer.prototype, 'tap', {
    get: function() {

      if (this.length < 2)
        return null;


      return this.reverse? this[1] : this[this.length - 2];
    },
    set: function(token) {

      if (this.length < 2)
        return;

      if (this.reverse) {
        this[1] = token
      } else {
        this[this.length - 2] = token;
      }

    },
    enumerable: true
  });


  /*
   * PROP .head
   * Get/set the element at the beginning of the tokenizer.
   */
  Object.defineProperty(Tokenizer.prototype, 'head', {
    get: function() { return this[0]; },
    set: function(token) { this[0] = token; },
    enumerable: true
  })

  /*
   * PROP .tail
   * Get/set the element at the end of the tokenizer.
   */
  Object.defineProperty(Tokenizer.prototype, 'tail', {
    get: function() { return this[this.length - 1]; },
    set: function(token) { this[this.length - 1] = token; },
    enumerable: true
  })


  /* FUNC extract
   * Extracts a token from the origin.
   */
  Tokenizer.prototype.extract = function(times) {
    var self = this;

    times = times || 1;

    if (this.length < 1)
      return this;

    var parts = this.split(this[this.origin], !this.separateDelimiter);
    if (!parts) return this;

    this.lastDelimiterExtracted = parts.delimiter;
    this.extend(parts.token, parts.delimiter, parts.rest);

    this.extractionLevel++;

    return (times > 1)? this.extract(times - 1) : this;
  }

  /* FUNC finished
   * Returns:
   *    - true if no more tokens can be extracted.
   *    - false if otherwise
   */

  Tokenizer.prototype.finished = function() {

    /* Tokenization is finished when we cannot split any further */
    return !this.split(this[this.origin], !this.separateDelimiter);
  }

  /* FUNC extractAll
   * Extracts all tokens from the origin.
   */

  Tokenizer.prototype.extractAll = function() {
    var plength = 0;
    while (plength != this.length) {
      plength = this.length;
      this.extract();
    }

    return this;
  }

  /* FUNC replaceAll
   * Replaces all matching tokens with the replacement.
   *
   */

  Tokenizer.prototype.replaceAll = function(token, replacement) {
    for (var i=0; i < this.length; i++) {
      if (token == this[i])
        this[i] = replacement;
    }
  }

  /* FUNC retract
   * Absorbs neighboring token back into the origin. Can be used to undo a
   * token extraction
   */

  Tokenizer.prototype.retract = function(times) {
    times = times || 1;
    if (this.length < 2) return this;

    var delimiter = this.delimiters[this.delimiters.length - 1] || '';

    this.combine();
    this.extractionLevel--;

    return (times > 1)? this.retract(times - 1) : this;
  }

  /* FUNC retractAll
   * Absorbs all tokens back into the origin. Can be used to undo all token
   * extractions
   *
   */

  Tokenizer.prototype.retractAll = function() {
    var plength = 0;
    while (plength != this.length) {
      plength = this.length;
      this.retract();
    }

    return this;
  }

  function TOKENIZER_OVERRIDE_NOT_IMPLEMENTED(fxname) {
    Tokenizer.prototype[fxname] = function() {
      throw new Error('retoken: Function ' + fxname + ' not implemented in tokenizer');
    }
  }

  /* These array operations can be problematic, so we will block them until they
   * become necessary and we have figured how to handle them.
   */

  TOKENIZER_OVERRIDE_NOT_IMPLEMENTED('reverse');
  TOKENIZER_OVERRIDE_NOT_IMPLEMENTED('splice');
  TOKENIZER_OVERRIDE_NOT_IMPLEMENTED('sort');

  Tokenizer.prototype.deleteToken = function(position) {
    Array.prototype.splice.call(this,position, 1);
    this.delimiters.splice(position + this.delimiterOffset, 1);
  }

  /*
   * FUNC insertToken
   * Inserts a token and its delimiter at a specific position in the tokenizer.
   */
  Tokenizer.prototype.insertToken = function(position, token, delimiter) {

    if (typeof(token) != 'string')
      throw new Error('retoken: Token is not a string: ' + token);

    Array.prototype.splice.call(this, position, 0, token);

    if (this.length < 1) return this;

    if (delimiter != null && typeof(delimiter) != 'string')
      throw new Error('retoken: Delimiter is not a string: ' + delimiter);

    delimiter = delimiter || ''
    this.delimiters.splice(position + this.delimiterOffset, 0, delimiter);

    return this;
  }

  /*
   * FUNC subtokenize
   * When fully implemented, this will handle nested tokenizations.
   *
   */
  Tokenizer.prototype.subtokenize = function(tkParent, position) {
    if (!(tkParent instanceof Tokenizer))
      throw new Error('retoken: tkParent is not a Tokenizer: ' + tkParent);

    try {

      if (this.reverse) {
        this.shift(tkParent[position]);
      } else {
        this.push(tkParent[position]);
      }

      tkParent[position] = this;
    } catch (err) {
      throw new Error('retoken: Failed to access position ' + position + ' at parent tokenizer ' + tkParent);
    }

    return this;
  }

  /*
   * FUNC push
   * Adds a token and its delimiter to the end of the tokenizer.
   */

  Tokenizer.prototype.push = function(str, delimiter) {
    Array.prototype.push.call(this, str);

    if (this.length > 1) this.delimiters.push(delimiter || '');

    return this;
  }

  /*
   * FUNC unshift
   * Adds a token and its delimiter to the beginning of the tokenizer.
   */

  Tokenizer.prototype.unshift = function(str, delimiter) {
    Array.prototype.unshift.call(this, str);
    this.delimiters.unshift(delimiter || '');

    return this;
  }


  /*
   * FUNC shift
   * Removes a token from the beginning of the tokenizer. The corresponding
   * delimiter is removed as well.
   */

  Tokenizer.prototype.shift = function() {
    var elem = Array.prototype.shift.call(this);
    this.delimiters.shift();

    return elem;
  }

  /*
   * FUNC pop
   * Removes a token from the end of the tokenizer. The corresponding
   * delimiter is removed as well.
   */

  Tokenizer.prototype.pop = function() {
    var elem = Array.prototype.pop.call(this);
    this.delimiters.pop();
    return elem;
  }

  /*
   * FUNC toArray
   * Returns an array whose elements match that of the tokenizer.
   */
  Tokenizer.prototype.toArray = function() {
    var arr = new Array(this.length);

    for(var i=0; i < this.length; i++) {
      arr[i] = this[i];
    }

    return arr;
  }






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
