var Camera = {
	position      : {x: 0, y: 0},
	position_dif  : {x: 0,  y: 0},
	size          : {width:  0,
					 height: 0},
	scale: 1,
	canvas : null,
	ctx    : null
}

Camera.init = function(){
	this.canvas = document.getElementById('canvas_debug');
	this.canvas.container = document.getElementById('td_canvas');
	this.ctx = this.canvas.getContext("2d");
	this.resize();
}

Camera.resize = function(){
	this.canvas.style.display = 'none';
	this.canvas.width  = this.canvas.container.offsetWidth;
	this.canvas.height = this.canvas.container.offsetHeight;
	this.canvas.style.display = 'block';
	this.set();
}

window.onresize = function(event) {
    Camera.resize();
}; 	

Camera.set = function(){
	this.size = {width: this.canvas.width/(World.scale * this.scale)/2, 
				 height: this.canvas.height/(World.scale * this.scale)/2};
	this.position_dif = {
		x: this.size.width,
		y: this.size.height
	};
}

Camera.zoom = function(_value){
	this.scale = _value;
	this.resize();
}

Camera.clear = function(){
	var repos = (World.scale * this.scale);
	this.ctx.clearRect( (this.position.x - this.size.width)  * repos, 
						(this.position.y - this.size.height) * repos, 
						(this.position.x - this.size.width)  * repos + this.canvas.width, 
						(this.position.y - this.size.height) * repos + this.canvas.height);
}

Camera.update = function (){	
	var repos = (World.scale * this.scale);
	this.position.x = (this.position.x - this.size.width <= 0) ? this.size.width : this.position.x;
	this.position.y = (this.position.y - this.size.height <= 0) ? this.size.height : this.position.y;
	this.ctx.translate((this.position_dif.x - this.position.x) * repos, 
						    (this.position_dif.y - this.position.y) * repos); 
	this.position_dif.x = this.position.x;
	this.position_dif.y = this.position.y;
	Pointer.pointerMove();
}