var World = new b2World(new b2Vec2(0, 9.8), false);

World.scale = 1;
World.timescale = 60; 

World.update = function(){
	this.Step(1/this.timescale, 10, 3);
	this.ClearForces();
}