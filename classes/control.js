var Control = {
	panels: { 
		objectList: {

		},
		properties: {
			wrap: {}
		}
	},
	objectList: {
		children: [],
		buff: null,
		addBody: function(_body){//physic_objects
			var body =  (_body == undefined) ? new physic_object.body() : _body;
				body.GUI = Control.panels.objectList.addBody().do(
						function (that){
							that.link = body;
							that.onClick();
						}
					);

			body.parent = this;

			body.id = (this.children.length > 0) ? (this.children.last().id+1) : 0;

			body.addShape = function(_args){
				var shape =  (_args.shape == undefined) ? new physic_object.shape({properties: _args.properties}) : _args.shape;
				shape.parent = this;
				
				shape.GUI = this.GUI.addShape();
				shape.GUI.link = shape;
				
				shape.id = (this.children.length > 0) ? (this.children.last().id+1) : 0;

				shape.paste = function(){
					var copy = new physic_object.shape();
					copy.properties = {
						name: this.properties.name,
						density: this.properties.density,
						friction: this.properties.friction,
						restitution: this.properties.restitution,
						threshold: this.properties.threshold,
						fixtures: this.properties.fixtures
					}; 
					for (var i = 0; i < this.points.length; i++)
						copy.points.push({x: this.points[i].x, y: this.points[i].y});
					for (var i = 0; i < this.cpoints.length; i++)
						copy.cpoints.push({x: this.cpoints[i].x, y: this.cpoints[i].y, point: copy.points[Math.floor(i/2)]});

					if (Control.panels.objectList.selectedChild.link.type == 'body'){
						Control.panels.objectList.selectedChild.link.addShape({shape: copy});
					} else if (Control.panels.objectList.selectedChild.link.type == 'shape'){
						Control.panels.objectList.selectedChild.owner.onClick();
						Control.panels.objectList.selectedChild.link.addShape({shape: copy});
					}
					copy.GUI.onClick();
					copy.update();
					return copy;
				}

				this.children.push(shape);
				return shape;				
			}

			body.paste = function(){	
				var newBody = new physic_object.body();
				newBody.properties = {
					name: this.properties.name,
					type: this.properties.type,
					linearDamping: this.properties.linearDamping,
					angularDamping: this.properties.angularDamping,
					fixedRotation: this.properties.fixedRotation
				}; 
				newBody = Control.objectList.addBody(newBody);
				for (var i = 0; i < this.children.length; i++){
					this.children[i].paste();
				}
				newBody.GUI.onClick();
			}
			
			this.children.push(body);
			return body;
		},
		setId: function(_args){//type, parent
			if (_args.parent == undefined) _args.parent = this;
			var ind = 0;
			for (var i = 0; i < _args.parent.children.length; i++)
				if (_args.parent.children[i].type == _args.type)
					ind++;
			return ind;
		},
		getChildIndex: function(_child){
			for (var i = 0; i < _child.parent.children.length && _child.parent.children[i].id !== _child.id; i++){}
			return (i == _child.parent.children.length && i != 0) ? null : i;
		},
		getChild: function(_args){//id, parent
			if (_args.parent == undefined) _args.parent = this;
			for (var i = 0; i < _args.parent.children.length && _args.parent.children[i].id != _args.id; i++){}
			return (i == _args.parent.children.length) ? null : _args.parent.children[i];
		},
		render: function(_args){//repos, ctx
			for (var i = 0; i < this.children.length; i++){
				this.children[i].render(_args);
			}
		}
	}
}

Control.init = function(){
	Camera.init();
	Keys.init();
	Pointer.init();
	debugDraw.init();

	this.panels.toolbar    = document.getElementById('toolbar');
	this.panels.workspace  = document.getElementById('workspace');

	this.panels.toolsProperties    = GUI._list['Properties tools'];
	this.panels.toolsProperties.pen    = GUI._list['Properties tools']._list['Pen properties'];
	this.panels.toolsProperties.transform   = GUI._list['Properties tools']._list['Transform properties'];
	
	this.panels.control    = GUI.findChildren({property: 'name', value: 'Control panel'});
	this.panels.objectList = GUI.findChildren({property: 'name', value: 'Object list'});
	this.panels.objectList.resize = function(){
		this.elem.style.display = 'none';
		this.elem.style.height =  Control.panels.workspace.getBoundingClientRect().height - Control.panels.control.elem.getBoundingClientRect().height +'px';
		this.elem.style.display = 'block';
	}

	this.panels.properties.wrap  = GUI.findChildren({property: 'name', value: 'Object properties'});
	this.panels.properties.body  = GUI.findChildren({property: 'name', value: 'Body properties', parent: this.panels.properties.wrap});
	this.panels.properties.shape = GUI.findChildren({property: 'name', value: 'Shape properties', parent: this.panels.properties.wrap});

	this.adjustPanels();
}

Control.update = function(){
}

Control.adjustPanels = function(){//Automatize this!
	Control.panels.objectList.resize();
	Camera.resize();
}

Control.render = function(){
	Camera.update();
	Camera.clear();	
	var repos = (World.scale * Camera.scale);
	if (!debugDraw.isRunning){
		//Grid.render({ctx: Camera.ctx, repos: repos});
		this.objectList.render({ctx: Camera.ctx, repos: repos});
		Tools.render({ctx: Camera.ctx, repos: repos});
		Pointer.render({ctx: Camera.ctx, repos: repos});
	}
	debugDraw.render();
}

var Grid = {
	cellsize: 5,
	squaresize: 1
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
			return (i % (step * that.squaresize) == 0);
		}
		for (var i = reset; i < end; i += step){
			if (strongerline(i)){
				ctx.stroke();
				ctx.lineWidth = 1;
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
				ctx.lineWidth = .5;
				ctx.beginPath(); 
			}
		}
	}
	ctx.strokeStyle = 'rgba(255, 255, 255, .4)';
	ctx.lineWidth = .5;
	ctx.beginPath();
	lines('horizontal');
	lines('vertical');
	ctx.stroke();
}

debugDraw = new b2DebugDraw();
debugDraw.bodies = [];

debugDraw.isRunning = false;
debugDraw.prevTool = '';

debugDraw.init = function(){
	this.SetSprite(Camera.ctx);
	this.SetDrawScale(World.scale * Camera.scale);
	this.SetFillAlpha(.5);
	this.SetLineThickness(.5);
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
		if (this.prevTool != '')
			GUI._list.Toolbar._list[this.prevTool].onClick();
	} else {
		if (Tools.selected != null)
			this.prevTool = Tools.selected.name;
		Tools.set('movePhysic');
		this.isRunning = true;
		this.create();
	}
}

debugDraw.create = function(){
	//used in mouse joint
	this.bodies.push(Box2d.create_body({x: 0, y: 0},
                                     {           type: b2Body.b2_staticBody,
                                       angularDamping: 0,
                                        linearDamping: 0,
                                        fixedRotation: true}));
    for (var k = 0; k < Control.objectList.children.length; k++){
    	var obj = Control.objectList.children[k], origin = obj.get_origin();
    	obj.update();
        this.bodies.push(Box2d.create_body(origin,
                                     {           type: (obj.properties.type=='static') ? b2Body.b2_staticBody : b2Body.b2_dynamicBody,
                                       angularDamping: parseFloat(obj.properties.angularDamping),
                                        linearDamping: parseFloat(obj.properties.linearDamping),
                                        fixedRotation: (obj.properties.fixedRotation=='true') ? true : false }));
        for (var i = 0; i < Control.objectList.children[k].children.length; i++){
        	obj = Control.objectList.children[k].children[i];
        	obj.update();
           	var rpoints = obj.rpoints.removeDuplicates();
            var points = [];
            for (var c = 0; c < rpoints.length; c++)
                points.push({ x: -origin.x + rpoints[c].x ,
                              y: -origin.y + rpoints[c].y});
            Box2d.create_poly(points, 
                    {restitution: parseFloat(obj.properties.restitution),
                         density: parseFloat(obj.properties.density),
                        friction: parseFloat(obj.properties.friction)}, this.bodies.last());
        }
    }
}