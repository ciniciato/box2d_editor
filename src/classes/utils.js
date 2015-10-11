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
      t3 = t2 * t;
  return a + (-a * 3 + t * (3 * a - a * t)) * t
           + (3 * b + t * (-6 * b + b * 3 * t)) * t
           + (c * 3 - c * 3 * t) * t2
           + d * t3;
}