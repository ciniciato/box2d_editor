var Tools = {
	prev: null,
	selected: null,
	set: function(id){
		if (this.selected !== this[id]){
			this.selected = this[id];
			this.prev = id;
			Camera.canvas.style.cursor = this[id].cursor;
			this.selected.init();
		}
	},
	onclick: function(){
		if (this.selected != undefined)
			this.selected.onclick();
	},
	onmove: function(){
		if (this.selected != undefined)
			this.selected.onmove();
	},
	onup: function(){
		if (this.selected != undefined)
			this.selected.onup();
	},
	onkeydown: function(e){
		if (this.selected != undefined)
			this.selected.onkeydown(e);
	},
	onkeyup: function(e){
		if (this.selected != undefined)
			this.selected.onkeyup(e);
	},
	render: function(_args){
		if (this.selected != undefined)
			this.selected.render(_args);
	},
	update: function(){
		
	}
};

Tools.pen = {
	that: Tools,
	cursor: 'none',
	type: 'pen',//required for properties panel
	selectedpoints: [],
	shape: function () { return Objects_list.selected; },
	properties: {
		threshold: '.05',
		restitution: '0',
		friction: '1',
		density: '1'
	},
	init : function(){
	},
	onclick: function(){
		if (this.shape() == null){
			Objects_list.select(Objects_list.add_item(new object.body()).add_item(new object.shape({
					properties: {
									threshold: this.properties.threshold,
									restitution: this.properties.restitution,
									friction: this.properties.friction,
									density: this.properties.density								
								}
					})).id);
			this.shape().object.add_point({x: Pointer.rX, y: Pointer.rY});
		} else if (this.shape().object.type == 'body'){
			Objects_list.select(this.shape().add_item(new object.shape({
					properties: {
									threshold: this.properties.threshold,
									restitution: this.properties.restitution,
									friction: this.properties.friction,
									density: this.properties.density								
								}
					})).id);
			this.shape().object.add_point({x: Pointer.rX, y: Pointer.rY});
		} else if (this.shape().object.type == 'shape'){
			this.shape().object.add_point({x: Pointer.rX, y: Pointer.rY});
			var points = this.shape().object.cpoints;
			//Select bezier anchors to selected points, so you can move then
			this.selectedpoints = [];
			this.selectedpoints.push(points[points.length - 1]);
			this.selectedpoints.push(points[points.length - 2]);
		}
	},
	onmove: function(){
		if (this.selectedpoints.length > 0){
			if (this.selectedpoints.length == 2 && this.selectedpoints[0].point != undefined){
				this.selectedpoints[0].x = Pointer.rX; 
				this.selectedpoints[0].y = Pointer.rY;
				var dx = this.selectedpoints[0].x - this.selectedpoints[0].point.x, 
					dy = this.selectedpoints[0].y - this.selectedpoints[0].point.y;
				this.selectedpoints[1].x = this.selectedpoints[0].point.x - dx; 
				this.selectedpoints[1].y = this.selectedpoints[0].point.y - dy;
			} else {
				this.selectedpoints[0].x = debugDraw.Pointer.rX; 
				this.selectedpoints[0].y = debugDraw.Pointer.rY;
				for (var i = 1; i < this.selectedpoints.length; i++){
					this.selectedpoints[i].x = this.selectedpoints[i].old.x - (Pointer.DragX - Pointer.rX); 
					this.selectedpoints[i].y = this.selectedpoints[i].old.y - (Pointer.DragY - Pointer.rY);
				}
			}
			this.shape().object.update();
		}
	},
	onup: function(){
		this.selectedpoints = [];
	},
	onkeydown: function(e){
	},
	onkeyup: function(key){
	},
	render: function(_args){
		var ctx = _args.ctx, repos = _args.repos;
		ctx.lineWidth = 2;
		ctx.fillStyle = 'rgba(255, 198, 0, .7)';
		ctx.strokeStyle = 'rgba(0, 0, 0, .7)';
		ctx.beginPath();
		if (this.shape() != null && this.shape().object.type == 'shape'){
			//bezier curves and points
			for (var k = 0; k < this.shape().object.cpoints.length; k++){
				if (this.shape().object.points[k] != undefined){
					ctx.moveTo(this.shape().object.points[k].x * repos,
										 this.shape().object.points[k].y * repos);
					ctx.arc(this.shape().object.points[k].x * repos,
							 		  this.shape().object.points[k].y * repos, 5, 0, 2*Math.PI);
				}
				ctx.moveTo(this.shape().object.cpoints[k].point.x * repos,
									 this.shape().object.cpoints[k].point.y * repos);
				ctx.lineTo(this.shape().object.cpoints[k].x * repos,
			 			 		  	 this.shape().object.cpoints[k].y * repos);
				ctx.moveTo(this.shape().object.cpoints[k].x * repos,
			 			 		  	 this.shape().object.cpoints[k].y * repos);
				ctx.arc(this.shape().object.cpoints[k].x  * repos,
					 		      this.shape().object.cpoints[k].y * repos, 5, 0, 2*Math.PI);
			}
		}
		ctx.stroke();
	},
	update: function(){
		
	}
};