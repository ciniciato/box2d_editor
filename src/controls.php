        <div id="panel_tools" class="panel">
            <div class="section">
                <div class="button">
                    <div id="ttpen" onClick="Controls.event(['tools', 'pen']);">
                        <img src="img/icon_pen.png">
                    </div>
                    <div class="mdl-tooltip" for="ttpen">
                        Pen
                    </div>
                </div>
                <div class="button">
                    <div id="ttselectpoints" onClick="Controls.event(['tools', 'select_points']);">
                        <img src="img/icon_selectpoint.png">
                    </div>
                    <div class="mdl-tooltip" for="ttselectpoints">
                        Select points
                    </div>
                </div>
                <div class="button">
                    <div id="ttremoveanchorpoint" onClick="Controls.event(['tools', 'remove_anchor_point']);">
                        <img src="img/icon_removeanchor.png">
                    </div>
                    <div class="mdl-tooltip" for="ttremoveanchorpoint">
                        Remove anchor point
                    </div>
                </div>
                <div class="title" style="text-align:center">
                    Pen
                </div>
            </div>      
            <div class="section">
                <div class="button">
                    <div id="ttcircle" onClick="Controls.event(['tools', 'circle']);">
                        <img src="img/icon_circle.png">
                    </div>
                    <div class="mdl-tooltip" for="ttcircle">
                        Circle
                    </div>
                </div>
                <div class="button">
                    <div id="ttfixedpoly" onClick="Controls.event(['tools', 'fixed_poly']);">
                        <img src="img/icon_poly.png">
                    </div>
                    <div class="mdl-tooltip" for="ttfixedpoly">
                        Fixed Polygon
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
                <div class="button">
                    <div id="ttdrag"  onClick="Controls.event(['tools', 'drag']);">
                        <img src="img/icon_drag.png">
                    </div>
                    <div class="mdl-tooltip" for="ttdrag">
                        Drag
                    </div>
                </div>
                <div class="button">
                    <div id="tttransform"  onClick="Controls.event(['tools', 'transform']);">
                        <img src="img/icon_transform.png">
                    </div>
                    <div class="mdl-tooltip" for="tttransform">
                        Transform
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
                                <div class="button_small">
                                    <div id="ttaddbody"  onClick="Controls.event(['tools', 'addbody']);">
                                        <img src="img/icon_add.png">
                                    </div>
                                    <div class="mdl-tooltip" for="ttaddbody">
                                        Add Body
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
    }

    Controls.panel = function(_id){
        this.elem = document.getElementById('panel_'+_id);
        this.children = [];
        this.DOM = [];
        this.parent = null;
    }

    Controls.panel.prototype.add = function(_id){
        var id = (_id[3]=='_') ? _id.slice(4) : _id;
        this.DOM[id] = {};
        this.DOM[id].name = id;
        this.DOM[id].elem = (_id[3]=='_') ? document.getElementById(_id) : null;
        return this.DOM[id];
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
                    debugDraw.objects.selected().update();
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

        this.panels.tools  = new this.panel('tools');
        this.panels.tools.add('pen');
        this.panels.tools.DOM.pen.event = function(){
            debugDraw.Tools.set('pen');
            Controls.log('pen tool');
        }
        //select_points remove_anchor_point
        this.panels.tools.add('select_points');
        this.panels.tools.DOM.select_points.event = function(){
            debugDraw.Tools.set('select_points');
            Controls.log('select points tool');
        }

        this.panels.tools.add('remove_anchor_point');
        this.panels.tools.DOM.remove_anchor_point.event = function(){
            debugDraw.Tools.set('remove_anchor_point');
            Controls.log('remove anchor point tool');
        }

        this.panels.tools.add('addbody');
        this.panels.tools.DOM.addbody.event = function(){
            debugDraw.objects.add('body'); 
        }

        this.panels.tools.add('transform').event = function(){
            debugDraw.Tools.set('transform');
            Controls.log('transform tool');
        }

        this.panels.tools.add('test');
        this.panels.tools.DOM.test.event = function(){
            for (var k = 0; k < debugDraw.objects.list.length; k++){
                if (debugDraw.objects.list[k].type == 'body'){
                    var body = Box2d.create_body({  x: debugDraw.objects.list[k].aabb.x, 
                                                    y: debugDraw.objects.list[k].aabb.y },
                                                 {type: debugDraw.objects.list[k].property('type').val});
                    for (var i = 0; i < debugDraw.objects.list[k].children.length; i++){
                            var points = [], points_str = '', ind = debugDraw.objects.list[k].children[i];
                            for (var c = 0; c < debugDraw.objects.list[ind].rpoints.length; c++){
                                points.push({ x: debugDraw.objects.list[ind].rpoints[c].x - debugDraw.objects.list[k].aabb.x,
                                              y: debugDraw.objects.list[ind].rpoints[c].y - debugDraw.objects.list[k].aabb.y});

                            }
                            Box2d.create_poly(points[0], points, {restitution: debugDraw.objects.list[ind].property('restitution').val}, body);
                    }
                }
            }
        }

        this.panels.info   = new this.panel('info');

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