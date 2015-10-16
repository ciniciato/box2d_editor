var physic_object = {
	body: function(_args){
		var _args     = (_args == undefined) ? {} : _args;
		this.owner = (_args.owner == undefined) ? null : _args.owner;
		this.type = 'body';

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

		this.render = function(scale){
		};

		this.paste = function(){
			var copy = new physic_object.body();
			copy.properties = {
				name: this.properties.name,
				type: this.properties.type,
				linearDamping: this.properties.linearDamping,
				angularDamping: this.properties.angularDamping,
				fixedRotation: this.properties.fixedRotation
			}; 
			return copy;
		};
	},
	shape: function(_args){
		var _args     = (_args == undefined) ? {} : _args;
		this.owner = (_args.owner == undefined) ? null : _args.owner;
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
				fixtures: ''
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
		    	setaabb(this.rpoints.last());
				if (this.cpoints[k+1] != undefined)
		    		for (var t = 0.0; t <= 1.00001; t += threshold) {
		    			this.rpoints.push(utils.bezierInterpolation(t, this.cpoints[k].point, this.cpoints[k], 
		    							this.cpoints[k+1], this.cpoints[k+1].point));
				    	//remove duplicate points and nearer points, convert to minimun unity(0.1 cm) 
				    	this.rpoints.last().x = utils.round(this.rpoints.last().x, 100);
				    	this.rpoints.last().y = utils.round(this.rpoints.last().y, 100);
		    			setaabb(this.rpoints.last());
						this.rpoints = this.rpoints.removeDuplicates();
		    		}
	    	};
	    	//triangulation
	    	this.isComplex = false;
			if (utils.clockwise(this.points) === CLOCKWISE)
				this.rpoints.reverse();
			if (utils.convex(this.rpoints) === CONCAVE){
				this.fpoints = utils.process(this.rpoints);
				this.isComplex = (this.fpoints == null) ? null : true;
				if (this.fpoints == null) this.fpoints = [];
			} else {
				this.fpoints = this.rpoints;
			}		
			//remove 'if', it must have owner
			if (this.owner != undefined)
				this.owner.parent.object.update();				 
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
			ctx.lineWidth = 2;
			ctx.fillStyle = 'rgba(255, 198, 0, .7)';
			ctx.strokeStyle = 'rgba(0, 0, 0, .7)';
			ctx.beginPath();
			//Render shape countor
			for (var k = 0; k < this.rpoints.length; k++){
				ctx.lineTo(this.rpoints[k].x * repos,
			    			this.rpoints[k].y * repos)
			}
			for (var k = 0; k < this.fpoints.length && this.isComplex; k += 3)
				if (this.fpoints[k+2]!=undefined){
					ctx.moveTo(this.fpoints[k].x * repos,
						 		     	 this.fpoints[k].y * repos);
					ctx.lineTo(this.fpoints[k+1].x * repos,
						 		     	 this.fpoints[k+1].y * repos);
					ctx.lineTo(this.fpoints[k+2].x * repos,
						 		     	 this.fpoints[k+2].y * repos);
					ctx.lineTo(this.fpoints[k].x * repos,
						 		     	 this.fpoints[k].y * repos);
				}
			ctx.stroke();
			ctx.fill();
		};

		this.paste = function(){
			var copy = new physic_object.shape({});
			copy.properties = {
				name: this.properties.name,
				density: this.properties.density,
				friction: this.properties.friction,
				restitution: this.properties.restitution,
				threshold: this.properties.threshold,
				fixtures: this.properties.fixtures
			}; 
			for (var i = 0; i < this.points.length; i++){
				copy.points.push({x: this.points[i].x, y: this.points[i].y})
			}
			for (var i = 0; i < this.cpoints.length; i++){
				copy.cpoints.push({x: this.cpoints[i].x, y: this.cpoints[i].y, point: copy.points[Math.floor(i/2)]})
			}
			copy.update();
			return copy;
		};
	}
}