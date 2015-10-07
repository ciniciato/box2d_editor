
debugDraw.Tools = {
	list: [],
	selected: null,
	selectedpoints: [],
	init: function(){
	},
	set: function(id){
		if (this.selected !== this[id]){
			this.selected = this[id];
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
	onkeydown: function(key){
		if (key == debugDraw.keyboard.key.SPACE)
			this.set('scroll');
		if (this.selected != undefined)
			this.selected.onkeydown();
	},
	onkeyup: function(key){
		if (this.selected != undefined)
			this.selected.onkeyup();
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
			debugDraw.Tools.set('line');
		else if (debugDraw.Pointer.isDown){
			var dx = debugDraw.Pointer.rX - debugDraw.Pointer.DragX; 
			var dy = debugDraw.Pointer.rY - debugDraw.Pointer.DragY; 
			debugDraw.Camera.free_position.x -= dx * Math.min(10, Math.pow(dx, 2) * 0.1);
			debugDraw.Camera.free_position.y -= dy * Math.min(10, Math.pow(dy, 2) * 0.1);
		}
	},
	onup: function(){
		debugDraw.canvas.style.cursor = 'grab'
	},
	onkeydown: function(key){
	},
	onkeyup: function(key){
	}
}

debugDraw.Tools.line = {
	cursor: 'none',
	selectedpoints: [],
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
			var points = debugDraw.objects.selected().points,
				 newpoint = {x: debugDraw.Pointer.rX , y: debugDraw.Pointer.rY};
			this.selectedpoints = [];
			for (var i = 0; i < points.length; i++)
				if (points[i].x == newpoint.x && points[i].y == newpoint.y){
					this.selectedpoints.push(points[i]);
					cpoints = debugDraw.objects.selected().cpoints;
					for (var k = 0; k < cpoints.length; k++){
						if (points[i]===cpoints[k].point){
							this.selectedpoints.push(cpoints[k]);
						}
					}
					break;
				}
			/*
			points = debugDraw.objects.selected().cpoints;
			for (var i = 0; i < points.length; i++)
				if (points[i].x == newpoint.x && points[i].y == newpoint.y){
					this.selectedpoints.push(points[i]);
					if (points[i+1] != undefined)
						if (points[i].x == points[i+1].x && points[i].y == points[i+1].y)
							this.selectedpoints.push(points[i+1]);
					break;
				}
				*/
			if (i == points.length){
				debugDraw.objects.selected().add_point(newpoint);
				this.selectedpoints.push(points[points.length-1]);
				this.selectedpoints.push(points[points.length-2]);
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
			this.selectedpoints[0].x = debugDraw.Pointer.rX; 
			this.selectedpoints[0].y = debugDraw.Pointer.rY;
			if (this.selectedpoints.length > 1){
				var dx = this.selectedpoints[0].x - this.selectedpoints[0].point.x, 
					dy = this.selectedpoints[0].y - this.selectedpoints[0].point.y;
				this.selectedpoints[1].x = this.selectedpoints[0].point.x - dx; 
				this.selectedpoints[1].y = this.selectedpoints[0].point.y - dy;
			}
			debugDraw.objects.selected().update();
		}
	},
	onup: function(){
		if (this.selectedpoints.length != 0){	
			this.selectedpoints = [];
		}
	},
	onkeydown: function(key){
		if ((debugDraw.keyboard.key.BACKSPACE == key)){
			var point = debugDraw.objects.selected().points[debugDraw.objects.selected().points.length-1];
			for (var i = 0; i < debugDraw.objects.selected().cpoints.length; i++)
				if (debugDraw.objects.selected().cpoints[i].point === point){
					debugDraw.objects.selected().cpoints.splice(i, 1);
					i--;
				}
			debugDraw.objects.selected().points.splice(debugDraw.objects.selected().points.length-1, 1);
			debugDraw.objects.selected().update();
		}
	},
	onkeyup: function(key){
	}
};