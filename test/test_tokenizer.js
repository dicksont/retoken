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

(function(factory) {

  if (typeof module !== 'undefined' && module && module.exports) {
    factory(require('assert'), require('../tokenizer.js'));
  } else if (typeof define === 'function' && define.amd) { // Require.js & AMD

    define([ 'chai', 'retoken'], function(chai, retoken) {
      factory(chai.assert, retoken);
    });

  } else {
    factory(window.assert, window.retoken);
    mocha.checkLeaks();
    mocha.run();
  }

})(function(assert, tokenizer) {

  var delimiters = [
    /\s+/,
    '.'
  ];
  var strings = [
    'The quick brown fox jumped over the lazy dog',
    '172.168.120.2'
  ];

  function test(delimiter, str) {

    describe('tokenizer(' + delimiter + ')', function() {

      var tk = tokenizer(delimiter);

      it ('should create a tokenizer with length 0', function() {
        assert.equal(tk.length, 0);
      })

      describe('.push(' + str + ')', function() {

        it ('should add the string to the tokenizer', function() {
          var tk = tokenizer(delimiter).push(str);

          assert.equal(tk.length, 1);
          assert.equal(tk[0], str);
        })

      })

      describe('.extract', function() {

        it('should extract a token', function() {
          var tk = tokenizer(delimiter).push(str).extract();

          assert.equal(tk.length, 2);

          var separator = (delimiter instanceof RegExp)? str.match(delimiter)[0] : delimiter;
          assert.equal(tk[0] + separator + tk[1], str);
          assert.ok(tk[0].length > 0);
        })
      })

      describe('.retract', function() {

        it('should retract the token', function() {
          var tk = tokenizer(delimiter).push(str).extract().retract();

          assert.equal(tk.length, 1);
          assert.equal(tk[0], str);
        })
      })

      describe('.counter', function() {
        it('should equal zero at construction', function() {
          var tk = tokenizer(delimiter);

          assert.equal(tk.counter, 0);
        });

        it('should not change with push', function() {
          var tk = tokenizer(delimiter);
          assert.equal(tk.counter, 0);
          tk.push(str);
          assert.equal(tk.counter, 0);
        });

        it('should not change with shift', function() {
          var tk = tokenizer(delimiter);
          assert.equal(tk.counter, 0);
          tk.shift(str);
          assert.equal(tk.counter, 0);
        });

        it('should increment by one with token extraction', function() {
          var tk = tokenizer(delimiter).push(str).extract();
          assert.equal(tk.counter, 1);
        });

        it('should decrease by one with token retraction', function() {
          var tk = tokenizer(delimiter).push(str).extract();
          assert.equal(tk.counter, 1);
          tk.retract();
          assert.equal(tk.counter, 0);
        });
      });
    })
  }

  for(var i=0; i < delimiters.length; i++) {
    test(delimiters[i], strings[i]);
  }
});
