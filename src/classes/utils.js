Array.prototype.removeDuplicates = function (){
  var temp = new Array();
  label : for (i = 0; i < this.length;i++){
            for (var j = 0; j < temp.length; j++){
              if (temp[j].x == this[i].x && temp[j].y == this[i].y)
                continue label;      
            }
            temp[temp.length] = this[i];
          }
  return temp;
} 

function getSignal(_value){
	if (_value!=0)
		return _value/Math.abs(_value);
	else
		return 0;
}

function bezierInterpolation(t, a, b, c, d) {
  var t2 = t * t,
      t3 = t2 * t,
       x = (a.x + (-a.x * 3 + t * (3 * a.x - a.x * t)) * t
           + (3 * b.x + t * (-6 * b.x + b.x * 3 * t)) * t
           + (c.x * 3 - c.x * 3 * t) * t2
           + d.x * t3),
       y = (a.y + (-a.y * 3 + t * (3 * a.y - a.y * t)) * t
           + (3 * b.y + t * (-6 * b.y + b.y * 3 * t)) * t
           + (c.y * 3 - c.y * 3 * t) * t2
           + d.y * t3);
  return {x: x, y: y};
}