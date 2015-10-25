var Pointer = {
	position         : {x: 0, y: 0},
	relativePosition : {x: 0, y: 0},
	dragPosition     : {x: 0, y: 0},
	wheelDelta : 0,
	isDown     : false,
	hasMoved   : false,
	cursor     : 'default',
	setCursor: function(_cursor){
		if (this.cursor != _cursor){
			Camera.canvas.style.cursor = _cursor;
			this.cursor = _cursor;
		}
	},
	isIntersected: function(area){
		return (Math.abs(this.relativePosition.x - area.position.x) < area.size.width && 
					Math.abs(this.relativePosition.y - area.position.y) < area.size.height);
	},
	resetDrag: function(){
		var dif = {x: this.dragPosition.x - this.relativePosition.x, y: this.dragPosition.y - this.relativePosition.y};
		this.dragPosition.x = this.relativePosition.x;
		this.dragPosition.y = this.relativePosition.y;
		return dif;
	},
	getDistance: function(point){
		var dx = point.x - this.relativePosition.x, dy = point.y - this.relativePosition.y;
		return Math.sqrt(dx*dx + dy*dy);
	},
	getAngle: function(point){
		return Math.atan2(this.relativePosition.y - point.y, this.relativePosition.x - point.x);
	},
	render : function(_args){
		var ctx = _args.ctx, repos = _args.repos;
		ctx.lineWidth = 2;
		ctx.beginPath();
		ctx.strokeStyle = 'rgba(255, 255, 255, 1)';
		ctx.arc(this.relativePosition.x * repos, this.relativePosition.y * repos, 5, 0, 2*Math.PI);
		ctx.stroke();
	},
	onDown : function (e) {
		if (!this.isDown) {
			this.isDown = true;
			this.dragPosition.x = this.relativePosition.x;
			this.dragPosition.y = this.relativePosition.y;
			Tools.onClick();
		}
	},
	onMove : function(e) {
		if (e != undefined)
		this.position = { x: e.pageX - Camera.canvas.position.x,
						  y: e.pageY - Camera.canvas.position.y};
		this.relativePosition = { x: Camera.position.x - Camera.size.width  + this.position.x / (World.scale * Camera.scale),
						          y: Camera.position.y - Camera.size.height + this.position.y / (World.scale * Camera.scale)};
    	this.hasMoved = (this.relativePosition != this.dragPosition.x || this.relativePosition.y != this.dragPosition.y);
		Tools.onMove();		
	},
	onUp : function(e) {
		this.isDown = false;
		Tools.onUp();
	},
	onCancel : function(e) {
		this.isDown = false;
	},
	init : function(){
		var that = this;
		if ('ontouchstart' in window) {
			Camera.canvas.ontouchstart      = function(e) {Pointer.onDown(e)};
			Camera.canvas.ontouchmove       = function(e) {Pointer.onMove(e)};
			Camera.canvas.ontouchend        = function(e) {Pointer.onUp(e)};
			Camera.canvas.ontouchcancel     = function(e) {Pointer.onCancel(e)};
		}
		Camera.canvas.addEventListener('mousedown', function(e) {Pointer.onDown(e)}, false);
		Camera.canvas.addEventListener('mousemove', function(e) {Pointer.onMove(e)}, false);
		Camera.canvas.addEventListener('mouseup',   function(e) {Pointer.onUp(e)}, false);
		if (window.addEventListener) Camera.canvas.addEventListener('DOMMouseScroll', function(e) { 
			that.wheelDelta = e.detail * 10;
	        Camera.zoom(Camera.follow.scale - that.wheelDelta/30);
			return false; 
		}, false); 
		Camera.canvas.onmousewheel = function () { 
			that.wheelDelta = -event.wheelDelta * .25;
	        Camera.zoom(Camera.follow.scale - that.wheelDelta/30);
			return false; 
		}
	}
}