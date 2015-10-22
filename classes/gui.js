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
	this.hasBorder   = (_args.hasBorder == undefined) ? false : _args.hasBorder;
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
	this.onclick = (_args.onclick == undefined) ?  function(){} : _args.onclick;
	this.caption = (_args.caption == undefined) ? '' : _args.caption;
	this.tooltip = (_args.tooltip == undefined) ? '' : _args.tooltip;
	this.selectable = (_args.selectable == undefined) ? false : _args.selectable;

	this.events = {};
	this.events.onClick = [];
	GUI.object.call(this, _args);
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
		this.elem.addEventListener('click', function(event) {
			GUI.methodById(this.id, 'onClick');
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
			str += '<input type="checkbox" id="cc'+this.id+'" onchange="GUI.methodById(&quot;'+this.id+'&quot;, &quot;onChange&quot;)" />';
			str += '<label for="cc'+this.id+'"><span></span>'+this.name+'</label>';
		}
		else if (this.input_type == 'text'){
			str += '<label class="td_0">'+this.name+':</label><span class="input td_1">';
			str += '<input type="text" onchange="GUI.methodById(&quot;'+this.id+'&quot;, &quot;onChange&quot;)" /></span>';
		}
		var node  = document.createElement("span");
		this.elem = (this.preElem != null) ? this.preElem.appendChild(node) : parent.elem.appendChild(node); 
		this.elem.className = 'gui_field';
		this.elem.id = this.id;
		this.elem.innerHTML = str;
		this.elem.field = this.elem.getElementsByTagName("input")[0];
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
							new GUI.button({tooltip: 'Pen', 
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

new GUI.container({name: 'Properties tools', preElem: 'toolbar', valign: true}).init().do(
																							function(that){
																								that.elem.style.height = GUI._list.Toolbar.elem.offsetHeight+"px";
																							}
																						);


GUI._list['Properties tools'].addItem(new GUI.container({name: 'Pen properties'}));

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
								return Tools.pen.properties.density = (val == undefined) ? Tools.pen.properties.density : val;
							}
						}));
GUI._list['Properties tools'].children.last().addItem(new GUI.field({name: 'friction', 
							type: 'text',
							link: function(val){ 
								return Tools.pen.properties.friction = (val == undefined) ? Tools.pen.properties.friction : val;
							}
						}));
GUI._list['Properties tools'].children.last().addItem(new GUI.field({name: 'restitution', 
							type: 'text',
							link: function(val){ 
								return Tools.pen.properties.restitution = (val == undefined) ? Tools.pen.properties.restitution : val; 
							}
						}));
GUI._list['Properties tools'].children.last().addItem(new GUI.field({name: 'threshold', 
							type: 'text',
							link: function(val){ 
								return Tools.pen.properties.threshold = (val == undefined) ? Tools.pen.properties.threshold : val;
							}
						}));

GUI._list['Properties tools'].addItem(new GUI.container({name: 'Transform properties'}));
GUI._list['Properties tools'].children.last().addItem(new GUI.field({name: 'rotate', 
							type: 'text',
							link: function(val){ 
								return Tools.transform.properties.rotate = (val == undefined) ? Tools.transform.properties.rotate : val;
							}
						}));
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

GUI._list['Properties tools'].doForAll(function(that){ that.elem.style.display = 'none';  });


var panel_container = new GUI.container({name: 'Control panel', preElem: 'td_panel'}).init();
panel_container.elem.className += ' panel_container'

GUI.children.last().addItem(new GUI.container({caption: 'Object list'})).elem.className += ' border gui_title object_list_wrap';

var object_list = GUI.children.last().addItem(new GUI.container({name: 'Object list', isSelector: true})).do(
		function(that){

			that.resize = function(){
				this.elem.style.display = 'none';
				this.elem.style.height = document.getElementById('workspace').getBoundingClientRect().height - panel_container.elem.getBoundingClientRect().height +'px';
				this.elem.style.display = 'block';
			}
			
			that.elem.className += ' gui_list border object_list';
			that.bodies = [];
			
			that.render = function(_args){
				for (var i = 0; i < this.bodies.length; i++){
					for (var k = 0; k < this.bodies[i].shapes.length; k++){
						this.bodies[i].shapes[k].link.render(_args);
					}
				}
			}
			
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
														that.link = new physic_object.body({owner: that});
														that.events.onClick.push(
																		function(){
																			object_properties.showUnique('Body properties').doForAll(
																														function(e){ e.load(); }
																													);
																			Control.panels.objectList.resize();
																		}
																	);
														that.list = parent.children.last().addItem(new GUI.container({name: 'Shapes'}));
														that.elem.className += ' btn_body';
														that.wrapper = _body.wrapper;
														that.shapes = [];
													}
												); 

				body_item.addShape = function(_args){
					if (_args == undefined) _args = {}
					if (_args.properties == undefined) _args.properties = {}
					var shape = {};
					shape.wrap = this.list.addItem(new GUI.container({name: 'Shape content'}));
					shape.wrap.elem.className += ' shape_item';
					shape.wrap.addItem(new GUI.button({name: 'view', tooltip: 'view&nbsp;this', icon: 'visibility'})).elem.className += ' btn_view';

					this.shapes.push(shape.wrap.addItem(new GUI.button({caption: 'Shape', selectable: true})
												).do(
													function(that){
														that.link = new physic_object.shape({properties: _args.properties, owner: that});
														that.events.onClick.push(
																		function(){
																			object_properties.showUnique('Shape properties').doForAll(
																																	function(e){ e.load(); }
																																);
																			Control.panels.objectList.resize();
																		}
																	);
														that.elem.className += ' btn_shape';
													}
												));
					return this.shapes.last();
				}

				this.bodies.push(body_item);

				return body_item;
			}
		}
	);

GUI.children.last().addItem(new GUI.container({name: 'Menu'})).do(
															function(that){
																that.elem.style = 'text-align: center';
																that.elem.className += ' border';
																that.addItem(new GUI.button({tooltip: 'New&nbsp;body', icon: 'accessibility'}));
																that.addItem(new GUI.button({tooltip: 'Delete', icon: 'delete'}));
																that.addItem(new GUI.button({tooltip: 'Copy', icon: 'content_copy'}));
																that.addItem(new GUI.button({tooltip: 'Paste', icon: 'content_paste'}));
															}
														); 


GUI.children.last().addItem(new GUI.container({caption: 'Properties'})).elem.className += ' gui_title border';

var object_properties = GUI.children.last().addItem(new GUI.container({name: 'Object properties'})).init();
object_properties.elem.style = 'padding: 0';


var body_properties = object_properties.addItem(new GUI.container({name: 'Body properties', orientation: 'vertical', isTable: true}));
body_properties.elem.className += ' ';

body_properties.addItem(new GUI.field({name: 'name', 
							type: 'text',
							link: function(val){ 
								if (object_list.selectedChild != null)
								return object_list.selectedChild.link.properties.name = (val == undefined) 
										? object_list.selectedChild.link.properties.name : val;
							}
						}));
body_properties.addItem(new GUI.field({name: 'type', 
							type: 'text',
							link: function(val){ 
								if (object_list.selectedChild != null)
								return object_list.selectedChild.link.properties.type = (val == undefined) 
										? object_list.selectedChild.link.properties.type : val;
							}
						}));
body_properties.addItem(new GUI.field({name: 'fixedRotation', 
							type: 'text',
							link: function(val){ 
								if (object_list.selectedChild != null)
								return object_list.selectedChild.link.properties.fixedRotation = (val == undefined) 
										? object_list.selectedChild.link.properties.fixedRotation : val;
							}
						}));
body_properties.addItem(new GUI.field({name: 'linearDamping', 
							type: 'text',
							link: function(val){ 
								if (object_list.selectedChild != null)
								return object_list.selectedChild.link.properties.linearDamping = (val == undefined) 
										? object_list.selectedChild.link.properties.linearDamping : val;
							}
						}));
body_properties.addItem(new GUI.field({name: 'AngularDamping', 
							type: 'text',
							link: function(val){ 
								if (object_list.selectedChild != null)
								return object_list.selectedChild.link.properties.linearDamping = (val == undefined) 
										? object_list.selectedChild.link.properties.linearDamping : val;
							}
						}));


var shape_properties = object_properties.addItem(new GUI.container({name: 'Shape properties', orientation: 'vertical', isTable: true}));
shape_properties.elem.className += ' border';

shape_properties.addItem(new GUI.field({name: 'name', 
							type: 'text',
							link: function(val){ 
								if (object_list.selectedChild != null)
								return object_list.selectedChild.link.properties.name = (val == undefined) 
										? object_list.selectedChild.link.properties.name : val;
							}
						}));
shape_properties.addItem(new GUI.field({name: 'fixtures', 
							type: 'text',
							link: function(val){ 
								if (object_list.selectedChild != null)
								return object_list.selectedChild.link.properties.fixtures = (val == undefined) 
										? object_list.selectedChild.link.properties.fixtures : val;
							}
						}));
shape_properties.addItem(new GUI.field({name: 'density', 
							type: 'text',
							link: function(val){ 
								if (object_list.selectedChild != null)
								return object_list.selectedChild.link.properties.density = (val == undefined) 
										? object_list.selectedChild.link.properties.density : val;
							}
						}));
shape_properties.addItem(new GUI.field({name: 'friction', 
							type: 'text',
							link: function(val){ 
								if (object_list.selectedChild != null)
								return object_list.selectedChild.link.properties.friction = (val == undefined) 
										? object_list.selectedChild.link.properties.friction : val;
							}
						}));
shape_properties.addItem(new GUI.field({name: 'restitution', 
							type: 'text',
							link: function(val){ 
								if (object_list.selectedChild != null)
								return object_list.selectedChild.link.properties.restitution = (val == undefined) 
										? object_list.selectedChild.link.properties.restitution : val;
							}
						}));
shape_properties.addItem(
						new GUI.field({name: 'threshold', 
							type: 'text',
							link: function(val){ 
								if (object_list.selectedChild != null)
								return object_list.selectedChild.link.properties.threshold = (val == undefined) 
										? object_list.selectedChild.link.properties.threshold : val;
							}
						})
					).do(
						function(that){
							that.events.onChange.push(
								function (that){
									if (object_list.selectedChild != null)
										object_list.selectedChild.link.update();

								}
							);	
						}
					);
							
object_properties.doForAll(function(that){ that.elem.style.display = 'none';  });