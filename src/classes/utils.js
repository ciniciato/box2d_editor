Array.prototype.removeDuplicates = function (){
  var temp=new Array();
  label:for(i=0;i<this.length;i++){
        for(var j=0; j<temp.length;j++ ){//check duplicates
            if(temp[j].x==this[i].x && temp[j].y==this[i].y)//skip if already present 
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