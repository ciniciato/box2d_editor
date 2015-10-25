var Pointer = {
	elem       : null,
	X          : 0,
	Y          : 0,
	rX         : 0,
	rY         : 0,
	DragX      : 0,
	DragY      : 0,
	wheelDelta : 0,
	isDown     : false,
	hasMoved   : false,
	cursor     : 'default',
	set_cursor: function(_cursor){
		if (this.cursor != _cursor){
			this.elem.style.cursor = _cursor;
			this.cursor = _cursor;
		}
	},
	intersect: function(area){
		return (Math.abs(this.rX - area.position.x) < area.size.width && 
					Math.abs(this.rY - area.position.y) < area.size.height);
	},
	getDifference: function(){
		var dif = {x: this.DragX - this.rX, y: this.DragY - this.rY};
		this.DragY = this.rY;
		this.DragX = this.rX;
		return dif;
	},
	getAngle: function(point){
		return Math.atan2(this.rY - point.y, this.rX - point.x);
	},
	getDistance: function(point){
		var dx = point.x - this.rX, dy = point.y - this.rY;
		return Math.sqrt(dx*dx + dy*dy);
	},
	render : function(_args){
		var ctx = _args.ctx, repos = _args.repos;
		ctx.lineWidth = 2;
		ctx.beginPath();
		ctx.strokeStyle = 'rgba(255, 255, 255, .7)';
		ctx.arc(this.rX * repos, 
					 		this.rY * repos, 
					 		5, 0, 2*Math.PI);
		ctx.stroke();
	},
	pointerDown : function (e) {
		if (!this.isDown) {
			this.isDown = true;
			this.evt = e;
			this.X  = e.pageX - Camera.canvas.position.x;
			this.Y  = e.pageY - Camera.canvas.position.y;
			this.DragX = this.rX;
			this.DragY = this.rY;

			Tools.onclick();
		}
	},
	pointerMove : function(e) {
		if (e != undefined){
			this.X  = e.pageX - Camera.canvas.position.x;
			this.Y  = e.pageY - Camera.canvas.position.y;
		}
		this.rX = Camera.position.x - Camera.size.width  + this.X / (World.scale * Camera.scale),
		this.rY = Camera.position.y - Camera.size.height + this.Y / (World.scale * Camera.scale);
    	//ortogonal
    	/*
    	this.rX = Camera.position.x - Camera.size.width  + this.X / (World.scale * Camera.scale);
    	this.rX =this.rX - this.rX%(Grid.cellsize/Math.round(Camera.scale));
		this.rY = Camera.position.y - Camera.size.height + this.Y / (World.scale * Camera.scale);
    	this.rY =this.rY - this.rY%(Grid.cellsize/Math.round(Camera.scale));
    	*/
    	this.hasMoved = (this.rX != this.DragX || this.rY != this.DragY);
		
		Tools.onmove();		
	},
	pointerUp : function(e) {
		this.isDown = false;
		Tools.onup();
	},
	pointerCancel : function(e) {
		this.isDown = false;
	},
	init : function(){
		var self = this;
		this.elem = Camera.canvas;
		if ('ontouchstart' in window) {
			this.elem.ontouchstart      = function (e) { self.pointerDown(e); return false;  }
			this.elem.ontouchmove       = function (e) { self.pointerMove(e); return false;  }
			this.elem.ontouchend        = function (e) { self.pointerUp(e); return false;    }
			this.elem.ontouchcancel     = function (e) { self.pointerCancel(e); return false;}
		}
		this.elem.addEventListener("mousedown", function (e) {
			if (
				e.target === self.elem || 
				(e.target.parentNode && e.target.parentNode === self.elem) || 
				(e.target.parentNode.parentNode && e.target.parentNode.parentNode === self.elem)
			) {
				if (typeof e.stopPropagation != "undefined") {
					e.stopPropagation();
				} else {
					e.cancelBubble = true;
				}
				self.pointerDown(e); 
			}
		}, false);
		this.elem.addEventListener("mousemove", function (e) { 
			self.pointerMove(e); 
		}, false);
		this.elem.addEventListener("mouseup",   function (e) {
			self.pointerUp(e);
		}, false);
		if (window.addEventListener) this.elem.addEventListener('DOMMouseScroll', function(e) { 
			self.wheelDelta = e.detail * 10;
	        var value =  Camera.follow.scale - e.detail/30;
	        if (value >= .5)
		        Camera.zoom(value);
			return false; 
		}, false); 
		this.elem.onmousewheel = function () { 
			self.wheelDelta = -event.wheelDelta * .25;
	        var value =  Camera.follow.scale - self.wheelDelta/30;
	        if (value >= .5)
		        Camera.zoom(value);
			return false; 
		}
	}
}