/* */ 
var glMatrix = require("./common");
var vec3 = {};
vec3.create = function() {
  var out = new glMatrix.ARRAY_TYPE(3);
  out[0] = 0;
  out[1] = 0;
  out[2] = 0;
  return out;
};
vec3.clone = function(a) {
  var out = new glMatrix.ARRAY_TYPE(3);
  out[0] = a[0];
  out[1] = a[1];
  out[2] = a[2];
  return out;
};
vec3.fromValues = function(x, y, z) {
  var out = new glMatrix.ARRAY_TYPE(3);
  out[0] = x;
  out[1] = y;
  out[2] = z;
  return out;
};
vec3.copy = function(out, a) {
  out[0] = a[0];
  out[1] = a[1];
  out[2] = a[2];
  return out;
};
vec3.set = function(out, x, y, z) {
  out[0] = x;
  out[1] = y;
  out[2] = z;
  return out;
};
vec3.add = function(out, a, b) {
  out[0] = a[0] + b[0];
  out[1] = a[1] + b[1];
  out[2] = a[2] + b[2];
  return out;
};
vec3.subtract = function(out, a, b) {
  out[0] = a[0] - b[0];
  out[1] = a[1] - b[1];
  out[2] = a[2] - b[2];
  return out;
};
vec3.sub = vec3.subtract;
vec3.multiply = function(out, a, b) {
  out[0] = a[0] * b[0];
  out[1] = a[1] * b[1];
  out[2] = a[2] * b[2];
  return out;
};
vec3.mul = vec3.multiply;
vec3.divide = function(out, a, b) {
  out[0] = a[0] / b[0];
  out[1] = a[1] / b[1];
  out[2] = a[2] / b[2];
  return out;
};
vec3.div = vec3.divide;
vec3.min = function(out, a, b) {
  out[0] = Math.min(a[0], b[0]);
  out[1] = Math.min(a[1], b[1]);
  out[2] = Math.min(a[2], b[2]);
  return out;
};
vec3.max = function(out, a, b) {
  out[0] = Math.max(a[0], b[0]);
  out[1] = Math.max(a[1], b[1]);
  out[2] = Math.max(a[2], b[2]);
  return out;
};
vec3.scale = function(out, a, b) {
  out[0] = a[0] * b;
  out[1] = a[1] * b;
  out[2] = a[2] * b;
  return out;
};
vec3.scaleAndAdd = function(out, a, b, scale) {
  out[0] = a[0] + (b[0] * scale);
  out[1] = a[1] + (b[1] * scale);
  out[2] = a[2] + (b[2] * scale);
  return out;
};
vec3.distance = function(a, b) {
  var x = b[0] - a[0],
      y = b[1] - a[1],
      z = b[2] - a[2];
  return Math.sqrt(x * x + y * y + z * z);
};
vec3.dist = vec3.distance;
vec3.squaredDistance = function(a, b) {
  var x = b[0] - a[0],
      y = b[1] - a[1],
      z = b[2] - a[2];
  return x * x + y * y + z * z;
};
vec3.sqrDist = vec3.squaredDistance;
vec3.length = function(a) {
  var x = a[0],
      y = a[1],
      z = a[2];
  return Math.sqrt(x * x + y * y + z * z);
};
vec3.len = vec3.length;
vec3.squaredLength = function(a) {
  var x = a[0],
      y = a[1],
      z = a[2];
  return x * x + y * y + z * z;
};
vec3.sqrLen = vec3.squaredLength;
vec3.negate = function(out, a) {
  out[0] = -a[0];
  out[1] = -a[1];
  out[2] = -a[2];
  return out;
};
vec3.inverse = function(out, a) {
  out[0] = 1.0 / a[0];
  out[1] = 1.0 / a[1];
  out[2] = 1.0 / a[2];
  return out;
};
vec3.normalize = function(out, a) {
  var x = a[0],
      y = a[1],
      z = a[2];
  var len = x * x + y * y + z * z;
  if (len > 0) {
    len = 1 / Math.sqrt(len);
    out[0] = a[0] * len;
    out[1] = a[1] * len;
    out[2] = a[2] * len;
  }
  return out;
};
vec3.dot = function(a, b) {
  return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
};
vec3.cross = function(out, a, b) {
  var ax = a[0],
      ay = a[1],
      az = a[2],
      bx = b[0],
      by = b[1],
      bz = b[2];
  out[0] = ay * bz - az * by;
  out[1] = az * bx - ax * bz;
  out[2] = ax * by - ay * bx;
  return out;
};
vec3.lerp = function(out, a, b, t) {
  var ax = a[0],
      ay = a[1],
      az = a[2];
  out[0] = ax + t * (b[0] - ax);
  out[1] = ay + t * (b[1] - ay);
  out[2] = az + t * (b[2] - az);
  return out;
};
vec3.hermite = function(out, a, b, c, d, t) {
  var factorTimes2 = t * t,
      factor1 = factorTimes2 * (2 * t - 3) + 1,
      factor2 = factorTimes2 * (t - 2) + t,
      factor3 = factorTimes2 * (t - 1),
      factor4 = factorTimes2 * (3 - 2 * t);
  out[0] = a[0] * factor1 + b[0] * factor2 + c[0] * factor3 + d[0] * factor4;
  out[1] = a[1] * factor1 + b[1] * factor2 + c[1] * factor3 + d[1] * factor4;
  out[2] = a[2] * factor1 + b[2] * factor2 + c[2] * factor3 + d[2] * factor4;
  return out;
};
vec3.bezier = function(out, a, b, c, d, t) {
  var inverseFactor = 1 - t,
      inverseFactorTimesTwo = inverseFactor * inverseFactor,
      factorTimes2 = t * t,
      factor1 = inverseFactorTimesTwo * inverseFactor,
      factor2 = 3 * t * inverseFactorTimesTwo,
      factor3 = 3 * factorTimes2 * inverseFactor,
      factor4 = factorTimes2 * t;
  out[0] = a[0] * factor1 + b[0] * factor2 + c[0] * factor3 + d[0] * factor4;
  out[1] = a[1] * factor1 + b[1] * factor2 + c[1] * factor3 + d[1] * factor4;
  out[2] = a[2] * factor1 + b[2] * factor2 + c[2] * factor3 + d[2] * factor4;
  return out;
};
vec3.random = function(out, scale) {
  scale = scale || 1.0;
  var r = glMatrix.RANDOM() * 2.0 * Math.PI;
  var z = (glMatrix.RANDOM() * 2.0) - 1.0;
  var zScale = Math.sqrt(1.0 - z * z) * scale;
  out[0] = Math.cos(r) * zScale;
  out[1] = Math.sin(r) * zScale;
  out[2] = z * scale;
  return out;
};
vec3.transformMat4 = function(out, a, m) {
  var x = a[0],
      y = a[1],
      z = a[2],
      w = m[3] * x + m[7] * y + m[11] * z + m[15];
  w = w || 1.0;
  out[0] = (m[0] * x + m[4] * y + m[8] * z + m[12]) / w;
  out[1] = (m[1] * x + m[5] * y + m[9] * z + m[13]) / w;
  out[2] = (m[2] * x + m[6] * y + m[10] * z + m[14]) / w;
  return out;
};
vec3.transformMat3 = function(out, a, m) {
  var x = a[0],
      y = a[1],
      z = a[2];
  out[0] = x * m[0] + y * m[3] + z * m[6];
  out[1] = x * m[1] + y * m[4] + z * m[7];
  out[2] = x * m[2] + y * m[5] + z * m[8];
  return out;
};
vec3.transformQuat = function(out, a, q) {
  var x = a[0],
      y = a[1],
      z = a[2],
      qx = q[0],
      qy = q[1],
      qz = q[2],
      qw = q[3],
      ix = qw * x + qy * z - qz * y,
      iy = qw * y + qz * x - qx * z,
      iz = qw * z + qx * y - qy * x,
      iw = -qx * x - qy * y - qz * z;
  out[0] = ix * qw + iw * -qx + iy * -qz - iz * -qy;
  out[1] = iy * qw + iw * -qy + iz * -qx - ix * -qz;
  out[2] = iz * qw + iw * -qz + ix * -qy - iy * -qx;
  return out;
};
vec3.rotateX = function(out, a, b, c) {
  var p = [],
      r = [];
  p[0] = a[0] - b[0];
  p[1] = a[1] - b[1];
  p[2] = a[2] - b[2];
  r[0] = p[0];
  r[1] = p[1] * Math.cos(c) - p[2] * Math.sin(c);
  r[2] = p[1] * Math.sin(c) + p[2] * Math.cos(c);
  out[0] = r[0] + b[0];
  out[1] = r[1] + b[1];
  out[2] = r[2] + b[2];
  return out;
};
vec3.rotateY = function(out, a, b, c) {
  var p = [],
      r = [];
  p[0] = a[0] - b[0];
  p[1] = a[1] - b[1];
  p[2] = a[2] - b[2];
  r[0] = p[2] * Math.sin(c) + p[0] * Math.cos(c);
  r[1] = p[1];
  r[2] = p[2] * Math.cos(c) - p[0] * Math.sin(c);
  out[0] = r[0] + b[0];
  out[1] = r[1] + b[1];
  out[2] = r[2] + b[2];
  return out;
};
vec3.rotateZ = function(out, a, b, c) {
  var p = [],
      r = [];
  p[0] = a[0] - b[0];
  p[1] = a[1] - b[1];
  p[2] = a[2] - b[2];
  r[0] = p[0] * Math.cos(c) - p[1] * Math.sin(c);
  r[1] = p[0] * Math.sin(c) + p[1] * Math.cos(c);
  r[2] = p[2];
  out[0] = r[0] + b[0];
  out[1] = r[1] + b[1];
  out[2] = r[2] + b[2];
  return out;
};
vec3.forEach = (function() {
  var vec = vec3.create();
  return function(a, stride, offset, count, fn, arg) {
    var i,
        l;
    if (!stride) {
      stride = 3;
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
      vec[2] = a[i + 2];
      fn(vec, vec, arg);
      a[i] = vec[0];
      a[i + 1] = vec[1];
      a[i + 2] = vec[2];
    }
    return a;
  };
})();
vec3.angle = function(a, b) {
  var tempA = vec3.fromValues(a[0], a[1], a[2]);
  var tempB = vec3.fromValues(b[0], b[1], b[2]);
  vec3.normalize(tempA, tempA);
  vec3.normalize(tempB, tempB);
  var cosine = vec3.dot(tempA, tempB);
  if (cosine > 1.0) {
    return 0;
  } else {
    return Math.acos(cosine);
  }
};
vec3.str = function(a) {
  return 'vec3(' + a[0] + ', ' + a[1] + ', ' + a[2] + ')';
};
module.exports = vec3;
