var physic_object = {
	body: function(_args){
		this.type = 'body';

		//transform properties
		this.aabb   = {x: null, y: null, xf: null, yf: null};
		this.angle  = 0;
		this.origin = {x: 0, y: 0};
		this.scale  = {x: 1, y: 1};

		//panel/physic properties, or may derivate from owner
		this.properties = {
			name: 'body',
			type: 'dynamic',
			linearDamping: '0',
			angularDamping: '0',
			fixedRotation: 'false'
		}; 

		this.render = function(){
		};

		this.paste = function(){
			var copy = new Objects.body();
			copy.properties = {
				name: this.properties.name,
				type: this.properties.type,
				linearDamping: this.properties.linearDamping,
				angularDamping: this.properties.angularDamping,
				fixedRotation: this.properties.fixedRotation
			}; 
			return copy;
		}
	},
	shape: function(_args){
		this.type = 'shape';

		//transform properties
		this.aabb   = {x: null, y: null, xf: null, yf: null};
		this.angle  = 0;
		this.origin = {x: 0, y: 0};
		this.scale  = {x: 1, y: 1};

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
			this.points.push({ x: point.x,
							   y: point.y});
			this.cpoints.push({x: point.x,
							   y: point.y,
							   point: this.points[this.points.length-1]});	
			this.cpoints.push({x: point.x,
							   y: point.y,
							   point: this.points[this.points.length-1]});
			this.update();
		};

		this.update = function(){
			//getting properties
			var threshold = parseFloat(this.properties.threshold);
			//clear all acessories points[renderer, fixture]
			this.rpoints = [];
			this.fpoints = [];
			//bezier interpolation
			for (var k = 1; k < this.cpoints.length; k += 2){
				if (this.cpoints[k+1] != undefined)
		    		for (var t = 0.0; t <= 1.00001; t += threshold) {
		    			newpoint =  bezierInterpolation(t, this.cpoints[k].point, this.cpoints[k], 
		    							this.cpoints[k+1], this.cpoints[k+1].point);
		    			this.rpoints.push(newpoint);	
		    		}
	    	};
	    	//remove duplicate points
			this.rpoints = this.rpoints.removeDuplicates();
	    	//triangulation
	    	this.isComplex = false;
			if (Box2d.Math.ClockWise(this.rpoints) === CLOCKWISE)
				this.rpoints.reverse();
			if (Box2d.Math.Convex(this.rpoints) === CONCAVE){
				this.fpoints = Box2d.Math.process(this.rpoints);
				this.complex = (this.fpoints == null) ? null : true;
				if (this.fpoints == null) this.fpoints = [];
			} else {
				this.fpoints = this.rpoints;
			}						 
		};

		this.render = function(_args){
			var ctx = _args.ctx, repos = _args.repos;
			ctx.lineWidth = 2;
			ctx.beginPath();
			ctx.fillStyle = 'rgba(255, 198, 0, .7)';
			ctx.strokeStyle = 'rgba(0, 0, 0, .7)';
			//Render shape countor
			for (var k = 0; k < this.rpoints.length; k++){
				ctx.lineTo(this.rpoints[k].x * repos,
			    			this.rpoints[k].y * repos);
			}
			ctx.stroke();
		};

		this.paste = function(){
			var copy = new Objects.shape({});
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