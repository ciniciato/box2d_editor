var debugDraw = new b2DebugDraw();

debugDraw.drawing_object = null;
debugDraw.properties = [];
debugDraw.properties.orto = true;
debugDraw.properties.grid = true;
debugDraw.properties.cellsize = .25;

debugDraw.set = function (){
	this.canvas = document.getElementById('canvas_debug');
	this.canvas.width = window.innerWidth;
	this.canvas.height = window.innerHeight;
	this.ctx = this.canvas.getContext("2d");
    this.Camera.set();
	this.Pointer.set();
	this.keyboard.set();

	this.SetSprite(this.ctx);
	this.SetDrawScale(World.scale * this.Camera.scale);
	this.SetFillAlpha(.7);
	this.SetLineThickness(1.0);
	this.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit);
	World.SetDebugDraw(debugDraw);

	this.resize();
}


debugDraw.resize = function(){
	this.canvas.width  = window.innerWidth  - $('#canvas_debug').offset().left;
	this.canvas.height = window.innerHeight - $('#canvas_debug').offset().top;
	this.m_drawScale   = World.scale * this.Camera.scale;
	this.Camera.set();
	debugDraw.ctx.translate( (this.Camera.position_dif.x - this.Camera.position.x) * (World.scale * this.scale), 
						     (this.Camera.position_dif.y - this.Camera.position.y) * (World.scale * this.scale));
}

window.onresize = function(event) {
    debugDraw.resize();
};

debugDraw.grid = function(){
	this.ctx.strokeStyle = 'rgba(0, 0, 0, 1)';
	this.ctx.lineWidth = 1;
	this.ctx.beginPath();
	if (this.properties.grid){
		for (var i = (this.Camera.position.x - this.Camera.size.width)-
					(this.Camera.position.x - this.Camera.size.width)%(debugDraw.properties.cellsize / this.Camera.scale); 
				i < this.Camera.position.x - this.Camera.size.width + this.Camera.size.width * 2; 
				i+=debugDraw.properties.cellsize / this.Camera.scale){
			this.ctx.moveTo(i * (World.scale * this.Camera.scale), 
							(this.Camera.position.y - this.Camera.size.height) * (World.scale * this.Camera.scale));
			this.ctx.lineTo(i * (World.scale * this.Camera.scale), 
							(this.Camera.position.y + this.Camera.size.height * 2) * (World.scale * this.Camera.scale));
		}
		for (var i = (this.Camera.position.y - this.Camera.size.height)-
					(this.Camera.position.y - this.Camera.size.height)%(debugDraw.properties.cellsize / this.Camera.scale); 
				i < this.Camera.position.y - this.Camera.size.height + this.Camera.size.height * 2; 
				i+=debugDraw.properties.cellsize / this.Camera.scale){
			this.ctx.moveTo((this.Camera.position.x - this.Camera.size.width) * (World.scale * this.Camera.scale),
					i * (World.scale * this.Camera.scale));
			this.ctx.lineTo((this.Camera.position.x + this.Camera.size.width * 2) * (World.scale * this.Camera.scale),
					i * (World.scale * this.Camera.scale));
		}
	}

	this.ctx.stroke();
	this.ctx.strokeStyle='red';
}

debugDraw.draw = function (){
	var repos = (World.scale * this.Camera.scale);
	this.ctx.clearRect( (this.Camera.position.x - this.Camera.size.width) * (World.scale * this.Camera.scale), 
						(this.Camera.position.y - this.Camera.size.height) * (World.scale * this.Camera.scale), 
						(this.Camera.position.x - this.Camera.size.width) * (World.scale * this.Camera.scale) + this.canvas.width, 
						(this.Camera.position.y - this.Camera.size.height) * (World.scale * this.Camera.scale) + this.canvas.height);
	this.Camera.update();
	World.DrawDebugData();
	//this.grid();
	this.objects.draw();
	this.Tools.draw(repos);
	this.Pointer.draw();
}

debugDraw.Camera = {
	free_position : {x: 15, y: 13},
	position      : {x: 0, y:0},
	position_dif  : {x: 0, y:0},
	size          : {width:  0,
					 height: 0},
	followed      : null,
	initialized   : false,
	scale: 1
} 	

debugDraw.Camera.set = function (_followed){
	this.size = {width: debugDraw.canvas.width/(World.scale * this.scale)/2, 
				 height: debugDraw.canvas.height/(World.scale * this.scale)/2};
	this.position_dif = {
		x: this.size.width,
		y: this.size.height
	};
}

debugDraw.Camera.zoom = function(_value){
	this.scale = _value;
	debugDraw.resize();
}

debugDraw.Camera.update = function (){
	var deltaCentre = {
		x: debugDraw.Pointer.rX - this.position.x,
		y: debugDraw.Pointer.rY - this.position.y
	};
	
	this.free_position.x = (this.free_position.x - this.size.width < 0) ? this.size.width : this.free_position.x;
	this.free_position.y = (this.free_position.y - this.size.height < 0) ? this.size.height : this.free_position.y;

	this.position.x = this.free_position.x;
	this.position.y = this.free_position.y;
	debugDraw.ctx.translate((this.position_dif.x - this.position.x) * (World.scale * this.scale), 
						    (this.position_dif.y - this.position.y) * (World.scale * this.scale)); 
	this.position_dif.x = this.position.x;
	this.position_dif.y = this.position.y;
	debugDraw.Pointer.pointerMove();
}

debugDraw.keyboard = {
	key:{
		 LEFT: 37,
		   UP: 38,
		RIGHT: 39,
		 DOWN: 40,
		    W: 87,
		    A: 65,
		    D: 68,
		    S: 83,
		    J: 74,
		SPACE: 32,
		ENTER: 13,
	BACKSPACE: 8,
		  ESC: 27,
		   F8: 119,
	   DELETE: 46,
	     CTRL: 17,
	    SHIFT: 16
	},
	keys : [],
	keydown : function(e){
		debugDraw.keyboard.keys[e.which] = 1;
		debugDraw.Tools.onkeydown(e);
		if (e.target === document.body)
			if ((e.which == debugDraw.keyboard.key.BACKSPACE) ||
			 (e.which == debugDraw.keyboard.key.ENTER) ||
			 (e.which == debugDraw.keyboard.key.F8) ||
			 (e.which == debugDraw.keyboard.key.DELETE) ||
			 (e.which == debugDraw.keyboard.key.LEFT) ||
			 (e.which == debugDraw.keyboard.key.UP) ||
			 (e.which == debugDraw.keyboard.key.RIGHT) ||
			 (e.which == debugDraw.keyboard.key.DOWNS))
			e.preventDefault();
	},
	keypress : function(e){
		debugDraw.keyboard.keys[e.which] = 1;
		if (e.target === document.body)
			e.preventDefault();
	},
	keyup : function(e) {
		debugDraw.Tools.onkeyup(e);
		delete debugDraw.keyboard.keys[e.which];
	},
	set: function(){
		document.addEventListener('keydown', debugDraw.keyboard.keydown, true);
		document.addEventListener('keypress', debugDraw.keyboard.keydown, true);
		document.addEventListener('keyup', debugDraw.keyboard.keyup, true);
	}
} 

debugDraw.Pointer = {
	elem       : null,
	X          : 0,
	Y          : 0,
	rX         : 0,
	rY         : 0,
	DragX      : 0,
	DragY      : 0,
	wheelDelta : 0,
	isDown     : false,
	draw : function(){
		debugDraw.ctx.beginPath();
		debugDraw.ctx.arc(this.rX * (World.scale * debugDraw.Camera.scale), 
					 		this.rY * (World.scale * debugDraw.Camera.scale), 
					 		5, 0, 2*Math.PI);
		debugDraw.ctx.stroke();
	},
	pointerDown : function (e) {
		if (!this.isDown) {
			this.isDown = true;
			this.evt = e;
			this.X  = e.clientX - $('#canvas_debug').offset().left;
			this.Y  = e.clientY - $('#canvas_debug').offset().top;
			this.DragX = this.rX;
			this.DragY = this.rY;

			debugDraw.Tools.onclick();
		}

	},
	pointerMove : function(e) {
		if (e != undefined){
			this.X  = e.pageX - $('#canvas_debug').offset().left;
			this.Y  = e.pageY - $('#canvas_debug').offset().top;
		}
		this.rX = debugDraw.Camera.position.x - debugDraw.Camera.size.width  + this.X / (World.scale * debugDraw.Camera.scale),
		this.rY = debugDraw.Camera.position.y - debugDraw.Camera.size.height + this.Y / (World.scale * debugDraw.Camera.scale);
    	
		debugDraw.Tools.onmove();		
	},
	pointerUp : function(e) {
		this.isDown = false;
		debugDraw.Tools.onup();
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
			self.setup.wheel && self.setup.wheel(event);
			return false; 
		}
	}
}