debugDraw.Tools = {
	list: [],
	history: [],
	selected: null,
	selectedpoints: [],
	init: function(){
	},
	set: function(id){
		if (this.selected !== this[id]){
			this.selected = this[id];
			this.history.push(id);
			debugDraw.canvas.style.cursor = this[id].cursor;
			this.selected.set();
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
		if (e.which == debugDraw.keyboard.key.SPACE)
			this.set('scroll');
		if (this.selected != undefined)
			this.selected.onkeydown(e);
	},
	onkeyup: function(e){
		if (this.selected != undefined)
			this.selected.onkeyup(e);
	},
	draw: function(repos){
		if (this.selected != undefined)
			this.selected.draw(repos);
	}
};

debugDraw.Tools.scroll = {
	cursor: 'grab',
	set : function(){
	},
	onclick: function(){
		debugDraw.canvas.style.cursor = 'grabbing'
	},
	onmove: function(){
		if (!debugDraw.keyboard.keys[debugDraw.keyboard.key.SPACE])
			debugDraw.Tools.set(debugDraw.Tools.history[debugDraw.Tools.history.length-2]);
		else if (debugDraw.Pointer.isDown){
			var dx = debugDraw.Pointer.rX - debugDraw.Pointer.DragX; 
			var dy = debugDraw.Pointer.rY - debugDraw.Pointer.DragY; 
			debugDraw.Camera.position.x -= dx * Math.min(10, Math.pow(dx, 2) * 0.1);
			debugDraw.Camera.position.y -= dy * Math.min(10, Math.pow(dy, 2) * 0.1);
		}
	},
	onup: function(){
		debugDraw.canvas.style.cursor = 'grab'
	},
	onkeydown: function(key){
	}, 	
	onkeyup: function(key){
	},
	draw: function(){
	}
}

debugDraw.Tools.select_points = {
	cursor: 'default',
	drag: false,
	move: false,
	aabb: {x: null, xf: null, y: null, yf: null},
	shape: null,
	selectedpoints: [],
	set : function(){
		this.shape = debugDraw.objects.selected();	
		this.selectedpoints = [];
	},
	onclick: function(){
		if (this.shape !== debugDraw.objects.selected()){
			this.set();
		}
		if ((debugDraw.keyboard.keys[debugDraw.keyboard.key.CTRL])){
			this.drag = false;
			this.move = true;
		} else {
			this.selectedpoints = [];
			this.aabb.x = debugDraw.Pointer.rX;
			this.aabb.y = debugDraw.Pointer.rY;
			this.aabb.xf = debugDraw.Pointer.rX;
			this.aabb.yf = debugDraw.Pointer.rY;
			this.drag = true;
			this.move = false;
		}
	},
	onmove: function(){
		if (this.drag){
			this.aabb.xf = debugDraw.Pointer.rX;
			this.aabb.yf = debugDraw.Pointer.rY;
			var width = Math.abs(this.aabb.xf - this.aabb.x)/2,
				height = Math.abs(this.aabb.yf - this.aabb.y)/2,
				c = { x: (this.aabb.xf + this.aabb.x) / 2,
					  y: (this.aabb.yf + this.aabb.y) / 2}
			for (var i = 0; i < this.shape.points.length; i++){
				for (var k = 0; k < this.selectedpoints.length; k++){
					if (this.selectedpoints[k] === this.shape.points[i])
						break;
				}
				if (Math.abs(this.shape.points[i].x - c.x) <= width && 
					Math.abs(this.shape.points[i].y - c.y) <= height){
					if (k == this.selectedpoints.length)
						this.selectedpoints.push(this.shape.points[i]);
				} else if (k != this.selectedpoints.length)
					this.selectedpoints.splice(k, 1);
			}
		} else {
		if ((debugDraw.keyboard.keys[debugDraw.keyboard.key.CTRL] && this.move))
			if (this.selectedpoints.length > 0){
				if (debugDraw.Pointer.DragX - debugDraw.Pointer.rX != 0 &&
						debugDraw.Pointer.DragY - debugDraw.Pointer.rY != 0){
					for (var i = 0; i < this.selectedpoints.length; i++){
						this.selectedpoints[i].x -= (debugDraw.Pointer.DragX - debugDraw.Pointer.rX); 
						this.selectedpoints[i].y -= (debugDraw.Pointer.DragY - debugDraw.Pointer.rY);
						for (var k = 0; k < this.shape.cpoints.length; k++){
							if (this.shape.cpoints[k].point === this.selectedpoints[i]){
								this.shape.cpoints[k].x -= (debugDraw.Pointer.DragX - debugDraw.Pointer.rX); 
								this.shape.cpoints[k].y -= (debugDraw.Pointer.DragY - debugDraw.Pointer.rY);
							}
						}
					}
					debugDraw.Pointer.DragX = debugDraw.Pointer.rX;
					debugDraw.Pointer.DragY = debugDraw.Pointer.rY;
					this.shape.update();
				}
			}
		}
	},
	onup: function(){
		this.drag = false;
		this.move = false;
	},
	onkeydown: function(e){
		console.log(e);
		if (e.target === document.body && debugDraw.keyboard.key.DELETE == e.which){
			for (var k = 0; k < this.selectedpoints.length; k++){
				for (var i = 0; i < this.shape.cpoints.length; i++)
					if (this.shape.cpoints[i].point === this.selectedpoints[k]){
						this.shape.cpoints.splice(i, 1);
						i--;
					}
				for (var j = 0; j < this.shape.points.length; j++)
					if (this.shape.points[j] === this.selectedpoints[k]){
						this.shape.points.splice(j, 1);
						break;
					}
			}
			this.shape.update();
			this.selectedpoints = [];
		}
	}, 	
	onkeyup: function(key){
	},
	draw: function(repos){
		debugDraw.ctx.lineWidth   = 2;
		debugDraw.ctx.strokeStyle = 'rgba(0, 0, 0, .7)';
		debugDraw.ctx.fillStyle   = 'rgba(0, 0, 0, .9)';
		if (this.drag){
			debugDraw.ctx.beginPath();
			debugDraw.ctx.rect(this.aabb.x * repos, 
				               this.aabb.y * repos,
							  (this.aabb.xf - this.aabb.x) * repos, 
							  (this.aabb.yf - this.aabb.y) * repos);
			debugDraw.ctx.stroke();
		}
		//anchor points
		debugDraw.ctx.beginPath();
		for (var k = 0; k < this.selectedpoints.length; k++){
			debugDraw.ctx.moveTo(this.selectedpoints[k].x * repos + 5,
					 		     this.selectedpoints[k].y * repos);
			debugDraw.ctx.arc(this.selectedpoints[k].x * repos,
					 		  this.selectedpoints[k].y * repos, 5, 0, 2*Math.PI);
		}
		debugDraw.ctx.fill();
	}
}

debugDraw.Tools.remove_anchor_point = {
	cursor: 'none',
	shape: null,
	set : function(){
		this.shape = debugDraw.objects.selected();	
	},
	onclick: function(){
		for (var i = 0; i < this.shape.points.length; i++){
			var dx = Math.pow(this.shape.points[i].x - debugDraw.Pointer.rX, 2),
				dy = Math.pow(this.shape.points[i].y - debugDraw.Pointer.rY, 2);
			if (Math.sqrt(dx + dy) <= .1) {
				break;
			}
		}
		if (i < this.shape.points.length){
			for (var k = 0; k < this.shape.cpoints.length; k++){
				if (this.shape.cpoints[k].point === this.shape.points[i]){
					this.shape.cpoints.splice(k, 1);
					k--;
				}
			}
			this.shape.points.splice(i, 1);
			this.shape.update();
		}
	},
	onmove: function(){
	},
	onup: function(){
	},
	onkeydown: function(key){
	}, 	
	onkeyup: function(key){
	},
	draw: function(repos){
		if (this.shape != null){
			debugDraw.ctx.lineWidth   = 2;
			debugDraw.ctx.fillStyle   = 'rgba(0, 0, 0, .9)';
			//anchor points
			debugDraw.ctx.beginPath();
			for (var k = 0; k < this.shape.points.length; k++){
				debugDraw.ctx.moveTo(this.shape.points[k].x * repos,
						 		     this.shape.points[k].y * repos);
				debugDraw.ctx.arc(this.shape.points[k].x * repos,
						 		  this.shape.points[k].y * repos, 5, 0, 2*Math.PI);
			}
			debugDraw.ctx.fill();
		}
	}
}

debugDraw.Tools.transform = {
	cursor: 'default',
	shape: null,
	points: [],
	selected: null,
	midpoint: {x: 0, y: 0},
	size: {width: 0, height: 0},
	oldsize: {width: 0, height: 0},
	set : function(){
		if (this.shape != null)
			this.update();
	},
	onclick: function(){
		for (var i = 0; i < this.points.length; i++){
				var dx = Math.pow(this.points[i].x - debugDraw.Pointer.rX, 2),
					dy = Math.pow(this.points[i].y - debugDraw.Pointer.rY, 2);
				if (Math.sqrt(dx + dy) <= .1) {
					this.selected = i;
					this.midpoint   = {x: (this.shape.aabb.xf + this.shape.aabb.x) / 2,
									   y: (this.shape.aabb.yf + this.shape.aabb.y) / 2};
					this.oldsize = {width: (this.shape.aabb.xf - this.shape.aabb.x) / 2,
								   height: (this.shape.aabb.yf - this.shape.aabb.y) / 2};
					break;
				}
		}
		if (i == this.points.length && this.shape != null && debugDraw.Pointer.rX > this.shape.aabb.x && debugDraw.Pointer.rX < this.shape.aabb.xf &&
				debugDraw.Pointer.rY > this.shape.aabb.y && debugDraw.Pointer.rY < this.shape.aabb.yf){
			this.selected = -1;
		}
	},
	onmove: function(){
		for (var i = 0; i < this.points.length; i++){
				var dx = Math.pow(this.points[i].x - debugDraw.Pointer.rX, 2),
					dy = Math.pow(this.points[i].y - debugDraw.Pointer.rY, 2);
				if (Math.sqrt(dx + dy) <= .1) {
					debugDraw.Pointer.rX = this.points[i].x;
					debugDraw.Pointer.rY = this.points[i].y; 
					switch (i) {
					    case 0:
					        debugDraw.canvas.style.cursor = 'nw-resize';
					        break;
					    case 1:
					        debugDraw.canvas.style.cursor = 'sw-resize';
					        break;
					    case 2:
					        debugDraw.canvas.style.cursor = 'nw-resize';
					        break;
					    case 3:
					        debugDraw.canvas.style.cursor = 'sw-resize';
					        break;
					    case 4:
					        debugDraw.canvas.style.cursor = 'n-resize';
					        break;
					    case 5:
					        debugDraw.canvas.style.cursor = 's-resize';
					        break;
					    case 6:
					        debugDraw.canvas.style.cursor = 'e-resize';
					        break;
					    case 7:
					        debugDraw.canvas.style.cursor = 'w-resize';
					        break;
					}
					break;
				}
			}
		if (i == this.points.length){
			if (this.shape != null && debugDraw.Pointer.rX > this.shape.aabb.x && debugDraw.Pointer.rX < this.shape.aabb.xf &&
					debugDraw.Pointer.rY > this.shape.aabb.y && debugDraw.Pointer.rY < this.shape.aabb.yf)
				debugDraw.canvas.style.cursor = 'move';
			else
				debugDraw.canvas.style.cursor = 'default';
		}
		if (this.selected != null){
			if (this.selected == -1){
				if (debugDraw.Pointer.DragX - debugDraw.Pointer.rX != 0 || debugDraw.Pointer.DragY - debugDraw.Pointer.rY != 0){
					if (this.shape.points == undefined){
						for (var k = 0; k < this.shape.children.length; k++){
							var ind = this.shape.children[k], obj = debugDraw.objects.list[ind];
							for (var i = 0; i < obj.points.length; i++){
								obj.points[i].x -= debugDraw.Pointer.DragX - debugDraw.Pointer.rX;
								obj.points[i].y -= debugDraw.Pointer.DragY - debugDraw.Pointer.rY;
							}
							for (var i = 0; i < obj.cpoints.length; i++){
								obj.cpoints[i].x -= debugDraw.Pointer.DragX - debugDraw.Pointer.rX;
								obj.cpoints[i].y -= debugDraw.Pointer.DragY - debugDraw.Pointer.rY;
							}	
							obj.update();						
						}
					} else {
						for (var i = 0; i < this.shape.points.length; i++){
							this.shape.points[i].x -= debugDraw.Pointer.DragX - debugDraw.Pointer.rX;
							this.shape.points[i].y -= debugDraw.Pointer.DragY - debugDraw.Pointer.rY;
						}
						for (var i = 0; i < this.shape.cpoints.length; i++){
							this.shape.cpoints[i].x -= debugDraw.Pointer.DragX - debugDraw.Pointer.rX;
							this.shape.cpoints[i].y -= debugDraw.Pointer.DragY - debugDraw.Pointer.rY;
						}
					}	
					this.shape.update();
					this.update();
					debugDraw.Pointer.DragX = debugDraw.Pointer.rX;
					debugDraw.Pointer.DragY = debugDraw.Pointer.rY;
				}
			} 
			//width resize
			else if (this.selected == 6 || this.selected == 7){
				var dist  = (debugDraw.Pointer.DragX > this.midpoint.x) ? 
										-(this.midpoint.x - debugDraw.Pointer.rX)
										: (this.midpoint.x - debugDraw.Pointer.rX);
				this.shape.scale.x = Math.round(100 * dist / (this.oldsize.width))/100;
				this.shape.update();
				this.update();			}
			//height resize
			else if (this.selected == 4 || this.selected == 5){
				var dist  = (debugDraw.Pointer.DragY > this.midpoint.y) ? 
										-(this.midpoint.y - debugDraw.Pointer.rY)
										: (this.midpoint.y - debugDraw.Pointer.rY);
				this.shape.scale.y = Math.round(100 * dist / this.oldsize.height)/100;
				this.shape.update();
				this.update();
			}
			else {
				var dx  = (debugDraw.Pointer.DragX > this.midpoint.x) ? 
										-(this.midpoint.x - debugDraw.Pointer.rX)
										: (this.midpoint.x - debugDraw.Pointer.rX);
				var dy  = (debugDraw.Pointer.DragY > this.midpoint.y) ? 
										-(this.midpoint.y - debugDraw.Pointer.rY)
										: (this.midpoint.y - debugDraw.Pointer.rY);
				this.shape.scale.x = Math.round(100 * dx / this.oldsize.width)/100;
				this.shape.scale.y = Math.round(100 * dy / this.oldsize.height)/100;
				this.shape.update();
				this.update();
			}
		}
	},
	onup: function(){
		this.shape.updatescale();
		this.selected = null;
	},
	onkeydown: function(key){
	},
	onkeyup: function(key){
	},
	update: function(){
		this.size = { width: this.shape.aabb.xf  - this.shape.aabb.x, 
				      height: this.shape.aabb.yf - this.shape.aabb.y};
		this.points[0] = { x: this.shape.aabb.x,
						   y: this.shape.aabb.y};
		this.points[1] = { x: this.shape.aabb.x,
						   y: this.shape.aabb.yf};
		this.points[2] = { x: this.shape.aabb.xf,
						   y: this.shape.aabb.yf};
		this.points[3] = { x: this.shape.aabb.xf,
						   y: this.shape.aabb.y};
		this.points[4] = { x: (this.shape.aabb.x + this.shape.aabb.xf)/2,
						   y: this.shape.aabb.y};
		this.points[5] = { x: (this.shape.aabb.x + this.shape.aabb.xf)/2,
						   y: this.shape.aabb.yf};
		this.points[6] = { x: this.shape.aabb.x,
						   y: (this.shape.aabb.y + this.shape.aabb.yf)/2};
		this.points[7] = { x: this.shape.aabb.xf,
						   y: (this.shape.aabb.y + this.shape.aabb.yf)/2};
	},
	draw: function(repos){
		if (this.shape !== debugDraw.objects.selected()){
			this.shape = debugDraw.objects.selected();
			this.update();
		}
		debugDraw.ctx.lineWidth   = 1;
		debugDraw.ctx.strokeStyle = 'rgba(0, 0, 0, .7)';
		if (this.shape != null){
			debugDraw.ctx.beginPath();
			debugDraw.ctx.rect(this.shape.aabb.x * repos, this.shape.aabb.y * repos,
							  (this.shape.aabb.xf - this.shape.aabb.x) * repos, 
							  (this.shape.aabb.yf - this.shape.aabb.y) * repos);
			for (var i = 0; i < this.points.length; i++){
				debugDraw.ctx.moveTo(this.points[i].x * repos + 5, this.points[i].y * repos);
				debugDraw.ctx.arc(this.points[i].x * repos, this.points[i].y * repos,  5, 0, 2*Math.PI);
			}
			debugDraw.ctx.stroke();

		}
	}
}

debugDraw.Tools.pen = {
	cursor: 'none',
	selectedpoints: [],
	shape: null,
	set : function(){
	},
	onclick: function(){
		if (debugDraw.objects.selected() == undefined){
			debugDraw.objects.add('body');
			debugDraw.objects.add('shape', {parent: debugDraw.objects.selected(), 
											type: 'poly', 
											origin: {x: debugDraw.Pointer.rX, y: debugDraw.Pointer.rY}}); 
		}else if (debugDraw.objects.selected().type == 'body'){
			debugDraw.objects.add('shape', {parent: debugDraw.objects.selected(), 
											type: 'poly', 
											origin: {x: debugDraw.Pointer.rX, y: debugDraw.Pointer.rY}}); 

		}else if (debugDraw.objects.selected().type == 'shape'){
			var    points = debugDraw.objects.selected().points,
				  cpoints = debugDraw.objects.selected().cpoints,
				 newpoint = {x: debugDraw.Pointer.rX, y: debugDraw.Pointer.rY};
			this.selectedpoints = [];
		
			if ((debugDraw.keyboard.keys[debugDraw.keyboard.key.CTRL])){
				for (var i = 0; i < points.length; i++)
					if (points[i].x == newpoint.x && points[i].y == newpoint.y){
						this.selectedpoints.push(points[i]);
						cpoints = debugDraw.objects.selected().cpoints;
						for (var k = 0; k < cpoints.length; k++){
							if (points[i] === cpoints[k].point){
								this.selectedpoints.push(cpoints[k]);
								this.selectedpoints[this.selectedpoints.length - 1].old = {
									x: cpoints[k].x,
									y: cpoints[k].y
								}
							}
						}
						break;
					}
			} else {
				for (var i = 0; i < cpoints.length; i++)
					if (cpoints[i].x == newpoint.x && cpoints[i].y == newpoint.y){
						this.selectedpoints.push(cpoints[i]);
						if (cpoints[i+1] != undefined)
							if (cpoints[i].x == cpoints[i+1].x && cpoints[i].y == cpoints[i+1].y)
								this.selectedpoints.push(cpoints[i+1]);
						break;
					}
			}
			
			if (i == cpoints.length){
				debugDraw.objects.selected().add_point(newpoint);
				this.selectedpoints.push(cpoints[cpoints.length-1]);
				this.selectedpoints.push(cpoints[cpoints.length-2]);
			}
		}
	},
	onmove: function(){
		for (var k = 0; k < debugDraw.objects.list.length; k++){
			if (debugDraw.objects.list[k] != null){
				var points = (debugDraw.objects.list[k].points != undefined) ? debugDraw.objects.list[k].points : [];
				for (var i = 0; i < points.length; i++){
					var dx = Math.pow(points[i].x - debugDraw.Pointer.rX, 2),
						dy = Math.pow(points[i].y - debugDraw.Pointer.rY, 2);
					if (Math.sqrt(dx + dy) <= .1) {
						debugDraw.Pointer.rX = points[i].x;
						debugDraw.Pointer.rY = points[i].y; 
						break;
					}
				}
			}
		}
		if (debugDraw.objects.selected() != undefined && debugDraw.objects.selected().type == 'shape'){
			var points = (debugDraw.objects.selected() != undefined) ? debugDraw.objects.selected().cpoints : [];
			for (var i = 0; i < points.length; i++){
				var dx = Math.pow(points[i].x - debugDraw.Pointer.rX, 2),
					dy = Math.pow(points[i].y - debugDraw.Pointer.rY, 2);
				if (Math.sqrt(dx + dy) <= .1) {
					debugDraw.Pointer.rX = points[i].x;
					debugDraw.Pointer.rY = points[i].y; 
					break;
				}
			}
		}

		if (this.selectedpoints.length > 0){
			if (this.selectedpoints.length == 2 && this.selectedpoints[0].point != undefined){
				this.selectedpoints[0].x = debugDraw.Pointer.rX; 
				this.selectedpoints[0].y = debugDraw.Pointer.rY;
				var dx = this.selectedpoints[0].x - this.selectedpoints[0].point.x, 
					dy = this.selectedpoints[0].y - this.selectedpoints[0].point.y;
				this.selectedpoints[1].x = this.selectedpoints[0].point.x - dx; 
				this.selectedpoints[1].y = this.selectedpoints[0].point.y - dy;
			} else {
				this.selectedpoints[0].x = debugDraw.Pointer.rX; 
				this.selectedpoints[0].y = debugDraw.Pointer.rY;
				for (var i = 1; i < this.selectedpoints.length; i++){
					this.selectedpoints[i].x = this.selectedpoints[i].old.x - (debugDraw.Pointer.DragX - debugDraw.Pointer.rX); 
					this.selectedpoints[i].y = this.selectedpoints[i].old.y - (debugDraw.Pointer.DragY - debugDraw.Pointer.rY);
				}
			}
			debugDraw.objects.selected().update();
		}
	},
	onup: function(){
		this.selectedpoints = [];
	},
	onkeydown: function(e){
		if (e.target === document.body && debugDraw.keyboard.key.BACKSPACE == e.which){
			var point = this.shape.points[this.shape.points.length-1];
			for (var i = 0; i < this.shape.cpoints.length; i++)
				if (this.shape.cpoints[i].point === point){
					this.shape.cpoints.splice(i, 1);
					i--;
				}
			this.shape.points.splice(this.shape.points.length-1, 1);
			this.shape.update();
		}
	},
	onkeyup: function(key){
	},
	draw: function(repos){
		this.shape = (this.shape !== debugDraw.objects.selected()) ? debugDraw.objects.selected() : this.shape;
		if (this.shape != null && this.shape.type == 'shape'){
			debugDraw.ctx.lineWidth = 2;
			debugDraw.ctx.strokeStyle = 'rgba(0, 0, 0, .7)';
			debugDraw.ctx.fillStyle = 'rgba(0, 0, 0, .9)';
			//bezier curves and points
			debugDraw.ctx.beginPath();
			for (var k = 0; k < this.shape.cpoints.length; k++){
				if (this.shape.points[k] != undefined){
					debugDraw.ctx.moveTo(this.shape.points[k].x * repos,
										 this.shape.points[k].y * repos);
					debugDraw.ctx.arc(this.shape.points[k].x * repos,
							 		  this.shape.points[k].y * repos, 5, 0, 2*Math.PI);
				}
				debugDraw.ctx.moveTo(this.shape.cpoints[k].point.x * repos,
									 this.shape.cpoints[k].point.y * repos);
				debugDraw.ctx.lineTo(this.shape.cpoints[k].x * repos,
			 			 		  	 this.shape.cpoints[k].y * repos);
				debugDraw.ctx.moveTo(this.shape.cpoints[k].x * repos,
			 			 		  	 this.shape.cpoints[k].y * repos);
				debugDraw.ctx.arc(this.shape.cpoints[k].x  * repos,
					 		      this.shape.cpoints[k].y * repos, 5, 0, 2*Math.PI);
			}
			debugDraw.ctx.stroke();
			debugDraw.ctx.fill();
		}
	}
};