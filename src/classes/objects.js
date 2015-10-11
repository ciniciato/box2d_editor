
var Objects = {
	body: function(_id, _args){
		this.ind  = _id;
		this.name = 'body_'+_args.id;
		this.type = 'body';
		this.elem = null;
		this.children = [];

		this.aabb = {x: 0, y: 0, xf: 0, yf: 0};
		this.angle  = 0;
		this.origin = {x: 0, y: 0};
		this.scale = {x: 1, y: 1};

		var elem = document.getElementById('lst_objects'),
		    node = document.createElement('li');      
        node.id = this.name;    
        node.innerHTML = '<strong class="title" onclick="debugDraw.objects.select('+_id+');">'+this.name+
        				 '</strong><ul class="list" id="lst_'+this.name+'">';
        
        this.elem = elem.appendChild(node);
        this.elem_child = document.getElementById('lst_'+this.name);

		this.properties = [];
		this.properties.push({name:'name', val:this.name}); 
		this.properties.push({name:'type', val: 'dynamic'}); 
		this.properties.push({name:'linearDamping', val: '0'}); 
		this.properties.push({name:'angularDamping', val: '0'}); 
		this.properties.push({name:'fixedRotation', val: 'false'}); 

		this.property = function(_prop){
			for (var i = 0; i < this.properties.length; i++)
				if (this.properties[i].name == _prop){
					return this.properties[i];
					break;
				}
		}
	},
	shape: function(_id, _args){
		this.ind  = _id;
		this.name = _args.type+'_'+_args.id;
		this.type = 'shape';
		this.category = _args.type;
		this.elem = null;
		this.parent = _args.parent;
		this.parent.children.push(this.ind);
		this.children = [];
		this.complex  = false;
		this.isClosed = false;//true if is a closed polygon, last point == first point

		this.angle  = 0;
		this.aabb = {x: 0, y: 0, xf: 0, yf: 0};
		this.scale = {x: 1, y: 1};

		this.points = [];
		this.cpoints = [];//corner points
		this.rpoints = [];//render points
		this.fpoints = [];//fixture points
		this.add_point = function(point){				
			this.points.push({x: point.x,
							   y: point.y});
			this.cpoints.push({x: point.x,
							   y: point.y,
							   point: this.points[this.points.length-1]});	
			this.cpoints.push({x: point.x,
							   y: point.y,
							   point: this.points[this.points.length-1]});
			this.update();
		}

		this.points.push(_args.origin);
		this.origin = {x: _args.origin.x, y: _args.origin.y};
		this.cpoints.push({x: _args.origin.x,
						   y: _args.origin.y,
						   point: this.points[this.points.length-1]});	
		this.cpoints.push({x: _args.origin.x,
						   y: _args.origin.y,
						   point: this.points[this.points.length-1]});	

		var elem = _args.parent.elem_child,
		    node = document.createElement('li');      
        node.id = this.name;    
        node.innerHTML = '<span class="title">'+this.name+'</span>';
        node.onclick =  function(){ 
            debugDraw.objects.select(_id);                    
        };    

        this.elem = elem.appendChild(node);
		this.properties = [];
		this.properties.push({name:'name',        val: this.name}); 
		this.properties.push({name:'type',        val: _args.type});
		this.properties.push({name:'threshold',   val: '.05'});
		this.properties.push({name:'simplify',    val: '10000'});
		this.properties.push({name:'thick', 	  val: '0'});
		this.properties.push({name:'density',     val: '1'}); 
		this.properties.push({name:'friction',    val: '1'}); 
		this.properties.push({name:'restitution', val: '0'});
		this.properties.push({name:'fixtures'   , val: '0'});

		this.property = function(_prop){
			for (var i = 0; i < this.properties.length; i++)
				if (this.properties[i].name == _prop){
					return this.properties[i];
					break;
				}
		}

		this.update = function(){
			var that = this;
			function setaabb(ind){
		    	that.aabb.x  = (that.aabb.x < that.rpoints[ind].x && that.aabb.x != null) ? 
		    					that.aabb.x : that.rpoints[ind].x;
				that.aabb.xf = (that.aabb.xf > that.rpoints[ind].x && that.aabb.xf != null) ? 
								that.aabb.xf : that.rpoints[ind].x;
				that.aabb.y  = (that.aabb.y < that.rpoints[ind].y && that.aabb.y != null) ? 
								that.aabb.y : that.rpoints[ind].y;
				that.aabb.yf = (that.aabb.yf > that.rpoints[ind].y && that.aabb.yf != null) ? 
								that.aabb.yf : that.rpoints[ind].y;
			}
			//getting properties
			var threshold = parseFloat(this.property('threshold').val),
				simplify = parseFloat(this.property('simplify').val);
			//clear all acessories points[renderer, fixture]
			this.rpoints = [];
			this.fpoints = [];
			//bezier interpolation and aabb setting
			this.aabb.y  = null;
			this.aabb.yf = null;
			this.aabb.x  = null;
			this.aabb.xf = null;
			for (var k = 1; k < this.cpoints.length; k += 2){
				if (this.cpoints[k+1] != undefined)
	    			if ((this.cpoints[k].point.x == this.cpoints[k].x && this.cpoints[k].point.y == this.cpoints[k].y) &&
	    					(this.cpoints[k+1].point.x == this.cpoints[k+1].x && this.cpoints[k+1].point.y == this.cpoints[k+1].y)){
	    				this.rpoints.push({x: this.cpoints[k].point.x, y: this.cpoints[k].point.y});
	    				setaabb(this.rpoints.length-1);
	    				this.rpoints.push({x: this.cpoints[k+1].point.x, y: this.cpoints[k+1].point.y});
	    				setaabb(this.rpoints.length-1);
	    			} 
	    			else
			    		for (var t = 0.0; t <= 1.00001; t += threshold) {
			    			newpoint =  {x: bezierInterpolation(t, this.cpoints[k].point.x, this.cpoints[k].x, 
			    							this.cpoints[k+1].x, this.cpoints[k+1].point.x),
			    						 y: bezierInterpolation(t, this.cpoints[k].point.y, this.cpoints[k].y, 
			    							this.cpoints[k+1].y, this.cpoints[k+1].point.y)};
			    			if (this.rpoints[this.rpoints.length-2] != undefined && (t + threshold < 1)){
				    			var pb = this.rpoints[this.rpoints.length-1],
				    				pa = this.rpoints[this.rpoints.length-2];
				    			if (Math.round(((pa.y - pb.y)*newpoint.x + (pb.x - pa.x)*newpoint.y + pa.x*pb.y - pb.x*pa.y)*simplify)/simplify == 0)
				    				this.rpoints.splice(this.rpoints.length-1, 1);
			    			}
			    			this.rpoints.push(newpoint);
	    					setaabb(this.rpoints.length-1);
			    		}
	    	}
	    	//remove duplicate points
			this.rpoints = this.rpoints.removeDuplicates();
	    	//triangulation
	    	this.complex = false;
			if (Box2d.Math.ClockWise(this.rpoints) === CLOCKWISE)
				this.rpoints.reverse();
			if (Box2d.Math.Convex(this.rpoints) === CONCAVE){
				this.fpoints = Box2d.Math.process(this.rpoints);
				this.complex = (this.fpoints == null) ? null : true;
				if (this.fpoints == null) this.fpoints = [];
				this.property('fixtures').val = Math.round(this.fpoints.length/3);
			} else{
				this.property('fixtures').val = 1;
				this.fpoints = this.rpoints;
			}
			var elem = $("#div_properties #properties_shape #field_fixtures");
   			elem.val(this.property('fixtures').val);

			this.origin = {x: (this.aabb.x + this.aabb.xf) / 2,
							y: (this.aabb.y + this.aabb.yf) / 2};

			//define points based on scale and redifine aabb			
			if (this.scale.x != 1 || this.scale.y != 1){
				var midpoint = {x: (this.aabb.xf + this.aabb.x) / 2,
								y: (this.aabb.yf + this.aabb.y) / 2};

				this.aabb.y  = null;
				this.aabb.yf = null;
				this.aabb.x  = null;
				this.aabb.xf = null;

				for (var i = 0; i < this.rpoints.length; i++){
					this.rpoints[i].x = midpoint.x + (this.rpoints[i].x - midpoint.x) * this.scale.x;
					this.rpoints[i].y = midpoint.y + (this.rpoints[i].y - midpoint.y) * this.scale.y;
					this.aabb.x  = (this.aabb.x < this.rpoints[i].x && this.aabb.x != null) ? this.aabb.x : this.rpoints[i].x;
					this.aabb.xf = (this.aabb.xf > this.rpoints[i].x && this.aabb.xf != null) ? this.aabb.xf : this.rpoints[i].x;
					this.aabb.y  = (this.aabb.y < this.rpoints[i].y && this.aabb.y != null) ? this.aabb.y : this.rpoints[i].y;
					this.aabb.yf = (this.aabb.yf > this.rpoints[i].y && this.aabb.yf != null) ? this.aabb.yf : this.rpoints[i].y;
				}
			}							 
		}

		this.updatescale = function(){
			var midpoint = {x: (this.aabb.xf + this.aabb.x) / 2,
							y: (this.aabb.yf + this.aabb.y) / 2};
			for (var i = 0; i < this.cpoints.length; i++){
				this.cpoints[i].x = midpoint.x + (this.cpoints[i].x - midpoint.x) * this.scale.x;
				this.cpoints[i].y = midpoint.y + (this.cpoints[i].y - midpoint.y) * this.scale.y;
				if (this.points[i] != undefined){
					this.points[i].x = midpoint.x + (this.points[i].x - midpoint.x) * this.scale.x;
					this.points[i].y = midpoint.y + (this.points[i].y - midpoint.y) * this.scale.y;
				}
			}
			this.scale.x = 1;
			this.scale.y = 1;
		}

		this.drawfixtures = function(repos){
			debugDraw.ctx.lineWidth = 2;
			debugDraw.ctx.strokeStyle = 'rgba(133, 86, 212, .7)';
			debugDraw.ctx.fillStyle = 'rgba(133, 86, 212, .3)';
			for (var k = 0; k < this.fpoints.length; k += 3)
				if (this.fpoints[k+2]!=undefined){
					debugDraw.ctx.beginPath();
					debugDraw.ctx.moveTo(this.fpoints[k].x * repos,
						 		     	 this.fpoints[k].y * repos);
					debugDraw.ctx.lineTo(this.fpoints[k+1].x * repos,
						 		     	 this.fpoints[k+1].y * repos);
					debugDraw.ctx.lineTo(this.fpoints[k+2].x * repos,
						 		     	 this.fpoints[k+2].y * repos);
					debugDraw.ctx.lineTo(this.fpoints[k].x * repos,
						 		     	 this.fpoints[k].y * repos);
					debugDraw.ctx.stroke();
				}
		} 

		this.drawcontour = function(repos, points){
			debugDraw.ctx.lineWidth = 1;
			debugDraw.ctx.beginPath();
			debugDraw.ctx.fillStyle = 'rgba(255, 198, 0, .7)';
			debugDraw.ctx.strokeStyle = 'rgba(0, 0, 0, .7)';
			for (var k = 0; k < points.length; k ++){
				debugDraw.ctx.lineTo(points[k].x * repos,
			    	 		     	 points[k].y * repos);
			}
			if (this.isClosed)
				debugDraw.ctx.lineTo(points[0].x * repos,
			    	 		     	 points[0].y * repos);
			if (this.complex == false || this.complex == true)
				debugDraw.ctx.fill();
			debugDraw.ctx.stroke();
		}

		this.draw = function(repos){
	    	debugDraw.ctx.lineCap = "round";
			debugDraw.ctx.lineJoin = "round";
			debugDraw.ctx.lineWidth = 6;
			this.drawcontour(repos, this.rpoints);
			
			if (debugDraw.objects.selected() === this){
				//if (this.complex)
					//this.drawfixtures(repos);
			}
			
		}
	},
	joint: {
	}
}

debugDraw.objects = {
	list: [],
	_selected: null,
	selected: function(val){
		if (val == undefined)
			return this.list[this._selected];
		else
			this._selected = parseFloat(val);
	},
	select: function(_ind){
		if (this.selected() != null){
			this.selected().elem.className = '';
		}
		this.selected(_ind);
		this.selected().elem.className = 'selected';
		
		var elem = $("#div_properties #properties_"+this.selected().type);

   		$("#div_properties").children().hide();
   		elem.show();
   		for (var i = 0; i < this.selected().properties.length; i++){
   			var prop = this.selected().properties[i];
   			elem = $("#div_properties #properties_"+this.selected().type+" #field_"+prop.name);
   			elem.val(prop.val);
   		}

	},
	add: function(_obj, _args){
		var args = (_args == undefined) ? {} : _args;
		args.id = 0;
		if (args.parent != undefined){
			for (var i = 0; i < args.parent.children.length; i++){
				if (this.list[args.parent.children[i]].type==_obj)
					args.id++;
			}
		} else{
			for (var i = 0; i < this.list.length; i++){
				if (this.list != null)
					if (this.list[i].type === _obj)
						args.id++;
			}
		}
		this.list.push(new Objects[_obj](this.list.length, args));
		this.select(this.list.length-1);
	},
	delete: function(_ind){
		for (var i = 0; i < this.list[_ind].children.length; i++){
			this.list[this.list[_ind].children[i]].elem.remove();
			this.list[this.list[_ind].children[i]] = null;			
		}
		if (this.list[_ind].parent != null){
			for (var i = 0; i < this.list[_ind].parent.children.length; i++){
				if (this.list[_ind].parent.children[i] == this.list[_ind].ind){
					this.list[_ind].parent.children.splice(i, 1);
					break;
				}
			}
		}
		this.list[_ind].elem.remove();
		this.list[_ind] = null;
		this._selected = null;
	},
	clear: function(){
		this.list = [];
   		$("#div_properties").children().hide();
	},
	draw: function(){
		var repos = (World.scale * debugDraw.Camera.scale);
		for (var i = 0; i < this.list.length; i++){
			if (this.list[i] != null)
				if (this.list[i].type=='shape'){
					this.list[i].draw(repos);
				} 
		}
	}
}