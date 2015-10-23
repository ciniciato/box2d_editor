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
	    C: 67,
	    V: 86,
	SPACE: 32,
	ENTER: 13,
	BACKSPACE: 8,
	  ESC: 27,
	   F8: 119,
	DELETE: 46,
	 CTRL: 17,
	SHIFT: 16,
	list: [],
	hotkey_events: []
}

Keys.down = function(e){
	Keys.list[e.which] = 1;
	if (e.target.tagName != 'INPUT'){
		Tools.onkeydown(e);
		//HOT KEYS - not optimized
		for (var i = 0; i < Keys.hotkey_events.length; i++){
			for (var k = 0; k < Keys.hotkey_events[i].keys.length; k++){
				if (e.which == Keys.hotkey_events[i].keys[k]){
					for (var j = 0; j < Keys.hotkey_events[i].keys.length; j++){
						if (k != j)
							if(!Keys.list[Keys.hotkey_events[i].keys[j]])
								break;
					}
					if (j == Keys.hotkey_events[i].keys.length){
					console.log('once');	
						Keys.hotkey_events[i].event();
						break;
					}
				}
			}
		}
	}
	if (e.target === document.body)
		if ((e.which == Keys.BACKSPACE) ||
		 (e.which == Keys.ENTER) ||
		 (e.which == Keys.F8) ||
		 (e.which == Keys.DELETE) ||
		 (e.which == Keys.LEFT) ||
		 (e.which == Keys.UP) ||
		 (e.which == Keys.RIGHT) ||
		 (e.which == Keys.DOWN))
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