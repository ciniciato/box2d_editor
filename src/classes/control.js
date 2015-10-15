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
	var repos = (World.scale * Camera.scale);
	Camera.update();	
	Objects_list.render({ctx: Camera.ctx, repos: repos});
	Tools.render({ctx: Camera.ctx, repos: repos});
	Pointer.render({ctx: Camera.ctx, repos: repos});
}