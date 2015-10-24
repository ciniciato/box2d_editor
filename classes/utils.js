var EPSILON = 0.0000000001,
    CLOCKWISE = 1,
    COUNTERCLOCKWISE = -1,
    CONCAVE = -1,
    CONVEX = 1;

var utils = {
}

Array.prototype.removeDuplicates = function (){
  var temp = new Array();
  label : for (i = 0; i < this.length; i++){
            for (var j = 0; j < temp.length; j++){
              if (temp[j].x == this[i].x && temp[j].y == this[i].y)
                continue label;      
            }
            temp[temp.length] = this[i];
          }
  return temp;
}

Array.prototype.last = function(pos){
    var ind = (pos == undefined) ? 1 : (1 + Math.abs(pos));
    return this[this.length - ind];
}; 

utils.getSignal = function(_value){
	if (_value!=0)
		return _value/Math.abs(_value);
	else
		return 0;
}

utils.round = function(val, amount){
  return Math.round(val*amount)/amount;
}

utils.intersectedLine_point = function(_point, pLineA, pLineB){
  if (_point == undefined || pLineA == undefined || pLineB == undefined)
    return false;
  var m = (pLineB.y - pLineA.y) / (pLineB.x - pLineA.x);
  return ( utils.round(_point.y - pLineA.y - m * (_point.x - pLineA.x), 1000) == 0);
}

utils.intersectedSquare = function(sqA, sqB){
  if (sqB.size == undefined) sqB.size = {width: 0, height: 0}
  if (sqA.size == undefined) sqA.size = {width: 0, height: 0}
  return (Math.abs(sqA.x - sqB.x) < (sqA.size.width + sqB.size.width) &&
          Math.abs(sqA.y - sqB.y) < (sqA.size.height + sqB.size.height));
}

utils.bezierInterpolation = function(t, a, b, c, d) {
  var t2 = t * t,
      t3 = t2 * t,
       x = (a.x + (-a.x * 3 + t * (3 * a.x - a.x * t)) * t
           + (3 * b.x + t * (-6 * b.x + b.x * 3 * t)) * t
           + (c.x * 3 - c.x * 3 * t) * t2
           + d.x * t3),
       y = (a.y + (-a.y * 3 + t * (3 * a.y - a.y * t)) * t
           + (3 * b.y + t * (-6 * b.y + b.y * 3 * t)) * t
           + (c.y * 3 - c.y * 3 * t) * t2
           + d.y * t3);
  return {x: utils.round(x, 10000), y: utils.round(y, 10000)};
}

//Triangulation functions
utils.process = function(contour) {
  var result = [],
      n = contour.length,
      verts = [],
      v,
      nv = n,
      m,
      count = 2 * nv; 
  if (n < 3)
    return null;
  if (0.0 < this.area(contour)) {
    for (v = 0; v < n; v++)
      verts[v] = v;
  } else
    for (v = 0; v < n; v++)
      verts[v] = (n - 1) - v;
  for (m = 0, v = nv - 1; nv > 2;) {
    if (0 >= (count--))
      return null;
    var u = v;
    if (nv <= u) {
      u = 0; 
    }
    v = u + 1;
    if (nv <= v) {
      v = 0;
    }
    var w = v + 1;
    if (nv <= w) {
      w = 0;
    }
    if (utils.snip(contour, u, v, w, nv, verts)) {
      var a, b, c, s, t;
      a = verts[u];
      b = verts[v];
      c = verts[w];
      result.push(contour[a]);
      result.push(contour[b]);
      result.push(contour[c]);
      m++;
      for (s = v, t = v + 1; t < nv; s++, t++)
        verts[s] = verts[t];
      nv--;
      count = 2 * nv;
    }
  }
  return result;
}

utils.area = function (contour) {
  var n = contour.length,
      a = 0.0;
  for (var p = n - 1, q = 0; q < n; p = q++) {
    a += contour[p].x * contour[q].y - contour[q].x * contour[p].y;
  }
  return a * 0.5;
}

utils.insideTriangle = function (ax, ay, bx, by, cx, cy, px, py){
  var aX, aY, bX, bY,
      cX, cY, apx, apy,
      bpx, bpy, cpx, cpy,
      cCROSSap, bCROSScp, aCROSSbp;
  aX = cx - bx;
  aY = cy - by;
  bX = ax - cx;
  bY = ay - cy;
  cX = bx - ax;
  cY = by - ay;
  apx = px - ax;
  apy = py - ay;
  bpx = px - bx;
  bpy = py - by;
  cpx = px - cx;
  cpy = py - cy;
  aCROSSbp = aX * bpy - aY * bpx;
  cCROSSap = cX * apy - cY * apx;
  bCROSScp = bX * cpy - bY * cpx;
  return ((aCROSSbp >= 0.0) && (bCROSScp >= 0.0) && (cCROSSap >= 0.0));
}

utils.snip = function (contour, u, v, w, n, verts){
  var p,
      ax, ay, bx, by,
      cx, cy, px, py;
  ax = contour[verts[u]].x;
  ay = contour[verts[u]].y;
  bx = contour[verts[v]].x;
  by = contour[verts[v]].y;
  cx = contour[verts[w]].x;
  cy = contour[verts[w]].y;
  if (EPSILON > (((bx - ax) * (cy - ay)) - ((by - ay) * (cx - ax)))) {
    return false;
  }
  for (p = 0; p < n; p++) {
    if (p == u || p == v || p == w) 
      continue;
    px = contour[verts[p]].x
    py = contour[verts[p]].y
    if (utils.insideTriangle(ax, ay, bx, by, cx, cy, px, py))
      return false;
  }
  return true;
}

utils.isClockwise = function (p){
  var i, j, k, z,
      count = 0,
      n = p.length;
  if (n < 3)
    return 0;
  for (i = 0; i < n; i++) {
    j = (i + 1) % n;
    k = (i + 2) % n;
    z  = (p[j].x - p[i].x) * (p[k].y - p[j].y);
    z -= (p[j].y - p[i].y) * (p[k].x - p[j].x);
    if (z < 0)
      count--;
    else if (z > 0)
      count++;
  }
  if (count > 0)
    return COUNTERCLOCKWISE;
  else if (count < 0)
    return CLOCKWISE;
  else
    return 0;
}

utils.isConvex = function (p){
  var i, j, k, z,
      flag = 0,
      n = p.length;
  if (n < 3)
    return 0;
  for (i = 0; i < n; i++) {
    j = (i + 1) % n;
    k = (i + 2) % n;
    z  = (p[j].x - p[i].x) * (p[k].y - p[j].y);
    z -= (p[j].y - p[i].y) * (p[k].x - p[j].x);
    if (z < 0)
      flag |= 1;
    else if (z > 0)
      flag |= 2;
    if (flag === 3)
      return CONCAVE;
  }
  if (flag !== 0)
    return CONVEX;
  else
    return 0;
}