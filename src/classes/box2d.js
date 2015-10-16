var 
  b2Vec2              = Box2D.Common.Math.b2Vec2, 
	b2AABB              = Box2D.Collision.b2AABB, 
	b2BodyDef           = Box2D.Dynamics.b2BodyDef, 
	b2Body              = Box2D.Dynamics.b2Body, 
	b2FixtureDef        = Box2D.Dynamics.b2FixtureDef, 
	b2Fixture           = Box2D.Dynamics.b2Fixture, 
	b2World             = Box2D.Dynamics.b2World, 
	b2MassData          = Box2D.Collision.Shapes.b2MassData, 
	b2PolygonShape      = Box2D.Collision.Shapes.b2PolygonShape, 
	b2CircleShape       = Box2D.Collision.Shapes.b2CircleShape, 
	b2DebugDraw         = Box2D.Dynamics.b2DebugDraw, 
	b2MouseJointDef     = Box2D.Dynamics.Joints.b2MouseJointDef, 
	b2WeldJointDef      = Box2D.Dynamics.Joints.b2WeldJointDef, 
	b2PrismaticJoint    = Box2D.Dynamics.Joints.b2PrismaticJoint, 
	b2Shape             = Box2D.Collision.Shapes.b2Shape, 
	b2RevoluteJointDef  = Box2D.Dynamics.Joints.b2RevoluteJointDef, 
	b2Joint             = Box2D.Dynamics.Joints.b2Joint, 
	b2DistanceJointDef  = Box2D.Dynamics.Joints.b2DistanceJointDef, 
	b2PrismaticJointDef = Box2D.Dynamics.Joints.b2PrismaticJointDef, 
	b2ContactListener   = Box2D.Dynamics.b2ContactListener, 
	b2Settings          = Box2D.Common.b2Settings, 
	b2Mat22             = Box2D.Common.Math.b2Mat22, 
	b2EdgeChainDef      = Box2D.Collision.Shapes.b2EdgeChainDef, 
	b2EdgeShape         = Box2D.Collision.Shapes.b2EdgeShape, 
	b2WorldManifold     = Box2D.Collision.b2WorldManifold;

//max speed = 10 mps for higher velocity
b2Settings.b2_maxTranslation = 10.0;
b2Settings.b2_maxRotation = 50.0;

var EPSILON = 0.0000000001,
    CLOCKWISE = 1,
    COUNTERCLOCKWISE = -1,
    CONCAVE = -1,
    CONVEX = 1;

var Box2d =  {};

Box2d.create_poly = function(_position, _points, _options, _body){
	var fix_def  = new b2FixtureDef,
		complex  = false;
	if (_options === undefined)
		_options = {};
	if (_body==undefined){
		var body_def = new b2BodyDef();
		body_def.position.Set(0, 0);
		body_def.linearDamping  = (_options.linearDamping===undefined) ? .0 : _options.linearDamping;
		body_def.angularDamping = (_options.angularDamping===undefined) ? .0 : _options.angularDamping;
		body_def.fixedRotation  = (_options.fixedRotation===undefined) ? false : _options.fixedRotation;
		body_def.type           = (_options.type===undefined) ? b2Body.b2_dynamicBody : _options.type;
		var _body = World.CreateBody(body_def);
	} 
	if (this.Math.ClockWise(_points) === CLOCKWISE)
		_points.reverse();
	if (this.Math.Convex(_points) === CONCAVE)
		complex = true;
	
	fix_def.shape = new b2PolygonShape();
	fix_def.density         = (_options.density===undefined) ? 1.0 : _options.density;
	fix_def.friction        = (_options.friction===undefined) ? 1.0 : _options.friction;
	fix_def.restitution     = (_options.restitution===undefined) ? .0 : _options.restitution;
	fix_def.userData        = (_options.userData===undefined) ? null : _options.userData;
	
	if (complex) {
		var tmp = this.Math.process(_points);
		if (tmp != null) {
			for (i = 0; i < tmp.length; i = i + 3) {
				fix_def.shape.SetAsArray(new Array(tmp[i], tmp[i + 1], tmp[i + 2]));
				_body.CreateFixture(fix_def);
			}
		} 
	} else {
		fix_def.shape.SetAsArray(_points, _points.length);
		_body.CreateFixture(fix_def);
	}	
	return _body;
}

Box2d.create_box = function(_position, _size, _options, _body){	
	var fix_def = new b2FixtureDef;
	fix_def.shape = new b2PolygonShape();
	if (_options === undefined)
		_options = {};
	if (_body==undefined){
		var body_def = new b2BodyDef();
		body_def.position.Set(_position.x, _position.y);
		body_def.linearDamping  = (_options.linearDamping===undefined) ? .0 : _options.linearDamping;
		body_def.angularDamping = (_options.angularDamping===undefined) ? .0 : _options.angularDamping;
		body_def.fixedRotation  = (_options.fixedRotation===undefined) ? false : _options.fixedRotation;
		body_def.type           = (_options.type===undefined) ? b2Body.b2_dynamicBody : _options.type;
		var _body = World.CreateBody(body_def);
	}
	fix_def.shape.SetAsBox(_size.width, _size.height);
	fix_def.density         = (_options.density===undefined) ? 1.0 : _options.density;
	fix_def.friction        = (_options.friction===undefined) ? 1.0 : _options.friction;
	fix_def.restitution     = (_options.restitution===undefined) ? .0 : _options.restitution;
	fix_def.userData        = (_options.userData===undefined) ? null : _options.userData;
	var f = _body.CreateFixture(fix_def);
	return _body;
}

Box2d.create_circle = function(_position, _radius, _options, _body){	
	var fix_def = new b2FixtureDef;	
	fix_def.shape = new b2CircleShape();
	if (_options === undefined)
		_options = {};
	if (_body==undefined){
		var body_def = new b2BodyDef();
		body_def.position.Set(_position.x, _position.y);
		body_def.linearDamping  = (_options.linearDamping===undefined) ? .0 : _options.linearDamping;
		body_def.angularDamping = (_options.angularDamping===undefined) ? .0 : _options.angularDamping;
		body_def.fixedRotation  = (_options.fixedRotation===undefined) ? false : _options.fixedRotation;
		body_def.type           = (_options.type===undefined) ? b2Body.b2_dynamicBody : _options.type;
		var _body = World.CreateBody(body_def);
	} else
		fix_def.shape.SetLocalPosition(_position);
	fix_def.shape.m_radius = _radius;	
	fix_def.density         = (_options.density===undefined) ? 1.0 : _options.density;
	fix_def.friction        = (_options.friction===undefined) ? 1.0 : _options.friction;
	fix_def.restitution     = (_options.restitution===undefined) ? .0 : _options.restitution;
	fix_def.userData        = (_options.userData===undefined) ? null : _options.userData;
	var f = _body.CreateFixture(fix_def);
	return _body;
}

Box2d.create_body = function(_position, _options){
	if (_options === undefined)
		_options = {};
	var body_def = new b2BodyDef();	
	body_def.position.Set(_position.x, _position.y);
	body_def.linearDamping  = (_options.linearDamping===undefined) ? .0 : _options.linearDamping;
	body_def.angularDamping = (_options.angularDamping===undefined) ? .0 : _options.angularDamping;
	body_def.fixedRotation  = (_options.fixedRotation===undefined) ? false : _options.fixedRotation;
	body_def.type           = (_options.type===undefined) ? b2Body.b2_dynamicBody : _options.type;
	var b = World.CreateBody(body_def);
	return b;
}

Box2d.create_joint = function(_param){
	if (_param.type=='weld'){
		var joint_def = new b2WeldJointDef();
		joint_def.referenceAngle = 0;
	}else if (_param.type=='revolute'){
		var joint_def = new b2RevoluteJointDef();
		if (!(_param.limit === undefined)){
			joint_def.enableLimit = true;
			joint_def.lowerAngle = _param.limit[0];
			joint_def.upperAngle = _param.limit[1];
		}
	}else if (_param.type=='distance'){
		var joint_def = new b2DistanceJointDef();
		joint_def.length = _param.distance
		joint_def.dampingRatio=_param.damping;
		joint_def.frequencyHz=_param.frequency;
	}
	joint_def.collideConnected = false;
	joint_def.bodyA = _param.body[0];
	joint_def.bodyB = _param.body[1];
	joint_def.localAnchorA = _param.anchor[0];
	joint_def.localAnchorB = _param.anchor[1];
	return World.CreateJoint(joint_def);
}

Box2d.GetBodyAtMouse = function(_position, includeStatic){
    var mouse_p = new b2Vec2(_position.x, _position.y);
    var aabb = new b2AABB();
    aabb.lowerBound.Set(_position.x - 0.001, _position.y - 0.001);
    aabb.upperBound.Set(_position.x + 0.001, _position.y + 0.001);
    var body = null;
    function GetBodyCallback(fixture){
        var shape = fixture.GetShape();
        if (fixture.GetBody().GetType() != b2Body.b2_staticBody || includeStatic){
            var inside = shape.TestPoint(fixture.GetBody().GetTransform(), mouse_p);             
            if (inside){
                body = fixture.GetBody();
                return false;
            }
        }
        return true;
    }
    World.QueryAABB(GetBodyCallback, aabb);
    return body;
}



b2Body.prototype.ApplyAngularImpulse = function(impulse) {
    if (this.IsAwake() == false){
       this.SetAwake(true);
    }
   this.m_angularVelocity += this.m_invI * impulse;
};

Box2d.Math = {};

Box2d.Math.process = function(contour) {
  var result = [],
      n = contour.length,
      verts = [],
      v,
      nv = n,
      m,
      count = 2 * nv; 
  if (n < 3) {
    return null;
  }
  if (0.0 < this.area(contour)) {
    for (v = 0; v < n; v++) {
      verts[v] = v;
    }
  } else {
    for (v = 0; v < n; v++) {
      verts[v] = (n - 1) - v;
    }
  }
  for (m = 0, v = nv - 1; nv > 2;) {
    if (0 >= (count--)) {
      return null;
    }
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
    if (this.snip(contour, u, v, w, nv, verts)) {
      var a, b, c, s, t;
      a = verts[u];
      b = verts[v];
      c = verts[w];
      result.push(contour[a]);
      result.push(contour[b]);
      result.push(contour[c]);
      m++;
      for (s = v, t = v + 1; t < nv; s++, t++) {
        verts[s] = verts[t];
      }
      nv--;
      count = 2 * nv;
    }
  }
  return result;
}

Box2d.Math.area = function (contour) {
  var n = contour.length,
      a = 0.0;
  for (var p = n - 1, q = 0; q < n; p = q++) {
    a += contour[p].x * contour[q].y - contour[q].x * contour[p].y;
  }
  return a * 0.5;
}

Box2d.Math.insideTriangle = function (ax, ay, bx, by, cx, cy, px, py){
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

Box2d.Math.snip = function (contour, u, v, w, n, verts){
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
    if ((p == u) || (p == v) || (p == w)) {
      continue;
    }
    px = contour[verts[p]].x
    py = contour[verts[p]].y
    if (this.insideTriangle(ax, ay, bx, by, cx, cy, px, py)) {
      return false;
    }
  }
  return true;
}

Box2d.Math.ClockWise = function (p){
  var i, j, k, z,
      count = 0,
      n = p.length;
  if (n < 3) {
    return (0);
  }
  for (i = 0; i < n; i++) {
    j = (i + 1) % n;
    k = (i + 2) % n;
    z  = (p[j].x - p[i].x) * (p[k].y - p[j].y);
    z -= (p[j].y - p[i].y) * (p[k].x - p[j].x);
    if (z < 0) {
      count--;
    } else if (z > 0) {
      count++;
    }
  }
  if (count > 0) {
    return (COUNTERCLOCKWISE);
  } else if (count < 0) {
    return (CLOCKWISE);
  } else {
    return (0);
  }
}

Box2d.Math.Convex = function (p){
  var i, j, k, z,
      flag = 0,
      n = p.length;

  if (n < 3) {
    return (0);
  }
  for (i = 0; i < n; i++) {
    j = (i + 1) % n;
    k = (i + 2) % n;
    z  = (p[j].x - p[i].x) * (p[k].y - p[j].y);
    z -= (p[j].y - p[i].y) * (p[k].x - p[j].x);
    if (z < 0) {
      flag |= 1;
    } else if (z > 0) {
      flag |= 2;
    }
    if (flag === 3) {
      return (CONCAVE);
    }
  }
  if (flag !== 0) {
    return (CONVEX);
  } else {
    return (0);
  }
}