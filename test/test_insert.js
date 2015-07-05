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

   describe('--', function() {
     describe('.insertToken', function() {
       it('should insert a token', function() {
         var tk = tokenizer(/\s+/).push('antelope caribou deer elk').extract(3);
         tk.insertToken(1, 'buffalo', ' ');

         tk.retract(4);
         assert.equal(tk.length, 1);
         assert.equal(tk[0], 'antelope buffalo caribou deer elk');
       })
     });
   })

 });
