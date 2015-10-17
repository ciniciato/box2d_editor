Control.init();

var ToolBar = new menu({div: 'toolbar'});

ToolBar.add_item(new group({caption: 'Pen'}));
ToolBar.last().add_item(new button({caption: 'Pen', 
									icon: 'img/icon_addanchor.png', 
								 onclick: function(){ 
								 			Tools.set('pen')
								 			Tools_properties.select(Tools.pen); 
								 		}  
								 }));
ToolBar.last().add_item(new button({caption: 'Transform', 
									icon: 'img/icon_transform.png', 
								 onclick: function(){ 
								 			Tools.set('transform'); 
								 			Tools_properties.select(Tools.transform); 
								 		} 
								 }));
/*
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
*/
var Properties_menu = new menu({div: 'properties_menu'});
Properties_menu.add_item(new button({caption: 'New Body', 
									size: 'small',
									icon: 'accessibility', 
								 onclick: function(){ 
											Objects_list.select(Objects_list.add_item(new object.body()).id);
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

var Tools_properties = new properties_container({	id: 'tool_properties', 
													orientation: 'horizontal', 
													varname: 'Tools_properties',
													p_object: function() { return Tools.selected;} });

Tools_properties.add_item(new property_group({caption: 'pen', orientation: 'horizontal'}));
Tools_properties.last().add_item(new field({caption: 'density', type: 'text'}));
Tools_properties.last().add_item(new field({caption: 'friction', type: 'text'}));
Tools_properties.last().add_item(new field({caption: 'restitution', type: 'text'}));
Tools_properties.last().add_item(new field({caption: 'threshold', type: 'text'}));

Tools_properties.add_item(new property_group({caption: 'transform', orientation: 'horizontal'}));
Tools_properties.last().add_item(new field({caption: 'width', type: 'text'}));
Tools_properties.last().add_item(new field({caption: 'height', type: 'text'}));


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