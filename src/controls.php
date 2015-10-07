
<div id="panel_tools" class="panel">
    <div class="section">
        <div class="button">
            <div id="ttline" onClick="Controls.event(['tools', 'line_poly']);">
                <img src="img/icon_line.png">
            </div>
            <div class="mdl-tooltip" for="ttline">
                Line polygon
            </div>
        </div>
        <div class="button">
            <div id="ttpoly" onClick="Controls.event(['tools', 'fixed_poly']);">
                <img src="img/icon_poly.png">
            </div>
            <div class="mdl-tooltip" for="ttpoly">
                Fixed Polygon
            </div>
        </div>
        <div class="button">
            <div id="ttcircle" onClick="Controls.event(['tools', 'circle']);">
                <img src="img/icon_circle.png">
            </div>
            <div class="mdl-tooltip" for="ttcircle">
                Circle
            </div>
        </div>
        <div class="title" style="text-align:center">
            Shapes
        </div>
    </div>      
    <div class="section">
        <div class="button">
            <div id="ttweld" onClick="Controls.event(['tools', 'weld']);">
                <img src="img/icon_weld.png">
            </div>
            <div class="mdl-tooltip" for="ttweld">
                Weld
            </div>
        </div>
        <div class="button">
            <div id="ttrevolute" onClick="Controls.event(['tools', 'revolute']);">
                <img src="img/icon_revolute.png">
            </div>
            <div class="mdl-tooltip" for="ttrevolute">
                Revolute
            </div>
        </div>
        <div class="button">
            <div id="ttdistance" onClick="Controls.event(['tools', 'distance']);">
                <img src="img/icon_distance.png">
            </div>
            <div class="mdl-tooltip" for="ttdistance">
                Distance
            </div>
        </div>
        <div class="title" style="text-align:center">
            Joints
        </div>
    </div>      
    <div class="section">
        <span class="button">
            <div id="ttaddbody"  onClick="Controls.event(['tools', 'addbody']);">
                <img src="img/icon_add.png">
            </div>
            <div class="mdl-tooltip" for="ttaddbody">
                Add
            </div>
        </span>
        <div class="title" style="text-align:center">
            Body
        </div>
    </div>    
    <div class="section">
        <div class="button">
            <div id="ttdrag"  onClick="Controls.event(['tools', 'drag']);">
                <img src="img/icon_drag.png">
            </div>
            <div class="mdl-tooltip" for="ttdrag">
                Drag
            </div>
        </div>
        <div class="button">
            <div id="ttpointer"  onClick="Controls.event(['tools', 'pointer']);">
                <img src="img/icon_pointer.png">
            </div>
            <div class="mdl-tooltip" for="ttpointer">
                Pointer
            </div>
        </div>
        <div class="button">
            <div id="tttest"  onClick="Controls.event(['tools', 'test']);">
                <img src="img/icon_test.png">
            </div>
            <div class="mdl-tooltip" for="tttest">
                Test
            </div>
        </div>
        <div class="title" style="text-align:center">
            Tools
        </div>
    </div>     
</div>

<div id="workspace">
    <table cellspacing="0" cellpadding="0">
        <tr> 
            <td id="td_panel">      
                <div id="panel_bodies" class="panel">
                    <span class="item">
                        Objects
                        <div class="button_small">
                            <div id="ttclearall"  onClick="Controls.event(['bodies', 'clear_all']);">
                                <img src="img/icon_clear.png">
                            </div>
                            <div class="mdl-tooltip" for="ttclearall">
                                Clear All
                            </div>
                        </div>
                    </span>
                    <ul id="lst_objects" class="list">
                    </ul>
                    <span class="item">
                        Properties
                    </span>
                        <div id="div_properties">
                            <table id="properties_shape">
                                <tr> 
                                    <td>
                                        <label>name</label>
                                    </td> 
                                    <td>
                                        <input class="mdl-textfield__input" type="text" id="field_name" value="" oninput="Controls.event(['bodies', 'properties'], {field: 'name'})" />
                                    </td> 
                                </tr>       
                                <tr> 
                                    <td>
                                        <label>density</label>
                                    </td> 
                                    <td>
                                        <input class="mdl-textfield__input" type="text" id="field_density" value="" onchange="Controls.event(['bodies', 'properties'], {field: 'density'})" />
                                    </td> 
                                </tr>   
                                <tr> 
                                    <td>
                                        <label>friction</label>
                                    </td> 
                                    <td>
                                        <input class="mdl-textfield__input" type="text" id="field_friction" value="" onchange="Controls.event(['bodies', 'properties'], {field: 'friction'})" />
                                    </td> 
                                </tr>   
                                <tr> 
                                    <td>
                                        <label>restitution</label>
                                    </td> 
                                    <td>
                                        <input class="mdl-textfield__input" type="text" id="field_restitution" value="" onchange="Controls.event(['bodies', 'properties'], {field: 'restitution'})" />
                                    </td> 
                                </tr>    
                                <tr> 
                                    <td>
                                        <label>type</label>
                                    </td> 
                                    <td>
                                        <select id="field_type" onchange="Controls.event(['bodies', 'properties'], {field: 'type'})">
                                            <option value="poly">poly</option>
                                            <option value="line">line</option>
                                            <option value="circle">circle</option>
                                        </select> 
                                    </td> 
                                </tr>    
                                <tr> 
                                    <td>
                                        <label>thick</label>
                                    </td> 
                                    <td>
                                        <input class="mdl-textfield__input" type="text" id="field_thick" value="0" onchange="Controls.event(['bodies', 'properties'], {field: 'thick'})" />
                                    </td> 
                                </tr>    
                                <tr> 
                                    <td>
                                        <label>threshold</label>
                                    </td> 
                                    <td>
                                        <input class="mdl-textfield__input" type="text" id="field_threshold" value="0" onchange="Controls.event(['bodies', 'properties'], {field: 'threshold'})" />
                                    </td> 
                                </tr>
                                <tr> 
                                    <td>
                                        <label>fixtures</label>
                                    </td> 
                                    <td>
                                        <input class="mdl-textfield__input" type="text" id="field_fixtures" value="0" onchange="Controls.event(['bodies', 'properties'], {field: 'fixtures'})" />
                                    </td> 
                                </tr>
                            </table>
                            <table id="properties_joint">
                                <tr> 
                                    <td>
                                        <label>joint</label>
                                    </td> 
                                    <td>
                                        <input class="mdl-textfield__input" type="text" id="" value="" />
                                    </td> 
                                </tr>     
                            </table>
                            <table id="properties_body">
                                <tr> 
                                    <td>
                                        <label>name</label>
                                    </td> 
                                    <td>
                                        <input class="mdl-textfield__input" type="text" id="field_name" value="" onchange="Controls.event(['bodies', 'properties'], {field: 'name'})" />
                                    </td> 
                                </tr>   
                                <tr> 
                                    <td>
                                        <label>type</label>
                                    </td> 
                                    <td>
                                        <select id="field_type" onchange="Controls.event(['bodies', 'properties'], {field: 'type'})">
                                            <option value="dynamic">dynamic</option>
                                            <option value="static">static</option>
                                        </select> 
                                    </td> 
                                </tr>    
                                <tr> 
                                    <td>
                                        <label>linearDamping</label>
                                    </td> 
                                    <td>
                                        <input class="mdl-textfield__input" type="text" id="field_linearDamping" value="" onchange="Controls.event(['bodies', 'properties'], {field: 'linearDamping'})" />
                                    </td> 
                                </tr>   
                                <tr> 
                                    <td>
                                        <label>angularDamping</label>
                                    </td> 
                                    <td>
                                        <input class="mdl-textfield__input" type="text" id="field_angularDamping" value="" onchange="Controls.event(['bodies', 'properties'], {field: 'angularDamping'})" />
                                    </td> 
                                </tr>   
                                <tr> 
                                    <td>
                                        <label>fixedRotation</label>
                                    </td> 
                                    <td>
                                        <select id="field_fixedRotation" onchange="Controls.event(['bodies', 'properties'], {field: 'fixedRotation'})">
                                            <option value="false">false</option>
                                            <option value="true">true</option>
                                        </select>
                                    </td> 
                                </tr>     
                            </table>
                        </div>
                    </div>
                </div>
            </td> 
            <td id="td_canvas">
                <canvas id="canvas_debug"></canvas>
                <div id="msg_log"></div>
            </td> 
        </tr>      
    </table>
</div>

<div id="panel_info" class="panel">
    <div class="section">
        <label for="chk_grid" class="mdl-checkbox mdl-js-checkbox input" id='mdl_grid'>
            grid
            <input type="checkbox" class="mdl-checkbox__input" id='chk_grid' OnChange="Controls.event(['info', 'grid']);" />
        </label>
    </div>
    <div class="section">
        <label for="chk_orto" class="mdl-checkbox mdl-js-checkbox input" id='mdl_orto'>
            ortogonal
            <input type="checkbox" class="mdl-checkbox__input" id='chk_orto' OnChange="Controls.event(['info', 'orto']);" />
        </label>
    </div>
    <div class="section">
        <span class="input" id="inp_status">
        </span>
    </div>
    <div class="section">
        <span class="input">
            zoom
            <input oninput=""
                type="range" min=".1" step=".1" max="2" value="1" tabindex="0"/>
        </span>
    </div>
    <div class="section">
        <span class="input">
            fps
            50
        </span>
    </div>

</div>

<script>
    var Controls = {
        panels: [],
        poly:{
        },
        draw:{
        }
    };

    Controls.log = function (msg){
        var txt = $('#msg_log').html();
        $('#msg_log').html(msg +'<br>' + txt);
        //$('#msg_log').fadeIn(1500).delay(2000).fadeOut(1500);
    }

    Controls.panel = function(_id){
        this.elem = document.getElementById('panel_'+_id);
        this.children = [];
        this.DOM = [];
        this.parent = null;
        //$('#panel_'+_id).resizable();    
        //$('#panel_'+_id).draggable();
    }

    Controls.panel.prototype.add = function(_id){
        var id = (_id[3]=='_') ? _id.slice(4) : _id;
        this.DOM[id] = {};
        this.DOM[id].name = id;
        this.DOM[id].elem = (_id[3]=='_') ? document.getElementById(_id) : null;
    }

    Controls.init = function(){
        this.panels.bodies = new this.panel('bodies');

        this.panels.bodies.add('lst_objects');

        this.panels.bodies.add('div_properties')
        this.panels.bodies.DOM.properties.event = function(_args){
            var parent = debugDraw.objects.selected();
                props = parent.properties;
            for (var i = 0; i < props.length; i++){
                if (props[i].name == _args.field){
                    props[i].val = $("#div_properties #properties_"+parent.type+" #field_"+_args.field).val();
                    if (_args.field == 'name')
                        $("#"+parent.name+" > .title").html(props[i].val);
                    break;
                }
            }
        }


        this.panels.bodies.add('clear_all');
        this.panels.bodies.DOM.clear_all.event = function(){
            Controls.panels.bodies.DOM.objects.elem.innerHTML = '';
            debugDraw.objects.clear();
        }

        $("#lst_objects").sortable();
        $("#lst_objects").disableSelection();
        //$("#properties_body").colResizable();     

        this.panels.tools  = new this.panel('tools');
        this.panels.tools.add('line_poly');
        this.panels.tools.DOM.line_poly.event = function(){
            debugDraw.Tools.set('line');
            Controls.log('line tool');
        }

        this.panels.tools.add('fixed_poly');
        this.panels.tools.DOM.fixed_poly.event = function(){
            debugDraw.body.new_shape('fixed_poly');
            Controls.panels.info.DOM.status.event('fixed poly tool');
        }

        this.panels.tools.add('circle');
        this.panels.tools.DOM.circle.event = function(){
            debugDraw.Pointer.action('CIRCLE_TOOL');            
            Controls.panels.info.DOM.status.event('circle tool');
        }

        this.panels.tools.add('weld');
        this.panels.tools.DOM.weld.event = function(){
        }

        this.panels.tools.add('revolute');
        this.panels.tools.DOM.revolute.event = function(){
        }

        this.panels.tools.add('distance');
        this.panels.tools.DOM.distance.event = function(){
        }

        this.panels.tools.add('addbody');
        this.panels.tools.DOM.addbody.event = function(){
            debugDraw.objects.add('body'); 
        }

        this.panels.tools.add('drag');
        this.panels.tools.DOM.drag.event = function(){
            debugDraw.Pointer.action('POINTER_TOOL');        
            Controls.panels.info.DOM.status.event('drag tool');
        }

        this.panels.tools.add('pointer');
        this.panels.tools.DOM.pointer.event = function(){
            debugDraw.Pointer.action('POINTER_TOOL');     
            Controls.panels.info.DOM.status.event('pointer tool');
        }

        this.panels.tools.add('test');
        this.panels.tools.DOM.test.event = function(){
            for (var k = 0; k < debugDraw.bodies.length; k++){
                var body = Box2d.create_body({  x: debugDraw.bodies[k].aabb.x, 
                                                y: debugDraw.bodies[k].aabb.y });
                for (var i = 0; i < debugDraw.bodies[k].shapes.length; i++){
                    if (debugDraw.bodies[k].shapes[i].type=='arc')
                        Box2d.create_circle({x: debugDraw.bodies[k].shapes[i].points[0].x - debugDraw.bodies[k].aabb.x,
                                             y: debugDraw.bodies[k].shapes[i].points[0].y - debugDraw.bodies[k].aabb.y},
                                                debugDraw.bodies[k].shapes[i].radius, {}, body);
                    else if ((debugDraw.bodies[k].shapes[i].type == 'poly') || (debugDraw.bodies[k].shapes[i].type == 'fixed_poly')){
                        var points = [], points_str = '';
                        for (var c = 0; c < debugDraw.bodies[k].shapes[i].points.length; c++){
                            points.push({ x: debugDraw.bodies[k].shapes[i].points[c].x - debugDraw.bodies[k].aabb.x,
                                          y: debugDraw.bodies[k].shapes[i].points[c].y - debugDraw.bodies[k].aabb.y});

                        }
                        Box2d.create_poly(points[0], points, {}, body);
                    }
                }
            }
        }

        this.panels.info   = new this.panel('info');

        this.panels.info.add('inp_status');
        this.panels.info.DOM.status.event = function(_val){
            this.elem.innerHTML = _val;
        }

        this.panels.info.add('chk_grid');
        this.panels.info.DOM.grid.event = function(){
           debugDraw.properties[this.name] = this.elem.checked;
        }

        this.panels.info.add('chk_orto');
        this.panels.info.DOM.orto.event = function(){
           debugDraw.properties[this.name] = this.elem.checked  ;
        }
    }

    Controls.event = function(_tree, _args){
        this.panels[_tree[0]].DOM[_tree[1]].event((_args != undefined) ? _args : {});
    }

    Controls.zoom = function(){
        var value = document.getElementById('inp_zoom').value;
        this.change_value('zoom');
        debugDraw.Camera.zoom(value);
    }

    Controls.init();
</script>