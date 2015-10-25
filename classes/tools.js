var Tools = {
	_prev: null, //previous tool
	selected: null,
	set: function(id){
		if (this.selected !== this[id]){
			if (this.selected != null)
				this.selected.onChange(id);
			this._prev = this.selected;
			this.selected = this[id];
			this.selected.init();
		}
	},
	prev: function(){
		this.selected = this._prev;
		if (this.selected != null)
			this.selected.init();
	},
	onClick: function(){
		if (this.selected != undefined)
			this.selected.onClick();
	},
	onMove: function(){
		if (this.selected != undefined)
			this.selected.onMove();
	},
	onUp: function(){
		if (this.selected != undefined)
			this.selected.onUp();
	},
	onKeyDown: function(e){
		if (e.keyCode == Keys.SPACE)
			this.set('scroll');
		if (this.selected != undefined)
			return this.selected.onKeyDown(e);
	},
	onKeyUp: function(e){
		if (this.selected != undefined)
			this.selected.onKeyUp(e);
	},
	render: function(_args){
		if (this.selected != undefined)
			this.selected.render(_args);
	},
	update: function(){
		
	}
};

//Apply zoom to anchor points, see photoshop tool and remake
Tools.pen = {
	name: 'Pen',
	selectedPoints: [],
	shape: function () { return (Control.panels.objectList.selectedChild != undefined) ? Control.panels.objectList.selectedChild.link : null; },
	properties: {
		points      : true,
		fixtures    : true,
		newBody     : false,
		threshold   : .05,
		restitution : .1,
		friction    : 1,
		density     : 1
	},
	init : function(){
		//Pointer.setCursor('none');
	},
	onClick: function(){
		if (this.shape() == null || (this.shape().type == 'shape' && this.shape().isClosed && this.properties.newBody && !this.shape().parent.GUI.onClick())){
			Control.objectList.addBody().addShape({
						properties: {
									threshold: this.properties.threshold,
									restitution: this.properties.restitution,
									friction: this.properties.friction,
									density: this.properties.density								
								}
			}).GUI.onClick();
			this.shape().addPoint(Pointer.relativePosition);
		}else if (this.shape().type == 'body' || (this.shape().type == 'shape' && this.shape().isClosed && !this.shape().parent.GUI.onClick())){
			this.shape().addShape({
						properties: {
									threshold: this.properties.threshold,
									restitution: this.properties.restitution,
									friction: this.properties.friction,
									density: this.properties.density								
								}
			}).GUI.onClick();
			this.shape().addPoint(Pointer.relativePosition);
		} else if (this.shape().type == 'shape'){ 
				this.shape().addPoint(Pointer.relativePosition);
				var points = this.shape().cpoints;
				//Select bezier anchors to selected points, so you can move then
				this.selectedPoints = [];
				this.selectedPoints.push(points.last());
				this.selectedPoints.push(points.last(1));
		}
	},
	onMove: function(){
		if (this.shape() != null && this.shape().type == 'shape'){//Magnetic points
			this.shape().points.every(
				function(item){
					if (Pointer.isIntersected({position: item, size: {width: .001*World.scale*Camera.scale, height: .001*World.scale*Camera.scale}})){
						Pointer.relativePosition.x = item.x;
						Pointer.relativePosition.y = item.y;
						return false;
					} else
						return true;
				}
			);
		}
		if (this.selectedPoints.length > 0){
			if (this.selectedPoints.length == 2 && this.selectedPoints[0].point != undefined){
				this.selectedPoints[0].x = Pointer.relativePosition.x; 
				this.selectedPoints[0].y = Pointer.relativePosition.y;
				var dx = this.selectedPoints[0].x - this.selectedPoints[0].point.x, 
					dy = this.selectedPoints[0].y - this.selectedPoints[0].point.y;
				this.selectedPoints[1].x = this.selectedPoints[0].point.x - dx; 
				this.selectedPoints[1].y = this.selectedPoints[0].point.y - dy;
			} else {
				for (var i = 0; i < this.selectedPoints.length; i++){
					this.selectedPoints[i].x = Pointer.relativePosition.x; 
					this.selectedPoints[i].y = Pointer.relativePosition.y;
				}
			}
			this.shape().update();
		}
	},
	onUp: function(){
		this.selectedPoints = [];
	},
	onKeyDown: function(e){
		if (e.keyCode == Keys.BACKSPACE){
			var obj = this.shape();
			obj.removePoint(obj.points.last());
		}
	},
	onKeyUp: function(e){
	},
	render: function(_args){
		if (this.shape() != null && this.shape().type == 'shape'){;
			var ctx = _args.ctx, repos = _args.repos, obj = this.shape();
			ctx.lineWidth = 1;
			ctx.strokeStyle = 'rgba(255, 255, 255, 1)';
			ctx.beginPath();
			//bezier curves and points
			obj.cpoints.forEach(
				function(item, index, array){
					if (index % 2 == 0){
						ctx.moveTo(item.point.x * repos, item.point.y * repos);
						ctx.arc(item.point.x * repos, item.point.y * repos, 5, 0, 2*Math.PI);						
					}
					ctx.moveTo(item.point.x * repos, item.point.y * repos);
					ctx.lineTo(item.x * repos, item.y * repos);
					ctx.moveTo(item.x * repos, item.y * repos);
					ctx.arc(item.x * repos, item.y * repos, 5, 0, 2*Math.PI);
				}
			);
			//points along the curves
			if (this.properties.points)
				obj.rpoints.forEach(
					function(item, index, array){
						ctx.moveTo(item.x * repos, item.y * repos);
						ctx.arc(item.x * repos, item.y * repos, 1, 0, 2*Math.PI);
					}
				);
			ctx.stroke();	
			//fixtures
			if (this.properties.fixtures && obj.isComplex){
				ctx.strokeStyle = 'rgba(255, 255, 255, .1)';
				ctx.beginPath();	
				obj.fpoints.forEach(
					function(item, index, array){
						ctx.lineTo(item.x * repos, item.y * repos);
						if (array[index + 1] != undefined && (index + 1) % 3 == 0)
							ctx.moveTo(array[index + 1].x * repos, array[index + 1].y * repos);
					}
				);	
				ctx.stroke();
			}
		}
	},
	update: function(){
	},
	onChange: function(){
	}
};

//Change center resize
Tools.transform = {
	name: 'Transform',
	option: 'default',
	hasChanged: false,
	points: {nw: {x: null, y: null}, n: {x: null, y: null}, ne: {x: null, y: null}, e: {x: null, y: null}, 
				se: {x: null, y: null}, s: {x: null, y: null},  sw: {x: null, y: null}, w: {x: null, y: null}},//anchors points to resize
	origin: {x: null, y: null},
	size  : {width: null, height: null},
	scale : {x: 1, y: 1},
	_selected: null,
	shape: function () { 
		if (Control.panels.objectList.selectedChild != undefined){
			if (!(Control.panels.objectList.selectedChild.link === this._selected) && this._selected !== null)
				this.onChange();
			this._selected = Control.panels.objectList.selectedChild.link;
			return this._selected;
		} else 
			return null;
	},
	apply: function(){
		this._selected.resize(this.scale);	
		this.reset_properties();
		Control.panels.toolsProperties.transform.load(); 
		this.hasChanged = false;
		this.update();		
	},
	properties: {
		width : 1,
		height: 1,
		rotate: 0
	},
	reset_properties: function(){
		this.scale = {x: 1, y: 1};
		this.properties = {
			width: 1,
			height: 1,
			rotate: 0,
		};
	},
	init : function(){
		Pointer.setCursor('default');
	},
	onClick: function(){
	},
	onChange: function(){
		if (this.hasChanged)
			if (confirm("Apply the transformation?"))
				this.apply();	
			else{
				this._selected.update();
				this.reset_properties();
				Control.panels.toolsProperties.transform.load(); 
				this.hasChanged = false;
			}
	},
	onMove: function(){
		if (this.shape()){
			this.update();
			if (Pointer.isDown && this.option != 'default'){
				if (Pointer.hasMoved){
					if (this.option == 'move'){//move
						var dif = Pointer.resetDrag();
						this.shape().set_origin({
								x: this.origin.x - dif.x,
								y: this.origin.y - dif.y});
						this.shape().resize_render(this.scale);	
					} else if (this.option.indexOf('resize') > -1){
						var distx  = -utils.getSignal(Pointer.dragPosition.x - this.origin.x) * (this.origin.x - Pointer.relativePosition.x);
						var disty  = -utils.getSignal(Pointer.dragPosition.y - this.origin.y) * (this.origin.y - Pointer.relativePosition.y);
						if (this.option == 'e-resize' || this.option == 'w-resize')
							this.scale.x = utils.round(distx / this.size.width, 100);
						else if (this.option == 's-resize' || this.option == 'n-resize')
							this.scale.y = utils.round(disty / this.size.height, 100);
						else {
							this.scale.y = utils.round(disty / this.size.height, 100);
							this.scale.x = utils.round(distx / this.size.width, 100);
						}
						if (this.properties.width != this.scale.x || this.properties.height != this.scale.y){
							Control.panels.toolsProperties.transform.load(); 
							this.properties.width = this.scale.x;
							this.properties.height = this.scale.y;
							this.shape().resize_render(this.scale);	
						}
					}
				}
			} else {
				var flag = false;
				for (var property in this.points) 
				    if (this.points.hasOwnProperty(property)){
						if (flag = Pointer.isIntersected({position: this.points[property], size: {width: .05, height: .05}})){
						    this.option = property+'-resize';
							break;
						}
				    }
				if (!flag)
					if (Pointer.isIntersected({position: this.origin, 
							size: {width: this.size.width * Math.abs(this.scale.x),
									height: this.size.height * Math.abs(this.scale.y)} }))
						this.option = 'move';
					else
						this.option = 'default';
				Pointer.setCursor(this.option);
			}
		}
	},
	onUp: function(){
	},
	onKeyDown: function(e){
		if (e.keyCode == Keys.ENTER){
			this.apply();
		}
	},
	onKeyUp: function(key){
	},
	render: function(_args){
		if (this.shape()){
			this.update();
			var ctx = _args.ctx, repos = _args.repos;
			ctx.lineWidth = 1;
			if (this.hasChanged)
				ctx.strokeStyle = 'rgba(255, 255, 255, 1)';
			else
				ctx.strokeStyle = 'rgba(255, 255, 255, .2)';
			ctx.beginPath();
			ctx.rect((this.origin.x - this.size.width * this.scale.x) * repos , 
						(this.origin.y - this.size.height * this.scale.y) * repos, 
						this.size.width * 2 * repos * this.scale.x, 
						this.size.height * 2 * repos * this.scale.y);
			ctx.stroke();
			ctx.beginPath();
			ctx.strokeStyle = 'rgba(255, 255, 255, 1)';
			for (var property in this.points) 
			    if (this.points.hasOwnProperty(property))
					ctx.rect(this.points[property].x * repos - 5, this.points[property].y * repos - 5, 10, 10);
			ctx.stroke();		
		}
	},
	update: function(){
		if (this.shape()){
			this.scale.x = this.properties.width;
			this.scale.y = this.properties.height;
			this.hasChanged = (this.scale.x != 1 || this.scale.y != 1);
			this.origin  = this.shape().get_origin();
			this.size    = this.shape().get_size();
			this.shape().resize_render(this.scale);	
			
			this.points.nw.x = this.origin.x - this.size.width * Math.abs(this.scale.x); 
			this.points.nw.y = this.origin.y - this.size.height * Math.abs(this.scale.y);
			
			this.points.n.x = this.origin.x; 
			this.points.n.y = this.origin.y - this.size.height * Math.abs(this.scale.y);

			this.points.ne.x = this.origin.x + this.size.width * Math.abs(this.scale.x); 
			this.points.ne.y = this.origin.y - this.size.height * Math.abs(this.scale.y);

			this.points.e.x  = this.origin.x + this.size.width * Math.abs(this.scale.x);
			this.points.e.y  = this.origin.y;

			this.points.se.x = this.origin.x + this.size.width * Math.abs(this.scale.x); 
			this.points.se.y = this.origin.y + this.size.height * Math.abs(this.scale.y);

			this.points.s.x = this.origin.x;
			this.points.s.y	= this.origin.y + this.size.height * Math.abs(this.scale.y);

			this.points.sw.x = this.origin.x - this.size.width * Math.abs(this.scale.x);
			this.points.sw.y = this.origin.y + this.size.height * Math.abs(this.scale.y);

			this.points.w.x  = this.origin.x - this.size.width * Math.abs(this.scale.x);
			this.points.w.y	 = this.origin.y;
		}
	}
}

Tools.scroll = {
	name: 'Scroll',
	init : function(){ 
		Pointer.setCursor('grab');
		Pointer.setCursor('-webkit-grab');
	},
	onClick: function(){
		Pointer.setCursor('grabbing');
		Pointer.setCursor('-webkit-grabbing');
	},
	onMove: function(){
		if (Pointer.isDown && Pointer.hasMoved)
			Camera.move(Pointer.resetDrag());	
	},
	onUp: function(){
		Pointer.setCursor('grab');
		Pointer.setCursor('-webkit-grab');
	},
	onKeyDown: function(e){
	},
	onKeyUp: function(e){
		if (e.keyCode == Keys.SPACE)
			Tools.prev();
	},
	render: function(_args){	
	},
	update: function(){
	},
	onChange: function(){
	}
}


Tools.movePhysic = {
	name: 'movePhysic',
	joint: false, 
	getBodyAtMouse: function(){
	    var aabb = new b2AABB();
	    aabb.lowerBound.Set(Pointer.relativePosition.x - 0.001, Pointer.relativePosition.y - 0.001);
	    aabb.upperBound.Set(Pointer.relativePosition.x + 0.001, Pointer.relativePosition.y + 0.001);
	    var body = null;
	    function GetBodyCallback(fixture){
	        if (fixture.GetBody().GetType() != b2Body.b2_staticBody && fixture.GetShape().TestPoint(fixture.GetBody().GetTransform(), {x: Pointer.relativePosition.x, y: Pointer.relativePosition.y})){
                body = fixture.GetBody();
                return false;
	        }      
	        return true;
	    }	     
	    World.QueryAABB(GetBodyCallback, aabb);
	    return body;
	}, 
	init : function(){
		Pointer.setCursor('grab');
		Pointer.setCursor('-webkit-grab');
	},
	onClick: function(){
		Pointer.setCursor('grabbing');
		Pointer.setCursor('-webkit-grabbing');
	},
	onMove: function(){
		if(Pointer.isDown && !this.joint && (body = this.getBodyAtMouse())){
            var def = new b2MouseJointDef();                 
            def.bodyA  = debugDraw.bodies[0];
            def.bodyB  = body;
            def.target = {x: Pointer.relativePosition.x, y: Pointer.relativePosition.y};                 
            def.collideConnected = true;
            def.maxForce = 100 * body.GetMass();
            def.dampingRatio = 0;                 
            this.joint = World.CreateJoint(def);                 
            body.SetAwake(true);
        }
		if(this.joint)
            this.joint.SetTarget({x: Pointer.relativePosition.x, y: Pointer.relativePosition.y});
	},
	onUp: function(){
		if (this.joint){
            World.DestroyJoint(this.joint);
            this.joint = false;
        }
		Pointer.setCursor('grab');
		Pointer.setCursor('-webkit-grab');
	},
	onKeyDown: function(e){
	},
	onKeyUp: function(key){
	},
	render: function(_args){	
	},
	update: function(){
	},
	onChange: function(id){
		if (id != 'scroll'){
			for (var i = 0; i < debugDraw.bodies.length; i++)
				World.DestroyBody(debugDraw.bodies[i]);
			debugDraw.bodies = [];
			debugDraw.isRunning = false;
		}
	}
}

Tools.selectPoints = {
	name: 'Select points',
	selectedPoints: [],
	hasSelected: false,
	shape: function () { return (Control.panels.objectList.selectedChild != undefined) ? Control.panels.objectList.selectedChild.link : null; },
	properties: {
	},
	init : function(){
		this.selectedPoints = [];
	},
	onClick: function(){
		if (this.hasSelected && !Keys.list[Keys.CTRL]){
			this.hasSelected = false;
			this.selectedPoints = [];
		}
	},
	onMove: function(){
		var that = this;
		if (this.hasSelected && Keys.list[Keys.CTRL] && Pointer.isDown && Pointer.hasMoved){
			this.selectedPoints.forEach(function (item, index, array) {
				var dif  = (Pointer.dragPosition.x - Pointer.relativePosition.x)
				item.x  -= (Pointer.dragPosition.x - Pointer.relativePosition.x); 
				item.y  -= (Pointer.dragPosition.y - Pointer.relativePosition.y);
				var cInd = that.shape().points.indexOf(item) * 2;
				that.shape().cpoints[cInd].x -= (Pointer.dragPosition.x - Pointer.relativePosition.x); 
				that.shape().cpoints[cInd].y  -= (Pointer.dragPosition.y - Pointer.relativePosition.y);
				that.shape().cpoints[cInd + 1].x -= (Pointer.dragPosition.x - Pointer.relativePosition.x); 
				that.shape().cpoints[cInd + 1].y  -= (Pointer.dragPosition.y - Pointer.relativePosition.y);
			});			
			Pointer.dragPosition.x = Pointer.relativePosition.x; 
			Pointer.dragPosition.y = Pointer.relativePosition.y;
			this.shape().update();

		} else if (!this.hasSelected && Pointer.isDown){		
			var sqWidth = Math.abs(Pointer.dragPosition.x - Pointer.relativePosition.x)/2,
				sqHeight = Math.abs(Pointer.dragPosition.y - Pointer.relativePosition.y)/2,
				center = { x: (Pointer.dragPosition.x + Pointer.relativePosition.x) / 2,
					       y: (Pointer.dragPosition.y + Pointer.relativePosition.y) / 2};
			this.selectedPoints.forEach(function (item, index, array) {
				if (!utils.intersectedSquare({x: center.x, y: center.y, size: {height: sqHeight, width:sqWidth}}, item))
					array.splice(index, 1);
			});
			this.shape().points.forEach(function (item, index, array) {
				if (utils.intersectedSquare({x: center.x, y: center.y, size: {height: sqHeight, width:sqWidth}} , item))
					if (that.selectedPoints.indexOf(item) < 0)
						that.selectedPoints.push(item);
			});
		}
	},
	onUp: function(){
		if (this.selectedPoints.length > 0 && !this.hasSelected)
			this.hasSelected = true
	},
	onKeyDown: function(e){
		if (e.keyCode == Keys.DELETE && this.selectedPoints.length > 0){
			var that = this;
			this.selectedPoints.forEach(
				function(item){
					that.shape().removePoint(item);
				}
			);
			this.selectedPoints = [];
			return true;
		} else
			return false;
	},
	onKeyUp: function(key){
	},
	render: function(_args){
		var ctx = _args.ctx, repos = _args.repos;
		ctx.lineWidth = 1;
		ctx.strokeStyle = 'rgba(255, 255, 255, 1)';
		ctx.beginPath();
		if (!this.hasSelected && Pointer.isDown){
			ctx.rect(Pointer.dragPosition.x * repos, Pointer.dragPosition.y * repos, 
					(Pointer.relativePosition.x - Pointer.dragPosition.x) * repos, (Pointer.relativePosition.y - Pointer.dragPosition.y) * repos);
		}	
		if (this.selectedPoints.length > 0){
			for (var i = 0; i < this.selectedPoints.length; i++){
				ctx.moveTo(this.selectedPoints[i].x * repos,
									 this.selectedPoints[i].y * repos);
				ctx.arc(this.selectedPoints[i].x * repos,
						 		  this.selectedPoints[i].y * repos, 5, 0, 2*Math.PI);				
			}
		}
		ctx.stroke();	
	},
	update: function(){
	},
	onChange: function(){
	}
}


Tools.polygon = {
	name: 'Polygon',
	isDrawing: false,
	angle: 0,
	radius: 0,
	points: [],
	properties: {
		sides       : 3,
		newBody     : false,
		threshold   : .05,
		restitution : 0,
		friction    : 1,
		density     : 1
	},
	init : function(){
	},
	onClick: function(){
		if (!this.isDrawing){
			for (var i = 0; i < this.properties.sides; i++)
				this.points[i] = {x: Pointer.relativePosition.x, y: Pointer.relativePosition.y};
			this.isDrawing = true;
		}
	},
	onMove: function(){
		if (this.isDrawing){
			this.angle =  Pointer.getAngle(Pointer.dragPosition);
			this.radius = Pointer.getDistance(Pointer.dragPosition);
			var that = this;
			this.points.forEach(
				function(item, index, array){
					var ang = (Math.PI * 2) / that.properties.sides * index + that.angle;	
					item.x = Pointer.dragPosition.x + that.radius * Math.cos(ang);
					item.y = Pointer.dragPosition.y + that.radius * Math.sin(ang);
				}
			);
		}
	},
	onUp: function(){
		if (this.isDrawing){//Create polygon
			if (this.radius * World.scale * Camera.scale > 10){
				var selectedItem = Control.panels.objectList.selectedChild;
				if (this.properties.newBody || selectedItem == null){
					var shape = Control.objectList.addBody().addShape({
								properties: {
											threshold: this.properties.threshold,
											restitution: this.properties.restitution,
											friction: this.properties.friction,
											density: this.properties.density								
										}
					}); 
				}else if (selectedItem.link.type == 'shape'){
					var shape = selectedItem.link.parent.addShape({
								properties: {
											threshold: this.properties.threshold,
											restitution: this.properties.restitution,
											friction: this.properties.friction,
											density: this.properties.density								
										}
					}); 
				}else if (selectedItem.link.type == 'body'){
					var shape = selectedItem.link.addShape({
								properties: {
											threshold: this.properties.threshold,
											restitution: this.properties.restitution,
											friction: this.properties.friction,
											density: this.properties.density								
										}
					}); 
				}
				shape.isClosed = true;
				this.points.forEach(
					function(item, index, array){
						shape.addPoint(item);				
					}
				);
				shape.addPoint(this.points[0]);		
				shape.GUI.onClick();
			}
			this.isDrawing = false;
			this.points    = [];
			this.angle     = 0;
			this.radius    = 0;	
		}
	},
	onKeyDown: function(e){
	},
	onKeyUp: function(key){
	},
	render: function(_args){
		if (this.isDrawing){
			var ctx = _args.ctx, repos = _args.repos;
			ctx.lineWidth = 1;
			ctx.strokeStyle = 'rgba(255, 255, 255, 1)';
			ctx.beginPath();
			this.points.forEach(
				function(item, index, array){
					ctx.lineTo(item.x * repos, item.y * repos);
					ctx.arc(item.x * repos,	item.y * repos, 5, 0, 2*Math.PI);
					ctx.moveTo(item.x * repos, item.y * repos);				
				}
			);
			ctx.lineTo(this.points[0].x * repos, this.points[0].y * repos);
			ctx.stroke();	
		}	
	},
	update: function(){
	},
	onChange: function(){
	}
}
/*

Tools.transform = {
	name: '',
	cursor: 'move',
	type: 'transform',//required for properties panel
	shape: function () { return Objects_list.selected; },
	properties: {
		width: '.05'
	},
	init : function(){
	},
	onClick: function(){
	},
	onMove: function(){
	},
	onUp: function(){
	},
	onKeyDown: function(e){
	},
	onKeyUp: function(key){
	},
	render: function(_args){
		var ctx = _args.ctx, repos = _args.repos;
		ctx.lineWidth = 2;
		ctx.fillStyle = 'rgba(255, 198, 0, .7)';
		ctx.strokeStyle = 'rgba(0, 0, 0, .7)';
		ctx.beginPath();
		ctx.stroke();		
	},
	update: function(){
	},
	onChange: function(){
	}
}
*/