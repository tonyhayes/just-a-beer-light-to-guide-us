/* */ 
var glMatrix = require("./common");
var vec2 = {};
vec2.create = function() {
  var out = new glMatrix.ARRAY_TYPE(2);
  out[0] = 0;
  out[1] = 0;
  return out;
};
vec2.clone = function(a) {
  var out = new glMatrix.ARRAY_TYPE(2);
  out[0] = a[0];
  out[1] = a[1];
  return out;
};
vec2.fromValues = function(x, y) {
  var out = new glMatrix.ARRAY_TYPE(2);
  out[0] = x;
  out[1] = y;
  return out;
};
vec2.copy = function(out, a) {
  out[0] = a[0];
  out[1] = a[1];
  return out;
};
vec2.set = function(out, x, y) {
  out[0] = x;
  out[1] = y;
  return out;
};
vec2.add = function(out, a, b) {
  out[0] = a[0] + b[0];
  out[1] = a[1] + b[1];
  return out;
};
vec2.subtract = function(out, a, b) {
  out[0] = a[0] - b[0];
  out[1] = a[1] - b[1];
  return out;
};
vec2.sub = vec2.subtract;
vec2.multiply = function(out, a, b) {
  out[0] = a[0] * b[0];
  out[1] = a[1] * b[1];
  return out;
};
vec2.mul = vec2.multiply;
vec2.divide = function(out, a, b) {
  out[0] = a[0] / b[0];
  out[1] = a[1] / b[1];
  return out;
};
vec2.div = vec2.divide;
vec2.min = function(out, a, b) {
  out[0] = Math.min(a[0], b[0]);
  out[1] = Math.min(a[1], b[1]);
  return out;
};
vec2.max = function(out, a, b) {
  out[0] = Math.max(a[0], b[0]);
  out[1] = Math.max(a[1], b[1]);
  return out;
};
vec2.scale = function(out, a, b) {
  out[0] = a[0] * b;
  out[1] = a[1] * b;
  return out;
};
vec2.scaleAndAdd = function(out, a, b, scale) {
  out[0] = a[0] + (b[0] * scale);
  out[1] = a[1] + (b[1] * scale);
  return out;
};
vec2.distance = function(a, b) {
  var x = b[0] - a[0],
      y = b[1] - a[1];
  return Math.sqrt(x * x + y * y);
};
vec2.dist = vec2.distance;
vec2.squaredDistance = function(a, b) {
  var x = b[0] - a[0],
      y = b[1] - a[1];
  return x * x + y * y;
};
vec2.sqrDist = vec2.squaredDistance;
vec2.length = function(a) {
  var x = a[0],
      y = a[1];
  return Math.sqrt(x * x + y * y);
};
vec2.len = vec2.length;
vec2.squaredLength = function(a) {
  var x = a[0],
      y = a[1];
  return x * x + y * y;
};
vec2.sqrLen = vec2.squaredLength;
vec2.negate = function(out, a) {
  out[0] = -a[0];
  out[1] = -a[1];
  return out;
};
vec2.inverse = function(out, a) {
  out[0] = 1.0 / a[0];
  out[1] = 1.0 / a[1];
  return out;
};
vec2.normalize = function(out, a) {
  var x = a[0],
      y = a[1];
  var len = x * x + y * y;
  if (len > 0) {
    len = 1 / Math.sqrt(len);
    out[0] = a[0] * len;
    out[1] = a[1] * len;
  }
  return out;
};
vec2.dot = function(a, b) {
  return a[0] * b[0] + a[1] * b[1];
};
vec2.cross = function(out, a, b) {
  var z = a[0] * b[1] - a[1] * b[0];
  out[0] = out[1] = 0;
  out[2] = z;
  return out;
};
vec2.lerp = function(out, a, b, t) {
  var ax = a[0],
      ay = a[1];
  out[0] = ax + t * (b[0] - ax);
  out[1] = ay + t * (b[1] - ay);
  return out;
};
vec2.random = function(out, scale) {
  scale = scale || 1.0;
  var r = glMatrix.RANDOM() * 2.0 * Math.PI;
  out[0] = Math.cos(r) * scale;
  out[1] = Math.sin(r) * scale;
  return out;
};
vec2.transformMat2 = function(out, a, m) {
  var x = a[0],
      y = a[1];
  out[0] = m[0] * x + m[2] * y;
  out[1] = m[1] * x + m[3] * y;
  return out;
};
vec2.transformMat2d = function(out, a, m) {
  var x = a[0],
      y = a[1];
  out[0] = m[0] * x + m[2] * y + m[4];
  out[1] = m[1] * x + m[3] * y + m[5];
  return out;
};
vec2.transformMat3 = function(out, a, m) {
  var x = a[0],
      y = a[1];
  out[0] = m[0] * x + m[3] * y + m[6];
  out[1] = m[1] * x + m[4] * y + m[7];
  return out;
};
vec2.transformMat4 = function(out, a, m) {
  var x = a[0],
      y = a[1];
  out[0] = m[0] * x + m[4] * y + m[12];
  out[1] = m[1] * x + m[5] * y + m[13];
  return out;
};
vec2.forEach = (function() {
  var vec = vec2.create();
  return function(a, stride, offset, count, fn, arg) {
    var i,
        l;
    if (!stride) {
      stride = 2;
    }
    if (!offset) {
      offset = 0;
    }
    if (count) {
      l = Math.min((count * stride) + offset, a.length);
    } else {
      l = a.length;
    }
    for (i = offset; i < l; i += stride) {
      vec[0] = a[i];
      vec[1] = a[i + 1];
      fn(vec, vec, arg);
      a[i] = vec[0];
      a[i + 1] = vec[1];
    }
    return a;
  };
})();
vec2.str = function(a) {
  return 'vec2(' + a[0] + ', ' + a[1] + ')';
};
module.exports = vec2;
