var Control = {
}

Control.init = function(){
	Camera.init();
	Keys.init();
	Pointer.init();
	debugDraw.init();
}

Control.update = function(){
}

Control.render = function(){
	Camera.update();
	Camera.clear();	
	var repos = (World.scale * Camera.scale);
	if (!debugDraw.isRunning){
		Grid.render({ctx: Camera.ctx, repos: repos});
		Objects_list.render({ctx: Camera.ctx, repos: repos});
		Tools.render({ctx: Camera.ctx, repos: repos});
		Pointer.render({ctx: Camera.ctx, repos: repos});
	}
	debugDraw.render();
}

var Grid = {
	cellsize: .5,
	squaresize: 5
}

//TO FIX: strongerlines when zooming
//Add to the panel
Grid.render = function(_args){
	var ctx = _args.ctx, repos = _args.repos, that = this;
	function lines(orientation){
		var pos   = (orientation == 'vertical') ? 'x' : 'y', 
			size  = (orientation == 'vertical') ? 'width' : 'height',
			end   = Camera.position[pos] + Camera.size[size],
			step  = that.cellsize/Math.round(Camera.scale),
			reset = (Camera.position[pos] - Camera.size[size]) 
					- (Camera.position[pos] - Camera.size[size]) % step;
		strongerline = function(i){
			return false;
			//return (i % (step * that.squaresize) == 0);
		}
		for (var i = reset; i < end; i += step){
			if (strongerline(i)){
				ctx.stroke();
				ctx.lineWidth = 3;
				ctx.beginPath();
			}       
			if (orientation == 'vertical'){    
				ctx.moveTo(i * repos, (Camera.position.y - Camera.size.height) * repos);
				ctx.lineTo(i * repos, (Camera.position.y + Camera.size.height * 2) * repos);
			} else{    
				ctx.moveTo((Camera.position.x - Camera.size.width) * repos, i * repos);
				ctx.lineTo((Camera.position.x + Camera.size.width * 2) * repos, i * repos);
			} 
			if (strongerline(i)){
				ctx.stroke();
				ctx.lineWidth = 1;
				ctx.beginPath(); 
			}
		}
	}
	ctx.strokeStyle = 'rgba(0, 0, 0, .4)';
	ctx.lineWidth = 1;
	ctx.beginPath();
	lines('horizontal');
	lines('vertical');
	ctx.stroke();
}

debugDraw = new b2DebugDraw();
debugDraw.bodies = [];

debugDraw.isRunning = false;

debugDraw.init = function(){
	this.SetSprite(Camera.ctx);
	this.SetDrawScale(World.scale * Camera.scale);
	this.SetFillAlpha(.7);
	this.SetLineThickness(1.0);
	this.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit);
	World.SetDebugDraw(this);
}

debugDraw.render = function(){
	if (this.isRunning){
		World.DrawDebugData();
    	World.update();
	}
}

debugDraw.run = function(){
	if (this.isRunning){
		for (var i = 0; i < this.bodies.length; i++)
			World.DestroyBody(this.bodies[i]);
		this.bodies = [];
		this.isRunning = false;
	} else {
		this.isRunning = true;
		Pointer.set_cursor('default');
		this.create();
	}
}

debugDraw.create = function(){
    for (var k = 0; k < Objects_list.children.length; k++){
    	var obj = Objects_list.children[k].object, origin = obj.get_origin();
    	obj.update();
        this.bodies.push(Box2d.create_body(origin,
                                     {           type: (obj.properties.type=='static') ? b2Body.b2_staticBody : b2Body.b2_dynamicBody,
                                       angularDamping: parseFloat(obj.properties.angularDamping),
                                        linearDamping: parseFloat(obj.properties.linearDamping),
                                        fixedRotation: (obj.properties.fixedRotation=='true') ? true : false }));
        for (var i = 0; i < Objects_list.children[k].children.length; i++){
        	obj = Objects_list.children[k].children[i].object;
        	obj.update();
            var points = [];
            for (var c = 0; c < obj.rpoints.length; c++)
                points.push({ x: -origin.x + obj.rpoints[c].x ,
                              y: -origin.y + obj.rpoints[c].y});
            Box2d.create_poly(points, 
                    {restitution: parseFloat(obj.properties.restitution),
                         density: parseFloat(obj.properties.density),
                        friction: parseFloat(obj.properties.friction)}, this.bodies.last());
        }
    }
}