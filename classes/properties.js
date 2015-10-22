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
		if (this.type == 'text')//<input type="checkbox" name="vehicle" value="Bike">
			this.elem.innerHTML += '<'+tag+' class="input"><input class="content" oninput="'+tree.varname+
				'.change({field: &quot;'+this.caption+'&quot;})" onchange="'+tree.varname+'.change({field: &quot;'+
					this.caption+'&quot;, update: true})" type="text"></td>';
		else if (this.type == 'check'){
			this.elem.innerHTML += '<'+tag+' class="input"><input class="content" type="checkbox" onchange="'+tree.varname+'.change({field: &quot;'+
					this.caption+'&quot;, update: true})"></td>';			
		}
		else if (this.type == 'select'){
			var str = '<'+tag+' class="input"><select class="content"  onchange="'+tree.varname+'.change({field: &quot;'+this.caption+'&quot;, update: true})">';
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
	this.p_object = (_args.p_object == undefined) ? null : _args.p_object;
	this.object = (_args.object == undefined) ? null : _args.object;
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
	this.change = function(_args){
		var obj = (this.object == null) ? this.p_object() : this.object;
		_args.update = (_args.update != undefined) ? _args.update : false;
		for (i = 0; i < this.selected.children.length && this.selected.children[i].caption != _args.field; i++){
		}
		obj.properties[_args.field] = (i < this.selected.children.length) ? 
				this.selected.children[i].elem.content.value : null;
		if (_args.update) obj.update();
		if (_args.field == 'name')
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
	this.update = function(){
		var obj = (this.object == null) ? this.p_object() : this.object;
		if (this.selected != null && obj != null)
			for (i = 0; i < this.selected.children.length; i++)
				this.selected.children[i].elem.content.value = obj.properties[this.selected.children[i].caption];
	};
}