var object = {
	container : function(_args){
		var _args     = (_args == undefined) ? {} : _args;
		this.elem     = null;
		this.children = [];
		this.parent   = null;
		this.id       = '';
		this.object   = (_args.object == undefined) ? {} : _args.object;
		this.caption  = (_args.object == undefined) ? 'Undefined' : _args.object.type;
		this.icon     = (_args.icon == undefined) ? 'report' : _args.icon;
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
	}
}

object.body = function(_args){
	_args = (_args == undefined) ? {} : _args;
	var obj = (_args.object != undefined) ? _args.object : new physic_object.body({});
 	object.container.call(this, {object: obj,
 									icon: 'accessibility'});
	this.object.properties.name = this.caption;
}

object.body.prototype             = new object.container(); 
object.body.prototype.constructor = object.body;

object.body.prototype.paste = function(){
	var r = this.parent.add_item(new object.body({object: this.object.paste()}));
	for (var i = 0; i < this.children.length; i++){
		this.children[i].paste({parent: r});
	}
}


object.shape = function(_args){
	var obj = (_args.object != undefined) ? _args.object : new physic_object.shape({properties: _args.properties});
  	object.container.call(this, {object: obj,
  								icon: 'mode edit'});
	this.object.properties.name = this.caption;
}

object.shape.prototype             = new object.container(); 
object.shape.prototype.constructor = object.shape;

object.shape.prototype.paste = function(_args){
	_args = (_args == undefined) ? {} : _args;
	_args.parent = (_args.parent == undefined) ? this.parent : _args.parent;
	if (_args.parent.object.type == 'shape') _args.parent = _args.parent.parent;
	_args.parent.add_item(new object.shape({object: this.object.paste()}));
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
		if (this.copy_buffer != null)
			this.copy_buffer.paste({parent: this.selected});
	}
}

Objects_list.elem.content = Objects_list.elem;