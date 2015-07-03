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

  var regexes = [ /\s+/ ];
  var strings = [
    'The quick brown fox jumped over the lazy dog'
  ];

  function test(regex) {

    describe('tokenizer(' + regex + ')', function() {

      var tk = tokenizer(regex);

      it ('should create a tokenizer with length 0', function() {
        assert.equal(tk.length, 0);
      })


      strings.map(function(str) {
        describe('.push(' + str + ')', function() {

          it ('should add the string to the tokenizer', function() {
            var tk = tokenizer(regex).push(str);

            assert.equal(tk.length, 1);
            assert.equal(tk[0], str);
          })

        })

        describe('.extract', function() {

          it('should create a token', function() {
            var tk = tokenizer(regex).push(str).extract();

            assert.equal(tk.length, 2);
            var match = str.match(regex);
            assert.equal(tk[0] + match[0] + tk[1], str);
          })
        })

        describe('.retract', function() {

          it('should retract the token', function() {
            var tk = tokenizer(regex).push(str).extract().retract();

            assert.equal(tk.length, 1);
            assert.equal(tk[0], str);
          })
        })

      })
    })
  }

  for(var i=0; i < regexes.length; i++) {
    test(regexes[i]);
  }
});
