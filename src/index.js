"use strict";

(function() {
  var root = this

  var has_require = typeof require !== 'undefined'

  var d3 = root.d3

  if( typeof d3 === 'undefined' ) {
    if( has_require ) {
      d3 = require('d3')
    }
    else throw new Error('swoopyarrows requires d3; see https://d3js.org/');
  }

  var swoopyarrows = {
    swoopy: require('./swoopy.js'),
    kooky: require('./kooky.js'),
    loopy: require('./loopy.js')
  }

  if( typeof exports !== 'undefined' ) {
    if( typeof module !== 'undefined' && module.exports ) {
      exports = module.exports = swoopyarrows
    }
    exports.swoopyarrows = swoopyarrows
  } 
  else {
    root.swoopyarrows = swoopyarrows
  }

}).call(this);