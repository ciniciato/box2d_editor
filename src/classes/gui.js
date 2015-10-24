var GUI = {
	elem: document.body,
	children: [],
	_list: {},
	findChildren: function(_args){//object, property, value
		if (_args == undefined) _args = {};
		if (_args.object == undefined) _args.object = this;
		if (_args.property == undefined) _args.property = 'id';
		if (_args.value == undefined) _args.value = 'undefined';

		var ind = 0, result = null, aux;

		if (_args.object[_args.property] == _args.value){
			result = _args.object;		
		}else while (ind < _args.object.children.length){
			if ((result = this.findChildren({object: _args.object.children[ind], property: _args.property, value: _args.value})) != null)
				break;
			ind++;
		}

		return result;
	},
	getChildIndex: function(_args){//child, property
		if (_args.property == undefined) _args.property = 'children';
		if (_args.parent == undefined) _args.parent = _args.child.parent;
		for(var i = 0; i < _args.parent[_args.property].length && _args.parent[_args.property][i] != _args.child; i++){
		}		
		return (i == _args.parent[_args.property].length) ? null : i;
	},
	methodById: function(childId, method){
		return this.findChildren({value: childId})[method]();
	}
}

//**OBJECT BEGIN**//
GUI.object = function(_args){
	if (_args == undefined) var _args = {};
	this.elem       = null;
	this.id         = null;
	this.type       = (this.type == undefined) ? 'object' : this.type;

	this.children = [];
	this._list    = {}; //children list by name
	this.parent   = (_args.parent == undefined) ? GUI : _args.parent;
	this.preElem  = (_args.preElem == undefined) ? null : document.getElementById(_args.preElem);//pre-created elem

	this.setId();
}

GUI.object.prototype.do = function(_function){
	if (_function != undefined)
		_function(this);
	return this;
}

GUI.object.prototype.setId = function(){
	var ind = 0;
	while (document.getElementById(this.type+'_'+ind) != null)
		ind++;
	this.id = this.type+'_'+ind;
}

GUI.object.prototype.init = function(){
	if (this.parent === GUI && this.type != 'object') {
		GUI.children.push(this)
		GUI._list[this.name] = this;
	};
	this.createElem();	
	return this;
}

GUI.object.prototype.createElem = function(){
	var result = {};
	result.elem = (this.parent.elem.content == undefined) ? this.parent.elem : this.parent.elem.content;
	return result;
}

GUI.object.prototype.addItem = function(_item){
	_item.parent = this;
	this.children.push(_item);
	_item.init();
	return _item;
}

GUI.object.prototype.showUnique = function(_itemlist){
	var res = null;
	for (var i = 0; i < this.children.length; i++){
		if (this.children[i].name == _itemlist){
			res = this.children[i];
			res.elem.style.display = 'block';
		}
		else
			this.children[i].elem.style.display = 'none';
	}
	return res;
}

GUI.object.prototype.doForAll = function(method){
	var res = {};
	for (var i = 0; i < this.children.length; i++){
		if (this.children[i][method] == undefined)
			res += method(this.children[i]);
		else
			res += this.children[i][method]();
	}
	return this;
}


GUI.object.prototype.findChildren = function(_args){
	return GUI.findChildren.call(this, _args);
}
//**OBJECT END**//


//**CONTAINER BEGIN**//
GUI.container = function(_args){
	if (_args == undefined) var _args = {};
	this.name = (_args.name == undefined) ? 'undefined' : _args.name;
	this.caption = (_args.caption == undefined) ? '' : _args.caption;
	this.type       = 'container';
	GUI.object.call(this, _args);
	this.isSelector = (_args.isSelector == undefined) ? false : _args.isSelector;
	this.valign = (_args.valign == undefined) ? false : _args.valign;//center vertical align 
	this.orientation   = (_args.orientation == undefined) ? 'horizontal' : 'vertical';
	this.isTable   = (_args.isTable == undefined) ? false : _args.isTable;
	if (this.isTable) { this.tableCols = {};}
	if (this.isSelector) this.selectedChild = null;
}

GUI.container.prototype             = new GUI.object(); 
GUI.container.prototype.constructor = GUI.container;   

GUI.container.prototype.createElem = function(){
	var parent = GUI.object.prototype.createElem.call(this);
	if (this.elem == null){
		var node = document.createElement("div");
		this.elem = (this.preElem != null) ? this.preElem.appendChild(node) : parent.elem.appendChild(node); 
		this.elem.className = (this.hasBorder) ? 'gui_container border '+this.orientation : 'gui_container '+this.orientation;
		this.elem.innerHTML = this.caption;
		if (this.valign){
			node = document.createElement("div"); 
			var wrap = this.elem.appendChild(node);
			wrap.style.display = 'table';
			wrap.style.height = '100%';

			node = document.createElement("div"); 
			this.elem.content = wrap.appendChild(node);
			this.elem.content.style.display  = 'table-cell';
			this.elem.content.style.verticalAlign = 'middle';
		}
		this.elem.id = this.id;
	}
	return this.elem;
}

GUI.container.prototype.addItem = function(_item){
	GUI.object.prototype.addItem.call(this, _item);
	this._list[_item.name] = _item;
	if (this.isTable){
		var ind = 0, prevElems = [];
		var elem = this.elem.getElementsByClassName('td_'+ind);
		while (elem.length > 0){
			for (var i = 0; i < elem.length; i++){
				if (this.tableCols['td_'+ind] == undefined)
					this.tableCols['td_'+ind] = elem[i].offsetWidth;
				else if (this.tableCols['td_'+ind] < elem[i].offsetWidth){
					this.tableCols['td_'+ind] = elem[i].offsetWidth;
					for (var k = 0; k < prevElems.length; k++){
						prevElems[k].style.width = this.tableCols['td_'+ind] + 'px';
					}
				} else 
					elem[i].style.width = this.tableCols['td_'+ind] + 'px';
				prevElems.push(elem[i]);
			}
			prevElems = [];
			ind++;
			elem = this.elem.getElementsByClassName('td_'+ind);
		}
	}
	return _item;
}
//**CONTAINER END**//

//**BUTTON BEGIN**//
GUI.button = function(_args){
	if (_args == undefined) var _args = {};
	this.name = (_args.name == undefined) ? 'undefined' : _args.name;
	this.type = 'button';
	this.icon = (_args.icon == undefined) ? 'error' : _args.icon;

	this.caption = (_args.caption == undefined) ? '' : _args.caption;
	this.tooltip = (_args.tooltip == undefined) ? '' : _args.tooltip;
	this.selectable = (_args.selectable == undefined) ? false : _args.selectable;

	this.hotkey = (_args.hotkey == undefined) ? null : _args.hotkey;

	this.events = {};
	this.events.onClick = [];
	GUI.object.call(this, _args);
	if (this.hotkey != null){
        var that = this;
		Keys.hotkey_events.push({keys: this.hotkey, 
							event: function(){ that.onClick(); } 
						});
	}
}

GUI.button.prototype             = new GUI.object(); 
GUI.button.prototype.constructor = GUI.button;   

GUI.button.prototype.onClick = function(){
	if (this.selectable){
		if (this.selector.selectedChild != null)
			this.selector.selectedChild.elem.className = this.selector.selectedChild.elem.className.replace('selected', '');
		this.selector.selectedChild = this;
		this.elem.className += ' selected';
	}
	for (var i = 0; i < this.events.onClick.length; i++)
		this.events.onClick[i](this);
}

GUI.button.prototype.createElem = function(){
	var parent = GUI.object.prototype.createElem.call(this);
	if (this.selectable){
		var tree = this.parent;
		while (tree.parent != undefined && (tree.isSelector == undefined || tree.isSelector == false)){
			tree = tree.parent;
		}
		if (tree.isSelector) this.selector = tree;
	}
	if (this.elem == null){
		var str = '';
		if (this.icon.indexOf('img') == -1)
			str += '<i class="material-icons">'+this.icon+'</i>';
		else
			str += '<img src="' + this.icon + '">';
		str += this.caption;
		if (this.tooltip != '')
			str += '<span class="gui_tooltip">'+ this.tooltip +'</span>';

		var node  = document.createElement("span");
		this.elem = (this.preElem != null) ? this.preElem.appendChild(node) : parent.elem.appendChild(node); 
		this.elem.className = 'gui_button';
		this.elem.id = this.id;
		this.elem.innerHTML = str;
		var that = this;
		this.elem.addEventListener('click', function(event) {
			that.onClick();
		}, false);
	}
	return this.elem;
}
//***BUTTON END*//

//**FIELD BEGIN**//
GUI.field = function(_args){
	if (_args == undefined) var _args = {};
	this.name = (_args.name == undefined) ? 'undefined' : _args.name;
	this.type       = 'field';
	this.input_type = (_args.type == undefined) ? 'text' : _args.type;
	this.options = (_args.options == undefined) ? '' : _args.options;
	this.link = (_args.type == undefined) ? function(){} : _args.link; //function(){}; getter and setter

	this.events = {};
	this.events.onChange = [];

	GUI.object.call(this, _args);
}

GUI.field.prototype             = new GUI.object(); 
GUI.field.prototype.constructor = GUI.field;   

GUI.field.prototype.createElem = function(){
	var parent = GUI.object.prototype.createElem.call(this);
	if (this.elem == null){
		var str = '';
		if (this.input_type == 'check'){
			str += '<input class="input" type="checkbox" id="cc'+this.id+'" onchange="GUI.methodById(&quot;'+this.id+'&quot;, &quot;onChange&quot;)" />';
			str += '<label for="cc'+this.id+'"><span class="td_0"><span></span></span><span class="td_1">'+this.name+'</span></label>';
		}
		else if (this.input_type == 'text'){
			str += '<label class="td_0">'+this.name+':</label><span class="td_1">';
			str += '<input class="input" type="text" onchange="GUI.methodById(&quot;'+this.id+'&quot;, &quot;onChange&quot;)" /></span>';
		} else if (this.input_type == 'select'){
			str += '<label class="td_0">'+this.name+':</label><span class="td_1">';
			str += '<select class="input" onchange="GUI.methodById(&quot;'+this.id+'&quot;, &quot;onChange&quot;)">';
			for (var i = 0; i < this.options.length; i++)
				str += '<option value="'+this.options[i]+'">'+this.options[i]+'</option>';	
			str += '</select>';		
		}
		var node  = document.createElement("span");
		this.elem = (this.preElem != null) ? this.preElem.appendChild(node) : parent.elem.appendChild(node); 
		this.elem.className = 'gui_field';
		this.elem.id = this.id;
		this.elem.innerHTML = str;
		this.elem.field = this.elem.getElementsByClassName("input")[0];
		this.elem.field.that = this;
		if (this.input_type == 'check')
			this.elem.field._value = function(val){
				return this.that.elem.field.checked = (val == undefined) ? this.that.elem.field.checked : val;
			}
		else 
			this.elem.field._value = function(val){
				return this.that.elem.field.value = (val == undefined) ? this.that.elem.field.value : val;
			}
	}
	return this.elem;
}

GUI.field.prototype.init = function(){
	GUI.object.prototype.init.call(this);
	this.load();
}

GUI.field.prototype.load = function(){
	if (this.link != undefined)
		this.elem.field._value(this.link());
}

GUI.field.prototype.onChange = function(){
	if (this.link != undefined)
		this.link(this.elem.field._value());
	for (var i = 0; i < this.events.onChange.length; i++)
		this.events.onChange[i](this);
}
//**FIELD END**//

new GUI.container({name: 'Toolbar', isSelector: true, preElem: 'toolbar'}).init().do( 
																					function(that){
																						that.elem.className += ' border'
																					}
																				);

GUI._list.Toolbar.addItem(
							new GUI.button({
								name: 'Pen',
								tooltip: 'Pen', 
								icon: 'assets/img/icon_pen.png',
								selectable: true
							})
						).do(
							function(that){
							 	that.events.onClick.push(function(that){ 
							 		Tools.set('pen');
									GUI._list['Properties tools'].showUnique('Pen properties');
							  });								   
							 }
						);

GUI._list.Toolbar.addItem(
							new GUI.button({
								name: 'Transform',
								tooltip: 'Transform', 
								icon: 'assets/img/icon_transform.png',
								selectable: true
							})
						).do(
							function(that){
							 	that.events.onClick.push(function(that){ 
							 		Tools.set('transform');
									GUI._list['Properties tools'].showUnique('Transform properties');
							  });								   
							 }
						);

GUI._list.Toolbar.addItem(
							new GUI.button({
								name: 'Run',
								tooltip: 'Run', 
								icon: 'play_arrow',
								selectable: true
							})
						).do(
							function(that){
							 	that.events.onClick.push(function(that){ 
									GUI._list['Properties tools'].showUnique('Run properties');
							 		debugDraw.run();
							  });								   
							 }
						);

new GUI.container({name: 'Properties tools', preElem: 'toolbar', valign: true}).init().do(
																							function(that){
																								that.elem.className += ' border';
																								that.elem.style.height = GUI._list.Toolbar.elem.offsetHeight+"px";
																							}
																						);


GUI._list['Properties tools'].addItem(new GUI.container({name: 'Pen properties'})).do(
	function(that){
		that.load = function(){
			this.doForAll(function(e){ e.load(); });
		}
	}
);

GUI._list['Properties tools'].children.last().addItem(new GUI.field({name: 'fixtures', 
							type: 'check',
							link: function(val){ 
								return Tools.pen.properties.fixtures = (val == undefined) ? Tools.pen.properties.fixtures : val;
							}
						}));
GUI._list['Properties tools'].children.last().addItem(new GUI.field({name: 'points', 
							type: 'check',
							link: function(val){ 
								return Tools.pen.properties.points = (val == undefined) ? Tools.pen.properties.points : val;
							}
						}));
GUI._list['Properties tools'].children.last().addItem(new GUI.field({name: 'density', 
							type: 'text',
							link: function(val){ 
								if (val == undefined){ 
									return Tools.pen.properties.density;
								} else{
									if (!(parseFloat(val) >= 0)){
										alert('Value must be positive');
										this.load();
									} else
										Tools.pen.properties.density = val;
								}
							}
						}));
GUI._list['Properties tools'].children.last().addItem(new GUI.field({name: 'friction', 
							type: 'text',
							link: function(val){ 
								if (val == undefined){ 
									return Tools.pen.properties.friction;
								} else{
									if (!(parseFloat(val) >= 0)){
										alert('Value must be positive');
										this.load();
									} else
										Tools.pen.properties.friction = val;
								}
							}
						}));
GUI._list['Properties tools'].children.last().addItem(new GUI.field({name: 'restitution', 
							type: 'text',
							link: function(val){ 
								if (val == undefined){ 
									return Tools.pen.properties.restitution;
								} else{
									if (!(parseFloat(val) >= 0 && parseFloat(val) <= 1)){
										alert('Value must be between 0 and 1');
										this.load();
									} else
										Tools.pen.properties.restitution = val;
								} 
							}
						}));
GUI._list['Properties tools'].children.last().addItem(new GUI.field({name: 'threshold', 
							type: 'text',
							link: function(val){ 
								if (val == undefined){ 
									return Tools.pen.properties.threshold;
								} else{
									if (!(parseFloat(val) >= .01 && parseFloat(val) <= 1)){
										alert('Value must be between 0.01 and 1');
										this.load();
									} else
										Tools.pen.properties.threshold = val;
								}
							}
						}));

GUI._list['Properties tools'].addItem(new GUI.container({name: 'Transform properties'})).do(
	function(that){
		that.load = function(){
			this.doForAll(function(e){ e.load(); });
		}
	}
);

/*
GUI._list['Properties tools'].children.last().addItem(new GUI.field({name: 'rotate', 
							type: 'text',
							link: function(val){ 
								return Tools.transform.properties.rotate = (val == undefined) ? Tools.transform.properties.rotate : val;
							}
						}));
*/
GUI._list['Properties tools'].children.last().addItem(new GUI.field({name: 'width', 
							type: 'text',
							link: function(val){ 
								return Tools.transform.properties.width = (val == undefined) ? Tools.transform.properties.width : val;
							}
						}));
GUI._list['Properties tools'].children.last().addItem(new GUI.field({name: 'height', 
							type: 'text',
							link: function(val){ 
								return Tools.transform.properties.height = (val == undefined) ? Tools.transform.properties.height : val;
							}
						}));


GUI._list['Properties tools'].addItem(new GUI.container({name: 'Run properties'})).do(
	function(that){
		that.load = function(){
			this.doForAll(function(e){ e.load(); });
		}
	}
);

GUI._list['Properties tools'].children.last().addItem(new GUI.field({name: 'x gravity', 
							type: 'text',
							link: function(val){ 
								return World.m_gravity.x = (val == undefined) ? World.m_gravity.x : val;
							}
						}));


GUI._list['Properties tools'].children.last().addItem(new GUI.field({name: 'y gravity', 
							type: 'text',
							link: function(val){ 
								return World.m_gravity.y = (val == undefined) ? World.m_gravity.y : val;
							}
						}));

GUI._list['Properties tools'].doForAll(function(that){ that.elem.style.display = 'none';  });

new GUI.container({name: 'Control panel', preElem: 'td_panel'}).init().elem.className += ' panel_container border';

GUI.children.last().addItem(new GUI.container({caption: 'Object list'})).elem.className += ' border gui_title';

GUI.children.last().addItem(new GUI.container({name: 'Object list', isSelector: true})).do(
		function(that){			
			that.elem.className += ' gui_list border object_list';
			that.objects = [];//direct reference to object lsit
			
			that.addBody = function(){
				this.addItem(new GUI.container({name: 'Folder'})).elem.className += ' folder_wrap';

				var _body = {};
				_body.wrapper = this.children.last().addItem(new GUI.container({name: 'Body content'}));
				_body.wrapper.elem.className += ' body_item';
				_body.wrapper.addItem(new GUI.button({name: 'view', tooltip: 'view&nbsp;this', icon: 'visibility'})).elem.className += ' btn_view';

				var parent = this;
				var body_item = _body.wrapper.addItem(new GUI.button({caption: 'Body', icon: 'accessibility', selectable: true})
												).do(
													function(that){
														that.events.onClick.push(
																		function(){
																			Control.panels.properties.wrap.showUnique('Body properties').doForAll(
																														function(e){ e.load(); }
																													);
																			Control.panels.objectList.resize();
																		}
																	);
														that.list    = parent.children.last().addItem(new GUI.container({name: 'Shapes'}));
														that.wrapper = _body.wrapper;//root reference
														that.elem.className += ' btn_body';
													}
												); 
				body_item.delete = function(){
				 	var ind = GUI.getChildIndex({child: this, parent: Control.panels.objectList, property: 'objects'});
				 	if (ind > 0)
				 		Control.panels.objectList.objects[ind - 1].onClick();
				 	else if (Control.panels.objectList.objects.length > 1)
				 		Control.panels.objectList.objects[ind + 1].onClick();				 		
				 	else
				 		Control.panels.objectList.selectedChild = null;	
				 	Control.panels.objectList.objects.splice(ind, 1);
 					Control.objectList.children.splice(Control.objectList.getChildIndex(this.link), 1);
 					this.parent.parent.elem.parentNode.removeChild(this.parent.parent.elem);//DOM element
				 	this.parent.parent.parent.children.splice(GUI.getChildIndex({child: this.parent.parent}), 1);//GUI tree(this, content, folder)
				}

				body_item.addShape = function(_args){
					if (_args == undefined) _args = {}
					if (_args.properties == undefined) _args.properties = {}
					var shape = {};
					shape.wrap = this.list.addItem(new GUI.container({name: 'Shape content'}));
					shape.wrap.elem.className += ' shape_item';
					shape.wrap.addItem(new GUI.button({name: 'view', tooltip: 'view&nbsp;this', icon: 'visibility'})).elem.className += ' btn_view';

					var shape_item = shape.wrap.addItem(new GUI.button({caption: 'Shape', icon: 'create', selectable: true})
												).do(
													function(that){
														that.events.onClick.push(
																		function(){
																			Control.panels.properties.wrap.showUnique('Shape properties').doForAll(
																																	function(e){ e.load(); }
																																);
																			Control.panels.objectList.resize();
																		}
																	);
														that.owner = body_item;
														that.elem.className += ' btn_shape';
													}
												);

					shape_item.delete = function(){
					 	var ind = Control.objectList.getChildIndex(this.link);
					 	if (ind > 0)
					 		this.link.parent.children[ind - 1].GUI.onClick();
					 	else if (this.link.parent.children.length > 1)
					 		this.link.parent.children[ind + 1].GUI.onClick();	
					 	else
					 		this.link.parent.GUI.onClick();
					 	//Remove references
 						this.owner.link.children.splice(Control.objectList.getChildIndex(this.link), 1);
	 					this.parent.elem.parentNode.removeChild(this.parent.elem);//DOM element
					 	this.parent.parent.children.splice(GUI.getChildIndex({child: this.parent}), 1);//GUI tree
					}
					
					return shape_item;
				}

				this.objects.push(body_item);

				return body_item;
			}
		}
	);

GUI.children.last().addItem(new GUI.container({name: 'Menu'})).do(
															function(that){
																that.elem.style = 'text-align: center';
																that.elem.className += ' border';
																that.addItem(new GUI.button({tooltip: 'New&nbsp;body', icon: 'accessibility', hotkey: [Keys.CTRL, Keys.B]})).do(
																		function(that){
																			that.events.onClick.push(
																							function(e){
																								Control.objectList.addBody();
																							}
																						);																			
																		}
																	);
																that.addItem(new GUI.button({tooltip: 'Delete', icon: 'delete', hotkey: [Keys.DELETE]})).do(
																		function(that){
																			that.events.onClick.push(
																							function(e){
																								if (Control.panels.objectList.selectedChild != null)
																									Control.panels.objectList.selectedChild.delete();
																							}
																						);																			
																		}
																	);
																that.addItem(new GUI.button({tooltip: 'Copy', icon: 'content_copy', hotkey: [Keys.CTRL, Keys.C]})).do(
																		function(that){
																			that.events.onClick.push(
																							function(e){		
																								if (Control.panels.objectList.selectedChild != null)																						
																									Control.objectList.buff = Control.panels.objectList.selectedChild.link;
																							}
																						);																			
																		}
																	);
																that.addItem(new GUI.button({tooltip: 'Paste', icon: 'content_paste', hotkey: [Keys.CTRL, Keys.V]})).do(
																		function(that){
																			that.events.onClick.push(
																							function(e){
																								if (Control.objectList.buff != null)
																									Control.objectList.buff.paste();
																							}
																						);																			
																		}
																	);
															}
														); 


GUI.children.last().addItem(new GUI.container({caption: 'Properties'})).elem.className += ' gui_title border';

GUI.children.last().addItem(new GUI.container({name: 'Object properties'})).init().do(
		function(that){ 
			that.elem.className += ' object_properties border';
		}
	);

GUI.children.last().children.last().addItem(new GUI.container({name: 'Body properties', orientation: 'vertical', isTable: true})).do(
		function(that){
			that.addItem(new GUI.field({name: 'name', 
										type: 'text',
										link: function(val){ 
											if (Control.panels.objectList.selectedChild != null)
												if (val == undefined){ 
													return Control.panels.objectList.selectedChild.link.properties.name;
												} else{
													if (!(val !== '')){
														Control.panels.objectList.selectedChild.link.properties.name = 'Body';
														this.load();
													} else
														Control.panels.objectList.selectedChild.link.properties.name = val;
												}
										}
									}));
			that.addItem(new GUI.field({name: 'type', 
										type: 'select',
										options: ['dynamic', 'static'],
										link: function(val){ 
											if (Control.panels.objectList.selectedChild != null)
											return Control.panels.objectList.selectedChild.link.properties.type = (val == undefined) 
													? Control.panels.objectList.selectedChild.link.properties.type : val;
										}
									}));
			that.addItem(new GUI.field({name: 'fixedRotation', 
										type: 'select',
										options: ['false', 'true'],
										link: function(val){ 
											if (Control.panels.objectList.selectedChild != null)
											return Control.panels.objectList.selectedChild.link.properties.fixedRotation = (val == undefined) 
													? Control.panels.objectList.selectedChild.link.properties.fixedRotation : val;
										}
									}));
			that.addItem(new GUI.field({name: 'linearDamping', 
										type: 'text',
										link: function(val){ 
											if (Control.panels.objectList.selectedChild != null)
												if (val == undefined){ 
													return Control.panels.objectList.selectedChild.link.properties.linearDamping;
												} else{
													if (!(parseFloat(val) >= .01 && parseFloat(val) <= 1)){
														alert('Value must be between 0 and 1');
														this.load();
													} else
														Control.panels.objectList.selectedChild.link.properties.linearDamping = val;
												}
										}
									}));
			that.addItem(new GUI.field({name: 'angularDamping', 
										type: 'text',
										link: function(val){ 
											if (Control.panels.objectList.selectedChild != null)
												if (val == undefined){ 
													return Control.panels.objectList.selectedChild.link.properties.angularDamping;
												} else{
													if (!(parseFloat(val) >= .01 && parseFloat(val) <= 1)){
														alert('Value must be between 0 and 1');
														this.load();
													} else
														Control.panels.objectList.selectedChild.link.properties.angularDamping = val;
												}
										}
									}));
		}
	);



GUI.children.last().children.last().addItem(new GUI.container({name: 'Shape properties', orientation: 'vertical', isTable: true})).do(
	function(that){
		that.addItem(new GUI.field({name: 'name', 
									type: 'text',
									link: function(val){ 
										if (Control.panels.objectList.selectedChild != null)
											if (val == undefined){ 
												return Control.panels.objectList.selectedChild.link.properties.name;
											} else{
												if (!(val != '')){
													Control.panels.objectList.selectedChild.link.properties.name = 'Shape';
													this.load();
												} else
													Control.panels.objectList.selectedChild.link.properties.name = val;
											}
									}
								}));
		that.addItem(new GUI.field({name: 'fixtures', 
									type: 'text',
									link: function(val){ 
										if (Control.panels.objectList.selectedChild != null)
										return Control.panels.objectList.selectedChild.link.properties.fixtures = (val == undefined) 
												? Control.panels.objectList.selectedChild.link.properties.fixtures : val;
									}
								}));
		that.addItem(new GUI.field({name: 'density', 
									type: 'text',
									link: function(val){ 
										if (Control.panels.objectList.selectedChild != null)
											if (val == undefined){ 
												return Control.panels.objectList.selectedChild.link.properties.density;
											} else{
												if (!(parseFloat(val) >= 0)){
													alert('Value must be positive')
													this.load();
												} else
													Control.panels.objectList.selectedChild.link.properties.density = val;
											}
									}
								}));
		that.addItem(new GUI.field({name: 'friction', 
									type: 'text',
									link: function(val){ 
										if (Control.panels.objectList.selectedChild != null)
											if (val == undefined){ 
												return Control.panels.objectList.selectedChild.link.properties.friction;
											} else{
												if (!(parseFloat(val) >= 0)){
													alert('Value must be positive')
													this.load();
												} else
													Control.panels.objectList.selectedChild.link.properties.friction = val;
											}
									}
								}));
		that.addItem(new GUI.field({name: 'restitution', 
									type: 'text',
									link: function(val){ 
										if (Control.panels.objectList.selectedChild != null)
											if (val == undefined){ 
												return Control.panels.objectList.selectedChild.link.properties.restitution;
											} else{
												if (!(parseFloat(val) >= .01 && parseFloat(val) <= 1)){
													alert('Value must be between 0 and 1');
													this.load();
												} else
													Control.panels.objectList.selectedChild.link.properties.restitution = val;
											}
									}
								}));
		that.addItem(new GUI.field({name: 'threshold', 
							type: 'text',
							link: function(val){ 
								if (Control.panels.objectList.selectedChild != null)
									if (val == undefined){ 
										return Control.panels.objectList.selectedChild.link.properties.threshold;
									} else{
										if (!(parseFloat(val) >= .01 && parseFloat(val) <= 1)){
											alert('Value must be between 0.01 and 1');
											this.load();
										} else
											Control.panels.objectList.selectedChild.link.properties.threshold = val;
									}
							}
						})
					).do(
						function(that){
							that.events.onChange.push(
								function (that){
									if (Control.panels.objectList.selectedChild != null)
										Control.panels.objectList.selectedChild.link.update();

								}
							);	
						}
					);

	});
			
GUI.children.last().children.last().doForAll(function(that){ that.elem.style.display = 'none'; });