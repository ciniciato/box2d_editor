
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
		this.complex = false;

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
		this.points.push(_args.origin)
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
		this.properties.push({name:'simplify',    val: '100'});
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
			var threshold = parseFloat(this.property('threshold').val),
				simplify = parseFloat(this.property('simplify').val);
			this.rpoints = [];
			this.fpoints = [];
			//bezier interpolation
			for (var k = 1; k < this.cpoints.length; k += 2){
				if (this.cpoints[k+1] != undefined)
	    			if ((this.cpoints[k].point.x == this.cpoints[k].x && this.cpoints[k].point.y == this.cpoints[k].y) &&
	    					(this.cpoints[k+1].point.x == this.cpoints[k+1].x && this.cpoints[k+1].point.y == this.cpoints[k+1].y)){
	    				this.rpoints.push({x: this.cpoints[k].point.x, y: this.cpoints[k].point.y});
	    				this.rpoints.push({x: this.cpoints[k+1].point.x, y: this.cpoints[k+1].point.y});
	    			} 
	    			else
			    		for (var t = 0.0; t <= 1.00001; t += threshold) {
			    			newpoint =  {x: Math.round(bezierInterpolation(t, this.cpoints[k].point.x, this.cpoints[k].x, 
			    							this.cpoints[k+1].x, this.cpoints[k+1].point.x)*100)/100,
			    						 y: Math.round(bezierInterpolation(t, this.cpoints[k].point.y, this.cpoints[k].y, 
			    							this.cpoints[k+1].y, this.cpoints[k+1].point.y)*100)/100};
			    			if (this.rpoints[this.rpoints.length-2] != undefined && (t + threshold < 1)){
				    			var pb = this.rpoints[this.rpoints.length-1],
				    				pa = this.rpoints[this.rpoints.length-2];
				    			if (Math.round(((pa.y - pb.y)*newpoint.x + (pb.x - pa.x)*newpoint.y + pa.x*pb.y - pb.x*pa.y)*simplify)/simplify == 0)
				    				this.rpoints.splice(this.rpoints.length-1, 1);
			    			}
			    			this.rpoints.push(newpoint);
			    		}
	    	}
			this.rpoints = this.rpoints.removeDuplicates();
	    	//triangulation
	    	this.complex = false;
			if (Box2d.Math.ClockWise(this.rpoints) === CLOCKWISE)
				this.rpoints.reverse();
			if (Box2d.Math.Convex(this.rpoints) === CONCAVE){
				this.complex = true;
				this.fpoints = Box2d.Math.process(this.rpoints);
				if (this.fpoints == null) this.fpoints = [];
				this.property('fixtures').val = Math.round(this.fpoints.length/3);
			} else{
				this.property('fixtures').val = 1;
				this.fpoints = this.rpoints;
			}
		}

		this.drawfixtures = function(repos){
			debugDraw.ctx.lineWidth = 3;
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
					debugDraw.ctx.fill();
				}
		} 

		this.drawcontour = function(repos, points){
			debugDraw.ctx.lineWidth = 2;
			debugDraw.ctx.beginPath();
			debugDraw.ctx.fillStyle = 'rgba(255, 198, 0, .7)';
			debugDraw.ctx.strokeStyle = 'rgba(0, 0, 0, .7)';
			for (var k = 0; k < points.length; k ++){
				debugDraw.ctx.lineTo(points[k].x * repos,
			    	 		     	 points[k].y * repos);
					debugDraw.ctx.arc(points[k].x * repos,
						 		  points[k].y * repos, 2, 0, 2*Math.PI);
			}
			if (debugDraw.objects.selected() !== this || this.complex == false)
				debugDraw.ctx.fill();
			debugDraw.ctx.stroke();
		}

		this.drawvectorpoints = function(repos){
			debugDraw.ctx.lineWidth = 6;
			debugDraw.ctx.strokeStyle = 'rgba(0, 0, 0, .7)';
			for (var k = 0; k < this.points.length; k++){
				debugDraw.ctx.beginPath();
				debugDraw.ctx.arc(this.points[k].x * repos,
						 		  this.points[k].y * repos, 5, 0, 2*Math.PI);
				debugDraw.ctx.stroke();
			}
			for (var k = 0; k < this.cpoints.length; k++){
				debugDraw.ctx.beginPath();
				debugDraw.ctx.moveTo(this.cpoints[k].point.x * repos,
									this.cpoints[k].point.y * repos);
				debugDraw.ctx.lineTo(this.cpoints[k].x * repos,
						 		  	this.cpoints[k].y * repos);
				debugDraw.ctx.stroke();
			}
			debugDraw.ctx.strokeStyle = 'rgba(255, 198, 0, .7)';
			for (var k = 0; k < this.cpoints.length; k++){
				debugDraw.ctx.beginPath();
				if ((this.cpoints[k].x != this.cpoints[k].point.x) ||
					(this.cpoints[k].y != this.cpoints[k].point.y))
					debugDraw.ctx.arc(this.cpoints[k].x * repos,
						 		  this.cpoints[k].y * repos, 5, 0, 2*Math.PI);
				debugDraw.ctx.stroke();
			}
		}

		this.draw = function(repos){
	    	debugDraw.ctx.lineCap = "round";
			debugDraw.ctx.lineJoin = "round";
			debugDraw.ctx.lineWidth = 6;
			if (debugDraw.objects.selected() === this){
				if (this.complex)
					this.drawfixtures(repos);
				this.drawvectorpoints(repos);
			}
			this.drawcontour(repos, this.rpoints);
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