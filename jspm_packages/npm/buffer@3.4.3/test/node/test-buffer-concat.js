/* */ 
(function(process) {
  'use strict';
  var Buffer = require("../../../buffer@3.4.3").Buffer;
  if (process.env.OBJECT_IMPL)
    Buffer.TYPED_ARRAY_SUPPORT = false;
  var common = {};
  var assert = require("assert");
  var zero = [];
  var one = [new Buffer('asdf')];
  var long = [];
  for (var i = 0; i < 10; i++)
    long.push(new Buffer('asdf'));
  var flatZero = Buffer.concat(zero);
  var flatOne = Buffer.concat(one);
  var flatLong = Buffer.concat(long);
  var flatLongLen = Buffer.concat(long, 40);
  assert(flatZero.length === 0);
  assert(flatOne.toString() === 'asdf');
  assert(flatOne !== one[0]);
  assert(flatLong.toString() === (new Array(10 + 1).join('asdf')));
  assert(flatLongLen.toString() === (new Array(10 + 1).join('asdf')));
  assert.throws(function() {
    Buffer.concat([42]);
  }, TypeError);
})(require("process"));
