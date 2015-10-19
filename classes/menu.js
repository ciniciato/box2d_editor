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
		this.elem.innerHTML += '<span class="tooltip">'+ this.caption +'</span>';
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
		this.elem.innerHTML = '<div class="content"></div>';
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