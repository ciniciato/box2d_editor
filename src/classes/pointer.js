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
	render : function(_args){
		var ctx = _args.ctx, repos = _args.repos;
		ctx.lineWidth = 2;
		ctx.beginPath();
		ctx.fillStyle = 'rgba(255, 198, 0, .7)';
		ctx.strokeStyle = 'rgba(0, 0, 0, .7)';
		debugDraw.ctx.arc(this.rX * repos, 
					 		this.rY * repos, 
					 		5, 0, 2*Math.PI);
		ctx.stroke();
	},
	pointerDown : function (e) {
		if (!this.isDown) {
			this.isDown = true;
			this.evt = e;
			this.X  = e.pageX;
			this.Y  = e.pageY - (window.innerHeight - debugDraw.canvas.height);
			this.DragX = this.rX;
			this.DragY = this.rY;

			Tools.onclick();
		}

	},
	pointerMove : function(e) {
		if (e != undefined){
			this.X  = e.pageX;
			this.Y  = e.pageY - (window.innerHeight - debugDraw.canvas.height);
		}
		this.rX = debugDraw.Camera.position.x - debugDraw.Camera.size.width  + this.X / (World.scale * debugDraw.Camera.scale),
		this.rY = debugDraw.Camera.position.y - debugDraw.Camera.size.height + this.Y / (World.scale * debugDraw.Camera.scale);
    	
		Tools.onmove();		
	},
	pointerUp : function(e) {
		this.isDown = false;
		Tools.onup();
	},
	pointerCancel : function(e) {
		this.isDown = false;
	},
	set : function(){
		var self = this;
		this.elem = debugDraw.canvas;
		if ('ontouchstart' in window) {
			this.elem.ontouchstart      = function (e) { self.pointerDown(e); return false;  }
			this.elem.ontouchmove       = function (e) { self.pointerMove(e); return false;  }
			this.elem.ontouchend        = function (e) { self.pointerUp(e); return false;    }
			this.elem.ontouchcancel     = function (e) { self.pointerCancel(e); return false;}
		}
		document.addEventListener("mousedown", function (e) {
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
		document.addEventListener("mousemove", function (e) { 
			self.pointerMove(e); 
		}, false);
		document.addEventListener("mouseup",   function (e) {
			self.pointerUp(e);
		}, false);
		if (window.addEventListener) this.elem.addEventListener('DOMMouseScroll', function(e) { 
			self.wheelDelta = e.detail * 10;
	        var value =  debugDraw.Camera.scale - e.detail/30;
	        if (value >= .1)
		        debugDraw.Camera.zoom(value);
			return false; 
		}, false); 
		this.elem.onmousewheel = function () { 
			self.wheelDelta = -event.wheelDelta * .25;
	        var value =  debugDraw.Camera.scale - self.wheelDelta/30;
	        if (value >= .1)
		        debugDraw.Camera.zoom(value);
			return false; 
		}
	}
}