var Control = {
}

Control.init = function(){
	Camera.init();
	Keys.init();
	Pointer.init();
}

Control.update = function(){
}

Control.render = function(){
	Camera.update();
	Camera.clear();	
	var repos = (World.scale * Camera.scale);
	Grid.render({ctx: Camera.ctx, repos: repos});
	Objects_list.render({ctx: Camera.ctx, repos: repos});
	Tools.render({ctx: Camera.ctx, repos: repos});
	Pointer.render({ctx: Camera.ctx, repos: repos});
}

var Grid = {
	cellsize: .5,
	squaresize: 5
}

//TO FIX: strongerlines when zooming
//Add to the panel
Grid.render = function(_args){
	var ctx = _args.ctx, repos = _args.repos, that = this;
	function lines(orientation){
		var pos   = (orientation == 'vertical') ? 'x' : 'y', 
			size  = (orientation == 'vertical') ? 'width' : 'height',
			end   = Camera.position[pos] + Camera.size[size],
			step  = that.cellsize/Math.round(Camera.scale),
			reset = (Camera.position[pos] - Camera.size[size]) 
					- (Camera.position[pos] - Camera.size[size]) % step;
		strongerline = function(i){
			return false;
			//return (i % (step * that.squaresize) == 0);
		}
		for (var i = reset; i < end; i += step){
			if (strongerline(i)){
				ctx.stroke();
				ctx.lineWidth = 3;
				ctx.beginPath();
			}       
			if (orientation == 'vertical'){    
				ctx.moveTo(i * repos, (Camera.position.y - Camera.size.height) * repos);
				ctx.lineTo(i * repos, (Camera.position.y + Camera.size.height * 2) * repos);
			} else{    
				ctx.moveTo((Camera.position.x - Camera.size.width) * repos, i * repos);
				ctx.lineTo((Camera.position.x + Camera.size.width * 2) * repos, i * repos);
			} 
			if (strongerline(i)){
				ctx.stroke();
				ctx.lineWidth = 1;
				ctx.beginPath(); 
			}
		}
	}
	ctx.strokeStyle = 'rgba(0, 0, 0, .4)';
	ctx.lineWidth = 1;
	ctx.beginPath();
	lines('horizontal');
	lines('vertical');
	ctx.stroke();
}