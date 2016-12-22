'use strict';

var polygon = {
}

// simplification using optimized Douglas-Peucker algorithm with recursion elimination
polygon.simplifyDouglasPeucker = function(points, sqTolerance){
    var len = points.length,
        MarkerArray = typeof Uint8Array !== 'undefined' ? Uint8Array : Array,
        markers = new MarkerArray(len),
        first = 0,
        last = len - 2,
        stack = [],
        newPoints = [],
        i, maxSqDist, sqDist, index;

    markers[first] = markers[last] = 1;

    while (last) 
	{
        maxSqDist = 0;

        for (i = first + 2; i < last; i+=2) {
            sqDist = getSqSegDist(points[i], points[i+1], 
                                    points[first], points[first+1], 
                                    points[last], points[last+1]);

            if (sqDist > maxSqDist) {
                index = i;
                maxSqDist = sqDist;
            }
        }

        if (maxSqDist > sqTolerance) {
            markers[index] = 1;
            stack.push(first, index, index, last);
        }

        last  = stack.pop();
        first = stack.pop();
    }

    for (i = 0; i < len; i+=2) 
        if (markers[i])
            newPoints.push(points[i], points[i+1]);
 
    return newPoints;
}

// basic distance-based simplification
polygon.simplifyRadialDist = function(points, sqTolerance) {
    var prevPoint = [points[0], points[1]],
        newPoints = prevPoint,
        point;

    for (var i = 2, len = points.length; i < len; i+=2) 
	{
        point = [points[i], points[i+1]];

        if (getSqDist(point[0], point[1],
        			 	prevPoint[0], prevPoint[1]) > sqTolerance) 
		{
            newPoints.push(point[0], point[1]);
            prevPoint = point;
        }
    }

    if (point!==undefined)
	    if (prevPoint[0] !== point[0] && prevPoint[1] !== point[1])
	        newPoints.push(point[0], point[1]);

    return newPoints;
}


polygon.simplifyHybrid = function(points, tolerance) {
    var sqTolerance = tolerance !== undefined ? tolerance * tolerance : 1;

    points = polygon.simplifyRadialDist(points, sqTolerance);
    points = polygon.simplifyDouglasPeucker(points, sqTolerance);

    return points;
}

polygon.getCentroid = function (arr) {
    var twoTimesSignedArea = 0;
    var cxTimes6SignedArea = 0;
    var cyTimes6SignedArea = 0;

    for ( var i = 0; i < arr.length-2; i+=2) 
    {
        var twoSA = arr[i]*arr[i+3] - arr[i+1]*arr[i+2];
        
        twoTimesSignedArea += twoSA;

        cxTimes6SignedArea += (arr[i] + arr[i+2]) * twoSA;
        cyTimes6SignedArea += (arr[i+1] + arr[i+3]) * twoSA;
    }

    var twoSA = arr[i]*arr[1] - arr[i+1]*arr[0];    
    twoTimesSignedArea += twoSA;
    cxTimes6SignedArea += (arr[i] + arr[0]) * twoSA;
    cyTimes6SignedArea += (arr[i+1] + arr[1]) * twoSA;

    var sixSignedArea = 3 * twoTimesSignedArea;
    return [ cxTimes6SignedArea / sixSignedArea, cyTimes6SignedArea / sixSignedArea];        
}

/*REQUIRED*/
// square distance between 2 points
function getSqDist(p1x, p1y, p2x, p2y) {
    var dx = p1x - p2x,
        dy = p1y - p2y;

    return dx * dx + dy * dy;
}

// square distance from a point to a segment
function getSqSegDist(px, py, p1x, p1y, p2x, p2y) {
    var x = p1x,
        y = p1y,
        dx = p2x - x,
        dy = p2y - y;

    if (dx !== 0 || dy !== 0)
	{
        var t = ((px - x) * dx + (py - y) * dy) / (dx * dx + dy * dy);

        if (t > 1)
		{
            x = p2x;
            y = p2y;

        } 
		else if (t > 0) 
		{
            x += dx * t;
            y += dy * t;
        }
    }

    dx = px - x;
    dy = py - y;

    return dx * dx + dy * dy;
}

polygon.IsSimple = function(p)
{
	var n = p.length>>1;
	if(n<4) return true;
	var a1 = new polygon._P(), a2 = new polygon._P();
	var b1 = new polygon._P(), b2 = new polygon._P();
	var c = new polygon._P();
	
	for(var i=0; i<n; i++)
	{
		a1.x = p[2*i  ];
		a1.y = p[2*i+1];
		if(i==n-1)	{ a2.x = p[0    ];  a2.y = p[1    ]; }
		else		{ a2.x = p[2*i+2];  a2.y = p[2*i+3]; }
		
		for(var j=0; j<n; j++)
		{
			if(Math.abs(i-j) < 2) continue;
			if(j==n-1 && i==0) continue;
			if(i==n-1 && j==0) continue;
			
			b1.x = p[2*j  ];
			b1.y = p[2*j+1];
			if(j==n-1)	{ b2.x = p[0    ];  b2.y = p[1    ]; }
			else		{ b2.x = p[2*j+2];  b2.y = p[2*j+3]; }
			
			if(polygon._GetLineIntersection(a1,a2,b1,b2,c) != null) return false;
		}
	}
	return true;
}

polygon.IsConvex = function(p)
{
	if(p.length<6) return true;
	var l = p.length - 4;
	for(var i=0; i<l; i+=2)
		if(!polygon._convex(p[i], p[i+1], p[i+2], p[i+3], p[i+4], p[i+5])) return false;
	if(!polygon._convex(p[l  ], p[l+1], p[l+2], p[l+3], p[0], p[1])) return false;
	if(!polygon._convex(p[l+2], p[l+3], p[0  ], p[1  ], p[2], p[3])) return false;
	return true;
}

polygon.GetArea = function(p)
{
	if(p.length <6) return 0;
	var l = p.length - 2;
	var sum = 0;
	for(var i=0; i<l; i+=2)
		sum += (p[i+2]-p[i]) * (p[i+1]+p[i+3]);
	sum += (p[0]-p[l]) * (p[l+1]+p[1]);
	return sum * 0.5;
}

polygon.GetAABB = function(p)
{
	var minx = Infinity; 
	var miny = Infinity;
	var maxx = -minx;
	var maxy = -miny;
	for(var i=0; i<p.length; i+=2)
	{
		minx = Math.min(minx, p[i  ]);
		maxx = Math.max(maxx, p[i  ]);
		miny = Math.min(miny, p[i+1]);
		maxy = Math.max(maxy, p[i+1]);
	}
	return {x:minx, y:miny, width:maxx-minx, height:maxy-miny};
}

polygon.Reverse = function(p)
{
	var np = [];
	for(var j=p.length-2; j>=0; j-=2)  np.push(p[j], p[j+1])
	return np;
}


polygon.Triangulate = function(p)
{
	var n = p.length>>1;
	if(n<3) return [];
	var tgs = [];
	var avl = [];
	for(var i=0; i<n; i++) avl.push(i);
	
	var i = 0;
	var al = n;
	while(al > 3)
	{
		var i0 = avl[(i+0)%al];
		var i1 = avl[(i+1)%al];
		var i2 = avl[(i+2)%al];
		
		var ax = p[2*i0],  ay = p[2*i0+1];
		var bx = p[2*i1],  by = p[2*i1+1];
		var cx = p[2*i2],  cy = p[2*i2+1];
		
		var earFound = false;
		if(polygon._convex(ax, ay, bx, by, cx, cy))
		{
			earFound = true;
			for(var j=0; j<al; j++)
			{
				var vi = avl[j];
				if(vi==i0 || vi==i1 || vi==i2) continue;
				if(polygon._PointInTriangle(p[2*vi], p[2*vi+1], ax, ay, bx, by, cx, cy)) {earFound = false; break;}
			}
		}
		if(earFound)
		{
			tgs.push(i0, i1, i2);
			avl.splice((i+1)%al, 1);
			al--;
			i= 0;
		}
		else if(i++ > 3*al) break;		// no convex angles :(
	}
	tgs.push(avl[0], avl[1], avl[2]);
	return tgs;
}

polygon.ContainsPoint = function(p, radius, px, py)
{
	var len = p.length;
	var ax, ay = p[len-3]-py, bx = p[len-2]-px, by = p[len-1]-py;
	var lup=0;
	
	for(var i=0; i<len; i+=2)
	{
		ax = bx;  ay = by;
		bx = p[i] - px;
		by = p[i+1] - py;
		if(ay==by) continue;
		lup = by>ay;
	}
	
	var depth = 0;
	for(var i=0; i<len; i+=2)
	{
		ax = bx;  ay = by;
		bx = p[i] - px;
		by = p[i+1] - py;
		if(ay< 0 && by< 0) continue;	// both "up" or both "down"
		if(ay> 0 && by> 0) continue;	// both "up" or both "down"
		if(ax< 0 && bx< 0) continue; 	// both points on the left
		
		if(ay==by && Math.min(ax,bx)<=0) return true;
		if(ay==by) continue;
		
		var lx = ax + (bx-ax)*(-ay)/(by-ay);
		if(lx==0) return true;// point on edge
		if(lx>0) depth++;
		if(ay==0 &&  lup && by>ay) depth--;// hit vertex, both up
		if(ay==0 && !lup && by<ay) depth--; // hit vertex, both down
		lup = by>ay;
	}
	
	return (depth & 1) == 1;
}

polygon.Slice = function(p, ax, ay, bx, by)
{
	if(polygon.ContainsPoint(p, ax, ay) || polygon.ContainsPoint(p, bx, by)) return [p.slice(0)];

	var a = new polygon._P(ax, ay);
	var b = new polygon._P(bx, by);
	var iscs = [];	// intersections
	var ps = [];	// points
	for(var i=0; i<p.length; i+=2) ps.push(new polygon._P(p[i], p[i+1]));
	
	for(var i=0; i<ps.length; i++)
	{
		var isc = new polygon._P(0,0);
		isc = polygon._GetLineIntersection(a, b, ps[i], ps[(i+1)%ps.length], isc);
		var fisc = iscs[0];
		var lisc = iscs[iscs.length-1];
		if(isc && (fisc==null || polygon._P.dist(isc,fisc)>1e-10) && (lisc==null || polygon._P.dist(isc,lisc)>1e-10 ) )//&& (isc.x!=ps[i].x || isc.y!=ps[i].y) )
		{
			isc.flag = true;
			iscs.push(isc);
			ps.splice(i+1,0,isc);
			i++;
		}
	}
	
	if(iscs.length <2) return [p.slice(0)];
	var comp = function(u,v) { return polygon._P.dist(a,u) - polygon._P.dist(a,v); }
	iscs.sort(comp);
	
	//console.log("Intersections: "+iscs.length, JSON.stringify(iscs));
	
	var pgs = [];
	var dir = 0;
	while(iscs.length > 0)
	{
		var n = ps.length;
		var i0 = iscs[0];
		var i1 = iscs[1];
		//if(i0.x==i1.x && i0.y==i1.y) { iscs.splice(0,2); continue;}
		var ind0 = ps.indexOf(i0);
		var ind1 = ps.indexOf(i1);
		var solved = false;
		
		//console.log(i0, i1);
		
		if(polygon._firstWithFlag(ps, ind0) == ind1) solved = true;
		else
		{
			i0 = iscs[1];
			i1 = iscs[0];
			ind0 = ps.indexOf(i0);
			ind1 = ps.indexOf(i1);
			if(polygon._firstWithFlag(ps, ind0) == ind1) solved = true;
		}
		if(solved)
		{
			dir--;
			var pgn = polygon._getPoints(ps, ind0, ind1);
			pgs.push(pgn);
			ps = polygon._getPoints(ps, ind1, ind0);
			i0.flag = i1.flag = false;
			iscs.splice(0,2);
			if(iscs.length == 0) pgs.push(ps);
		}
		else { dir++; iscs.reverse(); }
		if(dir>1) break;
	}
	var result = [];
	for(var i=0; i<pgs.length; i++)
	{
		var pg = pgs[i];
		var npg = [];
		for(var j=0; j<pg.length; j++) npg.push(pg[j].x, pg[j].y);
		result.push(npg);
	}
	return result;
}

polygon.Raycast = function(p, x, y, dx, dy, isc)
{
	var l = p.length - 2;
	var tp = polygon._tp;
	var a1 = tp[0], a2 = tp[1], 
	b1 = tp[2], b2 = tp[3], c = tp[4];
	a1.x = x; a1.y = y;
	a2.x = x+dx; a2.y = y+dy;
	
	if(isc==null) isc = {dist:0, edge:0, norm:{x:0, y:0}, refl:{x:0, y:0}};
	isc.dist = Infinity;
	
	for(var i=0; i<l; i+=2)
	{
		b1.x = p[i  ];  b1.y = p[i+1];
		b2.x = p[i+2];  b2.y = p[i+3];
		var nisc = polygon._RayLineIntersection(a1, a2, b1, b2, c);
		if(nisc) polygon._updateISC(dx, dy, a1, b1, b2, c, i/2, isc);
	}
	b1.x = b2.x;  b1.y = b2.y;
	b2.x = p[0];  b2.y = p[1];
	var nisc = polygon._RayLineIntersection(a1, a2, b1, b2, c);
	if(nisc) polygon._updateISC(dx, dy, a1, b1, b2, c, (p.length/2)-1, isc);
	
	return (isc.dist != Infinity) ? isc : null;
}

polygon.ClosestEdge = function(p, x, y, isc)
{
	var l = p.length - 2;
	var tp = polygon._tp;
	var a1 = tp[0], 
	b1 = tp[2], b2 = tp[3], c = tp[4];
	a1.x = x; a1.y = y;
	
	if(isc==null) isc = {dist:0, edge:0, point:{x:0, y:0}, norm:{x:0, y:0}};
	isc.dist = Infinity;
	
	for(var i=0; i<l; i+=2)
	{
		b1.x = p[i  ];  b1.y = p[i+1];
		b2.x = p[i+2];  b2.y = p[i+3];
		polygon._pointLineDist(a1, b1, b2, i>>1, isc);
	}
	b1.x = b2.x;  b1.y = b2.y;
	b2.x = p[0];  b2.y = p[1];
	polygon._pointLineDist(a1, b1, b2, l>>1, isc);
	
	var idst = 1/isc.dist;
	isc.norm.x = (x-isc.point.x)*idst;
	isc.norm.y = (y-isc.point.y)*idst;
	return isc;
}

polygon._pointLineDist = function(p, a, b, edge, isc)
{
	var x = p.x, y = p.y, x1 = a.x, y1 = a.y, x2 = b.x, y2 = b.y;
	
	var A = x - x1;
	var B = y - y1;
	var C = x2 - x1;
	var D = y2 - y1;

	var dot = A * C + B * D;
	var len_sq = C * C + D * D;
	var param = dot / len_sq;

	var xx, yy;

	if (param < 0 || (x1 == x2 && y1 == y2)) {
		xx = x1;
		yy = y1;
	}
	else if (param > 1) {
		xx = x2;
		yy = y2;
	}
	else {
		xx = x1 + param * C;
		yy = y1 + param * D;
	}

	var dx = x - xx;
	var dy = y - yy;
	var dst = Math.sqrt(dx * dx + dy * dy);
	if(dst<isc.dist)
	{
		isc.dist = dst;
		isc.edge = edge;
		isc.point.x = xx;
		isc.point.y = yy;
	}
}

polygon._updateISC = function(dx, dy, a1, b1, b2, c, edge, isc)
{
	var nrl = polygon._P.dist(a1, c);
	if(nrl<isc.dist)
	{
		var ibl = 1/polygon._P.dist(b1, b2);
		var nx = -(b2.y-b1.y)*ibl;
		var ny =  (b2.x-b1.x)*ibl;
		var ddot = 2*(dx*nx+dy*ny);
		isc.dist = nrl;
		isc.norm.x = nx;  
		isc.norm.y = ny; 
		isc.refl.x = -ddot*nx+dx;
		isc.refl.y = -ddot*ny+dy;
		isc.edge = edge;
	}
}

polygon._getPoints = function(ps, ind0, ind1)
{
	var n = ps.length;
	var nps = [];
	if(ind1<ind0) ind1 += n;
	for(var i=ind0; i<= ind1; i++) nps.push(ps[i%n]);
	return nps;
}

polygon._firstWithFlag = function(ps, ind)
{
	var n = ps.length;
	while(true)
	{
		ind = (ind+1)%n;
		if(ps[ind].flag) return ind;
	}
}

polygon._PointInTriangle = function(px, py, ax, ay, bx, by, cx, cy)
{
	var v0x = cx-ax;
	var v0y = cy-ay;
	var v1x = bx-ax;
	var v1y = by-ay;
	var v2x = px-ax;
	var v2y = py-ay;
	
	var dot00 = v0x*v0x+v0y*v0y;
	var dot01 = v0x*v1x+v0y*v1y;
	var dot02 = v0x*v2x+v0y*v2y;
	var dot11 = v1x*v1x+v1y*v1y;
	var dot12 = v1x*v2x+v1y*v2y;
	
	var invDenom = 1 / (dot00 * dot11 - dot01 * dot01);
	var u = (dot11 * dot02 - dot01 * dot12) * invDenom;
	var v = (dot00 * dot12 - dot01 * dot02) * invDenom;

	// Check if point is in triangle
	return (u >= 0) && (v >= 0) && (u + v < 1);
}

polygon._RayLineIntersection = function(a1, a2, b1, b2, c)
{
	var dax = (a1.x-a2.x), dbx = (b1.x-b2.x);
	var day = (a1.y-a2.y), dby = (b1.y-b2.y);

	var Den = dax*dby - day*dbx;
	if (Den == 0) return null;	// parallel
	
	var A = (a1.x * a2.y - a1.y * a2.x);
	var B = (b1.x * b2.y - b1.y * b2.x);
	
	var I = c;
	var iDen = 1/Den;
	I.x = ( A*dbx - dax*B ) * iDen;
	I.y = ( A*dby - day*B ) * iDen;
	
	if(!polygon._InRect(I, b1, b2)) return null;
	if((day>0 && I.y>a1.y) || (day<0 && I.y<a1.y)) return null; 
	if((dax>0 && I.x>a1.x) || (dax<0 && I.x<a1.x)) return null; 
	return I;
}

polygon._GetLineIntersection = function(a1, a2, b1, b2, c)
{
	var dax = (a1.x-a2.x), dbx = (b1.x-b2.x);
	var day = (a1.y-a2.y), dby = (b1.y-b2.y);

	var Den = dax*dby - day*dbx;
	if (Den == 0) return null;	// parallel
	
	var A = (a1.x * a2.y - a1.y * a2.x);
	var B = (b1.x * b2.y - b1.y * b2.x);
	
	var I = c;
	I.x = ( A*dbx - dax*B ) / Den;
	I.y = ( A*dby - day*B ) / Den;
	
	if(polygon._InRect(I, a1, a2) && polygon._InRect(I, b1, b2)) return I;
	return null;
}

polygon._InRect = function(a, b, c)	// a in rect (b,c)
{
	var minx = Math.min(b.x,c.x), maxx = Math.max(b.x,c.x);
	var miny = Math.min(b.y,c.y), maxy = Math.max(b.y,c.y);
	
	if	(minx == maxx) return (miny<=a.y && a.y<=maxy);
	if	(miny == maxy) return (minx<=a.x && a.x<=maxx);
	
	return (minx <= a.x+1e-10 && a.x-1e-10 <= maxx && miny <= a.y+1e-10 && a.y-1e-10 <= maxy) ;		
}

polygon._convex = function(ax, ay, bx, by, cx, cy)
{
	return (ay-by)*(cx-bx) + (bx-ax)*(cy-by) >= 0;
}
	
polygon._P = function(x,y)
{
	this.x = x;
	this.y = y;
	this.flag = false;
}

polygon._P.prototype.toString = function()
{
	return "Point ["+this.x+", "+this.y+"]";
}

polygon._P.dist = function(a,b)
{
	var dx = b.x-a.x;
	var dy = b.y-a.y;
	return Math.sqrt(dx*dx + dy*dy);
}

polygon.cross = function(a, b, c) {
  return (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0]);
}

polygon.lexicographicOrder = function(a, b) {
  return a[0] - b[0] || a[1] - b[1];
}

polygon.computeUpperHullIndexes = function(points) {
  var n = points.length,
      indexes = [0, 1],
      size = 2;

  for (var i = 2; i < n; ++i) 
  {
    while (size > 1 && polygon.cross(points[indexes[size - 2]], points[indexes[size - 1]], points[i]) <= 0) --size;
    indexes[size++] = i;
  }

  return indexes.slice(0, size); // remove popped points
}

polygon.convexHull = function(points) {
	var i,  n = points.length/2,
	  sortedPoints = new Array(n),
	  flippedPoints = new Array(n);

	for (i = 0; i < n; ++i)
	{
		sortedPoints[i] = [];
		sortedPoints[i][0] = points[i*2];
		sortedPoints[i][1] = points[i*2+1];
		sortedPoints[i][2] = i 
	} 

	sortedPoints.sort(polygon.lexicographicOrder);
	for (i = 0; i < n; ++i) flippedPoints[i] = [sortedPoints[i][0], -sortedPoints[i][1]];

	var upperIndexes = polygon.computeUpperHullIndexes(sortedPoints),
	 	lowerIndexes = polygon.computeUpperHullIndexes(flippedPoints);

	// Construct the hull polygon, removing possible duplicate endpoints.
	var skipLeft = lowerIndexes[0] === upperIndexes[0],
	  skipRight = lowerIndexes[lowerIndexes.length - 1] === upperIndexes[upperIndexes.length - 1],
	  hull = [];

	// Add upper hull in right-to-l order.
	// Then add lower hull in left-to-right order.
	for (i = upperIndexes.length - 1; i >= 0; --i)
	{ 
		var ind = sortedPoints[upperIndexes[i]][2]*2;

		hull.push(points[ind]);
		hull.push(points[ind+1]);
	}
	for (i = +skipLeft; i < lowerIndexes.length - skipRight; ++i)
	{ 
		var ind = sortedPoints[lowerIndexes[i]][2]*2; 

		hull.push(points[ind]);
		hull.push(points[ind+1]);
	}

	return hull;
}

polygon._tp = [];
for(var i=0; i<10; i++) polygon._tp.push(new polygon._P(0,0));


function IntersectLines(start0, dir0, start1, dir1)
{
    var dd = dir0[0]*dir1[1] - dir0[1]*dir1[0];
    // dd=0 => lines are parallel. we don't care as our lines are never parallel.
    var dx = start1[0]-start0[0]; 
    var dy = start1[1]-start0[1];
    var t = (dx*dir1[1] - dy*dir1[0])/dd; 
    return [start0[0] + t*dir0[0], start0[1] + t*dir0[1]]; 
}


function distance(va,vb){
    var dx = va[0]-vb[0],
        dy = va[1]-vb[1];
    return Math.sqrt(dx*dx+dy*dy); 
}

// computes the minimum area enclosing rectangle
// (aka oriented minimum bounding box)
function CalcOmbb(convexHull)
{   
    // initialize attributes
    var
    	BestObbArea = Number.MAX_VALUE,
   		BestObb = [];

    function UpdateOmbb(leftStart, leftDir, rightStart, rightDir, topStart, topDir, bottomStart, bottomDir)
    {  
        var obbUpperLeft   = IntersectLines(leftStart, leftDir, topStart, topDir),
            obbUpperRight  = IntersectLines(rightStart, rightDir, topStart, topDir),
            obbBottomLeft  = IntersectLines(bottomStart, bottomDir, leftStart, leftDir),
            obbBottomRight = IntersectLines(bottomStart, bottomDir, rightStart, rightDir),
            distLeftRight  = distance(obbUpperLeft, obbUpperRight),        
            distTopBottom  = distance(obbUpperLeft, obbBottomLeft),
            obbArea        = distLeftRight*distTopBottom;
        
        if (obbArea < BestObbArea)
        {
            BestObb = [	obbUpperLeft[0],   obbUpperLeft[1], 
            			obbBottomLeft[0],  obbBottomLeft[1],
            			obbBottomRight[0], obbBottomRight[1], 
            			obbUpperRight[0],  obbUpperRight[1]];
            BestObbArea = obbArea;
        }
    }
        
    // compute directions of convex hull edges
    var ind=0, len = convexHull.length,
        edgeDirs = new Array(len),
        dx=0,dy=0,d=0;
    
    for (var i=0; i<len; i+=2)
    {
        ind=(i+2)%len;
        dx = convexHull[ind]   - convexHull[i];
        dy = convexHull[ind+1] - convexHull[i+1];
        d  = Math.sqrt(dx*dx+dy*dy);
        edgeDirs[i]   = dx/d; 
        edgeDirs[i+1] = dy/d;
    }
    
    // compute extreme points
    var minPt = [Number.MAX_VALUE, Number.MAX_VALUE], 
        maxPt = [Number.MIN_VALUE, Number.MIN_VALUE];
    var leftIdx, rightIdx, topIdx, bottomIdx;
   
    for (var i=0; i<len; i+=2)
    {
        var pt = [convexHull[i], convexHull[i+1]];
        
        if (pt[0] < minPt[0])
        {
            minPt[0] = pt[0];
            leftIdx = i;
        }
        
        if (pt[0] > maxPt[0])
        {
            maxPt[0] = pt[0];
            rightIdx = i;
        }
        
        if (pt[1] < minPt[1])
        {
            minPt[1] = pt[1];
            bottomIdx = i;
        }

        if (pt[1] > maxPt[1])
        {
            maxPt[1] = pt[1];
            topIdx = i;
        }
    }  

    var leftDir   = [ 0, -1],  rightDir  = [ 0,  1],
        topDir    = [-1,  0],  bottomDir = [ 1,  0];
   
    // execute rotating caliper algorithm
    for (var i=0; i<len; i+=2)
    {
        // of course the acos() can be optimized.
        // but it's a JS prototype anyways, so who cares.
        var phis = // 0=left, 1=right, 2=top, 3=bottom
        [
            Math.acos(leftDir[0]   * edgeDirs[leftIdx]   + leftDir[1]   * edgeDirs[leftIdx+1]),
            Math.acos(rightDir[0]  * edgeDirs[rightIdx]  + rightDir[1]  * edgeDirs[rightIdx+1]),
            Math.acos(topDir[0]    * edgeDirs[topIdx]    + topDir[1]    * edgeDirs[topIdx+1]),
            Math.acos(bottomDir[0] * edgeDirs[bottomIdx] + bottomDir[1] * edgeDirs[bottomIdx+1]),
        ];
        
        var lineWithSmallestAngle = phis.indexOf(Math.min.apply(Math, phis));

        switch (lineWithSmallestAngle)
        {
        case 0: // left
            leftDir  = [edgeDirs[leftIdx], edgeDirs[leftIdx+1]];
            rightDir = [-leftDir[0], -leftDir[1]];

            topDir    = [leftDir[1], -leftDir[0]];
            bottomDir = [-topDir[0], -topDir[1]];

            leftIdx = (leftIdx+2)%len;
            break;
        case 1: // right
            rightDir = [edgeDirs[rightIdx], edgeDirs[rightIdx+1]];
            leftDir  = [-rightDir[0], -rightDir[1]];

            topDir    = [leftDir[1], -leftDir[0]];
            bottomDir = [-topDir[0], -topDir[1]];

            rightIdx = (rightIdx+2)%len;
            break;
        case 2: // top
            topDir    = [edgeDirs[topIdx], edgeDirs[topIdx+1]];
            bottomDir = [-topDir[0], -topDir[1]];

            leftDir  = [bottomDir[1], -bottomDir[0]];
            rightDir = [-leftDir[0], -leftDir[1]];
            
            topIdx = (topIdx+2)%len;
            break;
        case 3: // bottom
            bottomDir = [edgeDirs[bottomIdx], edgeDirs[bottomIdx+1]];
            topDir    = [-bottomDir[0], -bottomDir[1]];
            
            leftDir  = [bottomDir[1], -bottomDir[0]];
            rightDir = [-leftDir[0], -leftDir[1]];

            bottomIdx = (bottomIdx+2)%len;
            break;
        }                   

        UpdateOmbb( [convexHull[leftIdx]  , convexHull[leftIdx+1]],   leftDir,  
                    [convexHull[rightIdx] , convexHull[rightIdx+1]],  rightDir, 
                    [convexHull[topIdx]   , convexHull[topIdx+1]],    topDir, 
                    [convexHull[bottomIdx], convexHull[bottomIdx+1]], bottomDir);
    }

    return BestObb;
}


 "use strict";

var ON = 0;
var LEFT = 1;
var RIGHT = 2;
var ALMOST_ZERO = 0.00001;

function GetSideOfLine(lineStart, lineEnd, point)
{
    var d = (lineEnd[0]-lineStart[0])*(point[1]-lineStart[1])-(lineEnd[1]-lineStart[1])*(point[0]-lineStart[0]);
    return (d > ALMOST_ZERO ? LEFT : (d < -ALMOST_ZERO ? RIGHT : ON));
}

// returns convex hull in CW order
// (required by Rotating Calipers implementation)
function CalcConvexHull(points)
{   
    // bad input?
    if (points.length < 6)
        return points;

    // find first hull point
    var hullPt = [points[0], points[1]],
        len = points.length,
        convexHull = [];
    
    for (var i=2; i<len; i+=2)
    {
        // perform lexicographical compare
        if (points[i] < hullPt[0])
            hullPt = [points[i], points[i+1]];
        else if (Math.abs(points[i]-hullPt[0]) < ALMOST_ZERO && points[i+1] < hullPt[1])
                hullPt = [points[i], points[i+1]];
    }
        
    // find remaining hull points
    do
    {     
        convexHull.unshift(hullPt[0], hullPt[1]);
        var endPt = [points[0], points[1]];
       
        for (var j=2; j<len; j+=2)
        {           
            var side = GetSideOfLine(hullPt, endPt, [points[j], points[j+1]]);
            if ((endPt[0]==hullPt[0] && endPt[1]==hullPt[1]) || (side == LEFT || 
                (side == ON && distance([points[j], points[j+1]], hullPt) > distance(hullPt, endPt))))
                endPt = [points[j], points[j+1]];
        }
       
        hullPt = endPt;
    }
    while (!(endPt[0]==convexHull[convexHull.length-2] && endPt[1]==convexHull[convexHull.length-1]));

    return convexHull;
}
