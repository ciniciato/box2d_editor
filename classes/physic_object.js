var physic_object = {
	body: function(_args){
		this.type = 'body';
		this.children = [];

		//transform properties
		this.aabb   = {x: null, y: null, xf: null, yf: null};
		this.angle  = 0;

		//panel/physic properties, or may derivate from owner
		this.properties = {
			name: 'body',
			type: 'dynamic',
			linearDamping: '0',
			angularDamping: '0',
			fixedRotation: 'false'
		}; 

		this.get_origin = function(){
			return {x: (this.aabb.x + this.aabb.xf) / 2, y: (this.aabb.y + this.aabb.yf) / 2};
		};

		this.set_origin = function(point){
		};

		this.get_size = function(){
			return {width: Math.abs(this.aabb.x - this.aabb.xf) / 2, height: Math.abs(this.aabb.y - this.aabb.yf) / 2};
		};

		this.update = function(){
			var that = this;
			this.aabb   = {x: null, y: null, xf: null, yf: null};
			function setaabb(shape){
		    	that.aabb.x  = (that.aabb.x < shape.x && that.aabb.x != null) ? 
		    					that.aabb.x : shape.x;
				that.aabb.xf = (that.aabb.xf > shape.xf && that.aabb.xf != null) ? 
								that.aabb.xf : shape.xf;
				that.aabb.y  = (that.aabb.y < shape.y && that.aabb.y != null) ? 
								that.aabb.y : shape.y;
				that.aabb.yf = (that.aabb.yf > shape.yf && that.aabb.yf != null) ? 
								that.aabb.yf : shape.yf;
			}
			for (var i = 0; i < this.owner.children.length; i++){
				setaabb(this.owner.children[i].object.aabb);
			}
		};

		this.resize_render = function(scale){
			var
				dx = this.get_origin().x,
				dy = this.get_origin().y;
			for (var i = 0; i < this.owner.children.length; i++){
				var
					px = this.owner.children[i].object.get_origin().x - dx,
					py = this.owner.children[i].object.get_origin().y - dy;
				this.owner.children[i].object.update();
				this.owner.children[i].object.resize_render(scale);
				this.owner.children[i].object.move_render({x: dx + px * scale.x, y: dy + py * scale.y});
			}
		};

		this.resize = function(scale){
			var
				dx = this.get_origin().x,
				dy = this.get_origin().y;
			for (var i = 0; i < this.owner.children.length; i++){
				var
					px = this.owner.children[i].object.get_origin().x - dx,
					py = this.owner.children[i].object.get_origin().y - dy;
				this.owner.children[i].object.set_origin({x: dx + px * scale.x, y: dy + py * scale.y});
				this.owner.children[i].object.resize(scale);
			}
		};

		this.set_origin = function(point){
			var
				dx = this.get_origin().x - point.x,
				dy = this.get_origin().y - point.y;
			for (var i = 0; i < this.owner.children.length; i++){
				var
					px = this.owner.children[i].object.get_origin().x - dx,
					py = this.owner.children[i].object.get_origin().y - dy;
				this.owner.children[i].object.set_origin({x: px, y: py});

			}
			this.update();
		}

		this.render = function(_args){
			for (var i = 0; i < this.children.length; i++){
				this.children[i].render(_args);
			}
		};
	},
	shape: function(){
		var _args     = (_args == undefined) ? {} : _args;
		this.type = 'shape';

		//transform properties
		this.aabb   = {x: null, y: null, xf: null, yf: null};
		this.angle  = 0;

		//panel/physic properties, or may derivate from owner
		if (_args.properties == undefined)
			this.properties = {
				name: 'shape',
				density: '1',
				friction: '1',
				restitution: '0',
				threshold: '0.05',
				fixtures: '0'
			}; 
		else
			this.properties = _args.properties;

		this.points = [];
		this.cpoints = [];//corner points
		this.rpoints = [];//render points
		this.fpoints = [];//fixture points

		this.isComplex  = false;//true if shape is concave
		this.isClosed = false;//true if is a closed polygon, last point == first point

		this.add_point = function(point){		
			//Convert to scale, 1px = 1cm(minimum unity)
			point = {x: utils.round(point.x, 100), y: utils.round(point.y, 100)};		
			this.points.push({ x: point.x,
							   y: point.y});
			this.cpoints.push({x: point.x,
							   y: point.y,
							   point: this.points.last()});	
			this.cpoints.push({x: point.x,
							   y: point.y,
							   point: this.points.last()});
			this.update();
		};

		this.get_origin = function(){
			return {x: (this.aabb.x + this.aabb.xf) / 2, y: (this.aabb.y + this.aabb.yf) / 2};
		}

		this.set_origin = function(point){
			var old_origin = this.get_origin();
			for (var i = 0; i < this.cpoints.length; i++){
				if (this.points[i] != undefined){
					this.points[i].x -= old_origin.x - point.x;
					this.points[i].y -= old_origin.y - point.y;
				}
				this.cpoints[i].x -= old_origin.x - point.x;
				this.cpoints[i].y -= old_origin.y - point.y;
			}
			this.update();
		}

		this.get_size = function(){
			return {width: Math.abs(this.aabb.x - this.aabb.xf) / 2, height: Math.abs(this.aabb.y - this.aabb.yf) / 2};
		}

		this.update = function(){
			var that = this;
			function setaabb(point){
		    	that.aabb.x  = (that.aabb.x < point.x && that.aabb.x != null) ? 
		    					that.aabb.x : point.x;
				that.aabb.xf = (that.aabb.xf > point.x && that.aabb.xf != null) ? 
								that.aabb.xf : point.x;
				that.aabb.y  = (that.aabb.y < point.y && that.aabb.y != null) ? 
								that.aabb.y : point.y;
				that.aabb.yf = (that.aabb.yf > point.y && that.aabb.yf != null) ? 
								that.aabb.yf : point.y;
			}
			//getting properties
			var threshold = parseFloat(this.properties.threshold);
			//clear all acessories points[renderer, fixture]
			this.rpoints = [];
			this.fpoints = [];
			this.aabb   = {x: null, y: null, xf: null, yf: null};
			//bezier interpolation
			for (var k = 1; k < this.cpoints.length; k += 2){
		    	this.rpoints.push({x: this.points[Math.floor(k/2)].x, y: this.points[Math.floor(k/2)].y});
		    	if (utils.intersectedLine_point(this.rpoints.last(1), this.rpoints.last(), this.rpoints.last(2)))
		    		this.rpoints.splice(this.rpoints.length-2, 1);
		    	setaabb(this.rpoints.last());
				if (this.cpoints[k+1] != undefined)
		    		for (var t = threshold; t <= 1 - threshold; t += threshold) {
		    			this.rpoints.push(utils.bezierInterpolation(t, this.cpoints[k].point, this.cpoints[k], 
		    							this.cpoints[k+1], this.cpoints[k+1].point));
				    	//remove duplicate points and nearer points, convert to minimun unity(0.1 cm)
				    	if (utils.intersectedLine_point(this.rpoints.last(1), this.rpoints.last(), this.rpoints.last(2)))
				    		this.rpoints.splice(this.rpoints.length-2, 1);

		    			setaabb(this.rpoints.last());
		    		}
	    	};
	    	this.rpoints = this.rpoints.removeDuplicates();
	    	//triangulation
	    	this.isComplex = false;
			if (utils.isClockwise(this.rpoints) == CLOCKWISE)
				this.rpoints.reverse();
			if (utils.isConvex(this.rpoints) == CONCAVE){
				this.fpoints = utils.process(this.rpoints);
				this.isComplex = (this.fpoints == null) ? null : true;
				if (this.fpoints == null) this.fpoints = [];
				if (parseFloat(this.properties.fixtures) != Math.round(this.fpoints.length/3)){
					this.properties.fixtures = Math.round(this.fpoints.length/3);
					Control.panels.properties.shape.findChildren({property: 'name', value: 'fixtures'}).load();//update GUI field
				}
			} else {
				if (parseFloat(this.properties.fixtures) != 1){
					this.properties.fixtures = 1;
					Control.panels.properties.shape.findChildren({property: 'name', value: 'fixtures'}).load();//update GUI field
				}
				this.fpoints = this.rpoints;
			}		
			//this.body.update();				 
		};


		this.move_render = function(point){
			var old_origin = this.get_origin();
			for (var i = 0; i < this.rpoints.length; i++){
				this.rpoints[i].x -= old_origin.x - point.x;
				this.rpoints[i].y -= old_origin.y - point.y;
			}
		} 

		this.resize_render = function(scale){
			if (scale.x != 1 || scale.y != 1){
				this.update();
				for (var i = 0; i < this.rpoints.length; i++){
					this.rpoints[i].x = this.get_origin().x + (this.rpoints[i].x - this.get_origin().x) * scale.x;
					this.rpoints[i].y = this.get_origin().y + (this.rpoints[i].y - this.get_origin().y) * scale.y;
				}
			}
		}

		this.resize = function(scale){
			for (var i = 0; i < this.cpoints.length; i++){
				if (this.points[i] != undefined){
					this.points[i].x = this.get_origin().x + (this.points[i].x - this.get_origin().x) * scale.x;
					this.points[i].y = this.get_origin().y + (this.points[i].y - this.get_origin().y) * scale.y;
				}
				this.cpoints[i].x = this.get_origin().x + (this.cpoints[i].x - this.get_origin().x) * scale.x;
				this.cpoints[i].y = this.get_origin().y + (this.cpoints[i].y - this.get_origin().y) * scale.y;
			}
			this.update();
		}

		this.render = function(_args){
			var ctx = _args.ctx, repos = _args.repos;
			ctx.lineWidth = 1;
			if (this.parent.properties.type == 'dynamic')
				ctx.fillStyle = 'rgba(255, 198, 0, .3)';
			else
				ctx.fillStyle = 'rgba(0, 198, 255, .3)';
			ctx.strokeStyle = 'rgba(255, 255, 255, .7)';
			ctx.beginPath();
			//Render shape contour
			for (var k = 0; k < this.rpoints.length; k++)
				ctx.lineTo(this.rpoints[k].x * repos,
			    			this.rpoints[k].y * repos);
			ctx.stroke();
			ctx.fill();
		};
	}
}