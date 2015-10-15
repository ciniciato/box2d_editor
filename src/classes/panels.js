function button(_args){
	this.elem = null;
	this.icon = (_args.icon == undefined) ? 'img/icon_add.png' : _args.icon;
	this.size = (_args.size == undefined) ? 'default' : _args.size;
	this.parent = (_args.parent == undefined) ? null : _args.parent;
	this.caption = (_args.caption == undefined) ? 'Undefined' : _args.caption;
	this.onclick = (_args.onclick == undefined) ?  function(){} : _args.onclick;
	this.init = function(){
		var node = document.createElement("div");
		this.elem = this.parent.elem.content.appendChild(node); 
		this.elem.className = 'button button_'+this.size;
		if (this.icon.indexOf('img') == -1)
			this.elem.innerHTML = '<i class="material-icons btn_view">'+this.icon+'</i>';
		else
			this.elem.innerHTML = '<img src="' + this.icon + '">';
		this.elem.content = this.elem;
		this.elem.onclick = this.onclick;
	};
}

function group(_args){
	this.elem = null;
	this.children = [];
	this.parent = (_args.parent == undefined) ? null : _args.parent;
	this.caption = (_args.caption == undefined) ? 'Undefined' : _args.caption;
	this.add_item = function(i){
		i.parent = this;
		i.init();
		this.children.push(i);
		return this;
	};
	this.item = function(id){
		for (i in this.children){
			if (this.children[i].id == id)
				return this.children[i];
		}
	};
	this.last = function(){
		return this.children[this.children.length - 1];
	};
	this.init = function(){
		var node = document.createElement("div");
		this.elem = this.parent.elem.appendChild(node); 
		this.elem.innerHTML = '<div class="content"></div><span class="title">'+ this.caption +'<span>';
		this.elem.className = 'group';
		this.elem.content = this.elem.getElementsByClassName('content')[0];
	};
}

function menu(_args){ 	
	this.elem = document.getElementById(_args.div);
	this.elem.content = this.elem;
	this.elem.className = "menu";
	this.children = [];
	this.selected = null;
	this.add_item = function(i){
		i.parent = this;
		i.init();
		this.children.push(i);
		return this;
	};
	this.item = function(id){
		for (i in this.children){
			if (this.children[i].id == id)
				return this.children[i];
		}
	};
	this.last = function(){
		return this.children[this.children.length - 1];
	};
	this.init = function(){
	};
	this.select = function(id){
		if (this.selected != null)
			this.selected.elem.className = this.selected.elem.className.replace('selected', '');
		function find(id, obj){
			var ind = 0, r = null, aux;
			if (obj.id == id){
				r = obj;		
			}else while (ind < obj.children.length){
				aux = find(id, obj.children[ind]);
				if (aux != null){
					r = aux;
					break;
				}
				ind++;
			}
			return r;
		}
		this.selected = find(id, this);
		this.selected.elem.className += ' selected';
	};
}

var ToolBar = new menu({div: 'toolbar'});

ToolBar.add_item(new group({caption: 'Pen'}));
ToolBar.last().add_item(new button({caption: 'Pen', 
									icon: 'img/icon_addanchor.png', 
								 onclick: function(){ 
								 			Tools.set('pen')
								 			Tools_properties.select(debugDraw.Tools.pen); 
								 		}  
								 }));
ToolBar.last().add_item(new button({caption: 'Select points', 
									icon: 'img/icon_selectpoint.png', 
								 onclick: function(){ 
								 			debugDraw.Tools.set('select_points'); 
								 			Tools_properties.select(); 
								 		} 
								 }));
ToolBar.add_item(new group({caption: 'Shapes'}));
ToolBar.last().add_item(new button({caption: 'Circle', 
									icon: 'img/icon_circle.png', 
								 onclick: function(){alert();} }));
ToolBar.last().add_item(new button({caption: 'Polygon', 
									icon: 'img/icon_poly.png', 
								 onclick: function(){alert();} }));
ToolBar.add_item(new group({caption: 'Tools'}));
ToolBar.last().add_item(new button({caption: 'Teste', 
									icon: 'play_arrow', 
								 onclick: function(){alert();} }));

var Properties_menu = new menu({div: 'properties_menu'});
Properties_menu.add_item(new button({caption: 'New Body', 
									size: 'small',
									icon: 'accessibility', 
								 onclick: function(){ 
											Objects_list.select(Objects.addbody().id);
								 		}  
								 }));
Properties_menu.add_item(new button({caption: 'Delete',
									size: 'small', 
									icon: 'delete', 
								 onclick: function(){ 
								 			Objects_list.delete();
								 		}  
								 }));
Properties_menu.add_item(new button({caption: 'Copy', 
									size: 'small',
									icon: 'content_copy', 
								 onclick: function(){ 
								 			Objects_list.copy();
								 		}  
								 }));
Properties_menu.add_item(new button({caption: 'Paste', 
									size: 'small',
									icon: 'content_paste', 
								 onclick: function(){ 
								 			Objects_list.paste();
								 		}  
								 }));

function object_container(_args){
	var _args = (_args == undefined) ? {} : _args;
	this.elem = null;
	this.children = [];
	this.parent = null;
	this.id = '';
	this.object = (_args.object == undefined) ? {} : _args.object;
	this.caption = (_args.object == undefined) ? 'Undefined' : _args.object.type;
	this.icon = (_args.icon == undefined) ? 'report' : _args.icon;
	this.init = function(){
		var tree = this.parent, ntree = 0, i = 0, type_count = 0;
		for (i = 0; i < tree.children.length; i++)
			if (this.object.type == tree.children[i].object.type)
					type_count++;
		this.caption += '_'+type_count;
		while (tree.parent != null){
			tree = tree.parent;
			ntree++;
		}	
		this.id = this.caption + this.parent.children.length;
		if (this.parent.id != undefined)
			this.id = this.parent.id + this.id;
		var node = document.createElement("li");
		this.elem = this.parent.elem.content.appendChild(node); 
		this.elem.innerHTML = 	'<span class="wrap">'+
									'<i class="material-icons btn_view">visibility</i>'+
							  		'<span id="'+this.id+'" class="caption sub_'+ntree+
							  				'" onclick="Objects_list.select(&quot;'+this.id+'&quot;)">'
							  				+this.caption+
										'<i class="material-icons">'+this.icon+'</i>'+
							   		'</span>'+
							   	'</span>';
		this.elem.innerHTML = this.elem.innerHTML + '<ul class="list"></ul>';
		this.elem.className = 'group';
		this.elem.content = this.elem.getElementsByClassName('list')[0];
		this.elem.caption = this.elem.getElementsByClassName('caption')[0];
	};
	this.changetitle = function(val){
		str = this.elem.caption.innerHTML;
		this.elem.caption.innerHTML = val + str.substring(str.indexOf("<i"), str.length);
	};
	this.add_item = function(i){
		i.parent = this;
		i.init();
		this.children.push(i);
		return i;
	};
	this.last = function(){
		return this.children[this.children.length - 1];
	};
	this.paste = function(_args){
		var r = _args.parent.add_item(new object_container({object: this.object.paste(), icon: this.icon}));
		r.object.properties.name = r.caption;
		for (var i = 0; i < this.children.length; i++){
			this.children[i].paste({parent: r});
		}
	}
}

var Objects_list = {
	elem: document.getElementById('list_objects'),
	parent: null,
	children: [],
	selected: null,
	copy_buffer: null,
	add_item: function(i){
		i.parent = this;
		i.init();
		this.children.push(i);
		return i;
	},
	last: function(){
		return this.children[this.children.length - 1];
	},
	select: function(id){
		if (this.selected != null)
			this.selected.elem.className = this.selected.elem.className.replace('selected', '');
		function find(id, obj){
			var ind = 0, r = null, aux;
			if (obj.id == id){
				r = obj;		
			}else while (ind < obj.children.length){
				aux = find(id, obj.children[ind]);
				if (aux != null){
					r = aux;
					break;
				}
				ind++;
			}
			return r;
		}
		this.selected = find(id, this);
		Objects_properties.select(this.selected.object)
		this.selected.elem.className += ' selected';
	},
	render: function(_args){
		function all_tree(obj, args){
			var ind = 0;
			while (ind < obj.children.length){
				if (obj.children[ind].object != undefined)
					obj.children[ind].object.render(args);
				all_tree(obj.children[ind], args);
				ind++;
			}
		}		
		all_tree(this, _args);
	},
	delete: function(){
		if (this.selected != null){
			for(var i = 0; i < this.selected.parent.children.length; i++){
				if (this.selected === this.selected.parent.children[i]){
	 				this.selected.elem.parentNode.removeChild(this.selected.elem);
					this.selected.parent.children.splice(i, 1);
					if (this.selected.parent.object != undefined){
						this.select(this.selected.parent.id);
					} else
						this.selected = null;
					break;
				}
			}
		}
	},
	copy: function(){
		if (this.selected != null){
			this.copy_buffer = this.selected;
		}
	},
	paste: function(){
		var _parent = this;
		if (this.selected != null && this.selected.object.type == 'shape')
				_parent = this.selected.parent;
		if (this.copy_buffer != null)
			this.copy_buffer.paste({parent: _parent});
	}
}

Objects_list.elem.content = Objects_list.elem;


function property_group(_args){
	var _args = (_args == undefined) ? {} : _args;
	this.elem = null;
	this.children = [];
	this.parent = null;
	this.id = '';
	this.caption = (_args.caption == undefined) ? 'Undefined' : _args.caption;
	this.orientation = (_args.orientation == undefined) ? 'vertical' : _args.orientation;
	this.init = function(){
		var tree = this.parent, ntree = 0;
		while (tree.parent != null){
			tree = tree.parent;
			ntree++;
		}	
		this.id = this.caption + this.parent.children.length;
		if (this.parent.id != undefined)
			this.id = this.parent.id + this.id;
		var node = document.createElement("div");
		this.elem = this.parent.elem.appendChild(node); 
		this.elem.style.display = 'none';

		this.elem.id = this.id;
		if (this.orientation == 'vertical'){
			this.elem.innerHTML = "<table class='content'></table>";
			this.elem.content = this.elem.getElementsByClassName('content')[0];
		}else
			this.elem.content = this.elem;
		this.elem.className = 'group';
	};
	this.add_item = function(i){
		i.parent = this;
		i.init();
		this.children.push(i);
		return i;
	};
	this.last = function(){
		return this.children[this.children.length - 1];
	};
}

function field(_args){
	var _args = (_args == undefined) ? {} : _args;
	this.elem = null;
	this.children = [];
	this.parent = null;
	this.id = '';
	this.caption = (_args.caption == undefined) ? 'Undefined' : _args.caption;
	this.type = (_args.type == undefined) ? 'text' : _args.type;
	this.options = (_args.options == undefined) ? [] : _args.options;
	this.init = function(){
		var tree = this.parent, ntree = 0, path = '';
		while (tree.parent != null){
			tree = tree.parent;
			ntree++;
		}	
		this.id = this.caption + this.parent.children.length;
		if (this.parent.id != undefined)
			this.id =  this.parent.id + this.id;
		var tag = (this.parent.orientation == 'vertical') ? 'td' : 'div',
				node = (this.parent.orientation == 'vertical') ? document.createElement('tr') 
						: document.createElement('div');
		this.elem = this.parent.elem.content.appendChild(node);
		this.elem.innerHTML = '<'+tag+' class="caption">'+this.caption+':</'+tag+'>';
		if (this.type == 'text')
			this.elem.innerHTML += '<'+tag+' class="input"><input class="content" oninput="'+tree.varname+'.change(&quot;'+this.caption+'&quot;)" type="text"></td>';
		else if (this.type == 'select'){
			var str = '<'+tag+' class="input"><select class="content"  onchange="'+tree.varname+'.change(&quot;'+this.caption+'&quot;)">';
			for (var i = 0; i < this.options.length; i++){
				str += '<option value="'+this.options[i]+'">'+this.options[i]+'</option>';	
			}
			str += '</select></'+tag+'>';
			this.elem.innerHTML += str;
		}
		this.elem.content = this.elem.getElementsByClassName('content')[0];
		this.elem.className = 'field';
	};
	this.add_item = function(i){
		i.parent = this;
		i.init();
		this.children.push(i);
		return i;
	};
	this.last = function(){
		return this.children[this.children.length - 1];
	};
}

function properties_container(_args){
	this.elem = document.getElementById(_args.id);
	this.object = (_args.object == undefined) ? null : _args.object;
	this.p_object = (_args.p_object == undefined) ? null : _args.p_object;
	this.varname = (_args.varname == undefined) ? 'undefined' : _args.varname;
	this.orientation = (_args.orientation == undefined) ? 'vertical' : _args.orientation;
	this.elem.className = 'properties_container properties_container_'+this.orientation;
	this.parent = null;
	this.children = [];
	this.selected = null;
	this.add_item = function(i){
		i.parent = this;
		i.init();
		this.children.push(i);
		return i;
	};
	this.last = function(){
		return this.children[this.children.length - 1];
	};
	this.change = function(field){
		var obj = (this.object != null) ? this.object : this.p_object();
		for (i = 0; i < this.selected.children.length && this.selected.children[i].caption != field; i++){
		}
		obj.properties[field] = (i < this.selected.children.length) ? 
				this.selected.children[i].elem.content.value : null;
		if (field == 'name')
			Objects_list.selected.changetitle(this.selected.children[i].elem.content.value);
	};
	this.select = function(obj){
		if (this.selected != null)
			this.selected.elem.style.display = 'none';
		if (obj != undefined){
			var i = 0;
			while (i < this.children.length && this.children[i].caption != obj.type){
				i++;
			}
			this.selected = (i < this.children.length) ? this.children[i] : null;
			for (i = 0; i < this.selected.children.length; i++){
				this.selected.children[i].elem.content.value = obj.properties[this.selected.children[i].caption];
			}
			this.selected.elem.style.display = 'block';
		} else
			this.selected = null;
	};
}

var Tools_properties = new properties_container({	id: 'tool_properties', 
													orientation: 'horizontal', 
													varname: 'Tools_properties',
													object: Tools.pen});

Tools_properties.add_item(new property_group({caption: 'pen', orientation: 'horizontal'}));
Tools_properties.last().add_item(new field({caption: 'density', type: 'text'}));
Tools_properties.last().add_item(new field({caption: 'friction', type: 'text'}));
Tools_properties.last().add_item(new field({caption: 'restitution', type: 'text'}));
Tools_properties.last().add_item(new field({caption: 'threshold', type: 'text'}));

Tools_properties.add_item(new property_group({caption: 'select_points', orientation: 'horizontal'}));
Tools_properties.last().add_item(new field({caption: 'nameasd', type: 'text'}));

var Objects_properties = new properties_container({	id: 'object_properties', 
													varname: 'Objects_properties',
													p_object: function(){ return Objects_list.selected.object;}  })

Objects_properties.add_item(new property_group({caption: 'body'}));
Objects_properties.last().add_item(new field({caption: 'name', type: 'text'}));
Objects_properties.last().add_item(new field({caption: 'type', 
										type: 'select', 
										options: ['dynamic', 'fixed']}));
Objects_properties.last().add_item(new field({caption: 'fixedRotation', 
										type: 'select', 
										options: ['false', 'true']}));
Objects_properties.last().add_item(new field({caption: 'linearDamping', type: 'text'}));
Objects_properties.last().add_item(new field({caption: 'angularDamping', type: 'text'}));

Objects_properties.add_item(new property_group({caption: 'shape'}));
Objects_properties.last().add_item(new field({caption: 'name', type: 'text'}));
Objects_properties.last().add_item(new field({caption: 'density', type: 'text'}));
Objects_properties.last().add_item(new field({caption: 'friction', type: 'text'}));
Objects_properties.last().add_item(new field({caption: 'restitution', type: 'text'}));
Objects_properties.last().add_item(new field({caption: 'threshold', type: 'text'}));
Objects_properties.last().add_item(new field({caption: 'fixtures', type: 'text'}));

Objects_properties.add_item(new property_group({caption: 'joint'}));
Objects_properties.last().add_item(new field({caption: 'name', type: 'text'}));
Objects_properties.last().add_item(new field({caption: 'type', type: 'text'}));
Objects_properties.last().add_item(new field({caption: 'bodyA', type: 'text'}));
Objects_properties.last().add_item(new field({caption: 'bodyB', type: 'text'}));
