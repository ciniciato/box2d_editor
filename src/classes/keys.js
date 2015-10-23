var Keys = {
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
	SHIFT: 16,
	list: []
}

Keys.down = function(e){
	Keys.list[e.which] = 1;
	if (e.target.tagName != 'INPUT'){
		Tools.onkeydown(e);
		if (e.which == Keys.DELETE && Control.objectList.selectedChild != null)
			Control.objectList.selectedChild.delete();
	}
	if (e.target === document.body)
		if ((e.which == Keys.BACKSPACE) ||
		 (e.which == Keys.ENTER) ||
		 (e.which == Keys.F8) ||
		 (e.which == Keys.DELETE) ||
		 (e.which == Keys.LEFT) ||
		 (e.which == Keys.UP) ||
		 (e.which == Keys.RIGHT) ||
		 (e.which == Keys.DOWNS))
		e.preventDefault();	
}

Keys.up = function(e) {
	if (e.target.tagName != 'INPUT')
		Tools.onkeyup(e);
	delete Keys.list[e.which];
}

Keys.init = function(){
	document.addEventListener('keydown', Keys.down, true);
	document.addEventListener('keypress', Keys.down, true);
	document.addEventListener('keyup', Keys.up, true);
}