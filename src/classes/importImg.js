var ALL_NEIGHBORS = [],
	FOUR_NEIGHBORS = [];

var importImg = {
	canvas: document.getElementById('buffer'),
	ctx: document.getElementById('buffer').getContext('2d'), 
	imgData: null,
	channel: null,
	threshold: 2,
	separateByBody: false
};

importImg.load = function(src){
	img = new Image();
	img.src = src;
	var that = this;
	img.onload = function(){
		that.canvas.width = img.width;
		that.canvas.height = img.height;
		
		var win = document.getElementById('window');
		win.style.display = 'block';
		
		win.style.height = (img.height+50)+'px';
		win.style.width = img.width+'px';
		
		if (window.innerHeight<win.offsetHeight) win.style.height = window.innerHeight+'px';
		if (window.innerWidth<win.offsetWidth) win.style.width = window.innerWidth+'px';
		
		win.style.marginLeft = '-'+(win.offsetWidth/2)+'px';
		win.style.marginTop = '-'+(win.offsetHeight/2)+'px';
		
		var w = img.width;
		ALL_NEIGHBORS  = [1-w, 1+w, -1+w, -1-w, 1, w, -1, -w];
		FOUR_NEIGHBORS = [1, w, -1, -w];
		
		that.ctx.drawImage(img, 0, 0);
		that.imgData = that.ctx.getImageData(0, 0, that.canvas.width, that.canvas.height);
		that.getChannel();
		
		that.draw();	
	}		
}

importImg.draw = function(){
	this.segmentation.resize();
	this.segmentation.getRegions();
	this.segmentation.getPolygon();
	
	var ctx = importImg.ctx;
	ctx.clearRect(0,0, this.canvas.width, this.canvas.height);
	ctx.fillStyle = 'rgba(255, 198, 0, .3)';
	ctx.strokeStyle = 'rgba(255, 255, 255, .7)';
	ctx.beginPath();
	for (var p=0; p<this.segmentation.regionsLen; p++)
	{
		var poly = this.segmentation.regions[p].polygon;
		
		ctx.moveTo(poly[0], poly[1]);
		
		for (var i=0; i<poly.length; i+=2)
			ctx.lineTo(poly[i], poly[i+1]);
	}
	ctx.closePath();
	ctx.stroke();
	ctx.fill();
}

importImg.materialize = function(){		
	for (var p=0; p<this.segmentation.regionsLen; p++)
	{
		if (this.separateByBody || p==0)
			var body = Control.objectList.addBody();
		
		var poly = this.segmentation.regions[p].polygon;
		var shape = body.addShape({
					properties: {
								threshold: 0,
								restitution: 0,
								friction: 1,
								density: 1								
							}
				});
		
		function relPos(position){		
			position = { x: position.x - Camera.canvas.position.x,
						  y: position.y - Camera.canvas.position.y};
			return { 	x: Camera.position.x - Camera.size.width  + position.x / (World.scale * Camera.scale),
						y: Camera.position.y - Camera.size.height + position.y / (World.scale * Camera.scale)};
		}
		
		for (var i=0; i<poly.length; i+=2){
			shape.addPoint(relPos({x: poly[i], y: poly[i+1]}));
		}
	}
}

importImg.getChannel = function(){	
	this.channel = new Int16Array(importImg.canvas.width*importImg.canvas.height);
	for (var i=3, ic=0; i<this.imgData.data.length; i+=4, ic++)
		this.channel[ic] = (this.imgData.data[i]==255) ? 0 : 255;
}

importImg.segmentation = {
	regions: null,
	regionsLen: 0,
	labeledData: null,
	buffData: null,
	resize: function(){
		this.labeledData = new Int8Array(importImg.canvas.width*importImg.canvas.height);
		this.buffData = new Int32Array(importImg.canvas.width*importImg.canvas.height);
		this.regions = new Array(1000);
	},	
	getRegions: function(){//label regions and feature extraction
		var channel = importImg.channel;
		
		var h = importImg.canvas.height, w = importImg.canvas.width, 
			neighborLen = 0, currentNeighbor = 0, neighborInd = 0, tempInd = 0,

			regionIndex=0,

			x=0, y=0, i=0,
			isEdge = false,
			labeledData = this.labeledData,
			
			neighbors = this.buffData,
			region = null,

			maxX=0, maxY=0, minX=w, minY=h,
			maxXy=0, minXy=0, maxYx=0, minYx=0,
			xn=0, yn=0;
			

		//blank borders, prevent out bound search
		var lastrow=w*(h-1);
		for (var x = 0; x < w; x++)
			channel[x] = channel[x+w] = channel[lastrow+x] = channel[lastrow+x-w] = 255;	
		for (var y = 0; y < h; y++)
			channel[y*w] = channel[y*w+1] = channel[y*w+w-1] = channel[y*w+w-2] = 255;
		
		this.regionsLen = 0;

		var DIRS  = ALL_NEIGHBORS;
		
		for (y = 2; y < h-2; y++)
			for(x = 2; x < w-2; x++)
			{
				i = x + y*w;
				if (channel[i]==0 && labeledData[i]==0)
				{					
					neighborLen = 0;
					currentNeighbor = 0;
									
					regionIndex++;
										
					neighbors[neighborLen++] = i;
					labeledData[i] = regionIndex;
					
					region = {
						id: regionIndex,

						polygon: new Array(),

						edges: new Array(),
						perimeter: 0,

						points: new Array(),
						area: 0,						

						bounds: null
					};

					maxX=0; maxY=0; minX=w; minY=Math.floor(i/w); minYx=i-minY*w;
					
					while(currentNeighbor<neighborLen)
					{											
						neighborInd = neighbors[currentNeighbor++];
						region.points[region.area++] = neighborInd;

						isEdge = false;
											
						for (var iD = 0; iD < DIRS.length; iD++)
						{
							tempInd = neighborInd+DIRS[iD];
							if (channel[tempInd]<120) 
							{
								if (labeledData[tempInd]==0)
								{
									labeledData[tempInd] = regionIndex;	
									neighbors[neighborLen++] = tempInd;
								}
							} 
							else if (iD>3)
								isEdge = true;
						}			

						if (isEdge)
							region.edges[region.perimeter++] = neighborInd;

						yn = Math.floor(neighborInd/w);
						xn = neighborInd - yn*w;

						if (maxX < xn)
						{
							maxX = xn;
							maxXy = yn;
						}
						if (minX > xn)
						{ 
							minX = xn;
							minXy = yn;
						}
						if (maxY < yn)
						{
							maxY = yn;
							maxYx = xn;
						}
					}//while gettingNeighbors

					if (region.area>10)//prevent noise add
					{						
						region.bounds ={
											minX:[minX, minXy],
											maxX:[maxX, maxXy],
											minY:[minYx, minY],
											maxY:[maxYx, maxY]
										};				
						
						this.regions[this.regionsLen++] = region;
					}
				
				}//if
			}//for x
	},
	getPolygon: function(){
		var channel = importImg.channel;
		var h = importImg.canvas.height, w = importImg.canvas.width, 
			neighborLen = 0, currentNeighbor = 0, neighborInd = 0, tempInd = 0,
			buffLen = 0,
			firstPoint = 0,

			r=0, i=0, y=0, x=0,
			neighbors = this.buffData,
			buff = this.buffData.slice(),
			regionIndex=0, region = null,
			labeledData = this.labeledData,
			
			isClosed = false, added = false;
		
		var DIRS  = FOUR_NEIGHBORS;

		function IsEdge(ind, prevInd, reg){
			if (ind - prevInd == 1)//prev on left
			{
			    return (labeledData[ind-1-w] == reg ||
						labeledData[ind-1+w] == reg ||
						labeledData[ind+w]   == reg ||
						labeledData[ind-w]   == reg);
			}
			else if (ind - prevInd == -1)//prev on right
			{
			    return (labeledData[ind+1-w] == reg ||
						labeledData[ind+1+w] == reg ||
						labeledData[ind+w]   == reg ||
						labeledData[ind-w]   == reg);
			}
			else if (ind - prevInd == -w)//prev on bottom
			{
			    return (labeledData[ind-1+w] == reg ||
						labeledData[ind+1+w] == reg ||
						labeledData[ind+1]   == reg ||
						labeledData[ind-1]   == reg);

			}
			else if (ind - prevInd == w)//prev on top
			{			     
			    return (labeledData[ind+1-w] == reg ||
						labeledData[ind-1-w] == reg ||
						labeledData[ind+1]   == reg ||
						labeledData[ind-1]   == reg);

			}
			return false;
		}
		
		for (r=0; r < this.regionsLen; r++){			
			region = this.regions[r];
			regionIndex = region.id;
			firstPoint = region.points[0]-1;
			
			neighborLen = 0;
			currentNeighbor = 0;
			
			buffLen = 0;
			
			neighbors[neighborLen++] = firstPoint;
			labeledData[firstPoint]  = -regionIndex;
						
			isClosed = false;
			
			while(currentNeighbor<neighborLen && !isClosed)
			{					
				added = false;

				neighborInd = neighbors[currentNeighbor];

				y = Math.floor(neighborInd/w);
				x = neighborInd - y*w;
				region.polygon[currentNeighbor*2]   = x;
				region.polygon[currentNeighbor*2+1] = y;
				
				var ctx = importImg.ctx;
				ctx.beginPath();
				ctx.rect(x,y,5,5);
				ctx.closePath();
				ctx.fill();

				currentNeighbor++;	

				for (var iD = 0; iD < DIRS.length; iD++)
				{
					tempInd = neighborInd+DIRS[iD];
					if (!isClosed && neighborLen>=region.perimeter/10 && tempInd==firstPoint)
					{
						if ((region.perimeter/10>10 && neighborLen>=region.perimeter/10) || (neighborLen>10))
						{
							isClosed=true;
							break;
						}
					}
					if (Math.abs(labeledData[tempInd]) != regionIndex && IsEdge(tempInd, neighborInd, regionIndex)){
						if (!added)
						{
							labeledData[tempInd] = -regionIndex;
							neighbors[neighborLen++] = tempInd;	
							added = true;
						}	
						else
						{									
							buff[buffLen++] = currentNeighbor-1;
							break;
						}
					} 
				}

				if (!added && buffLen>0 && !isClosed)
				{					
					currentNeighbor=buff[buffLen-1]; neighborLen=currentNeighbor+1;
					buffLen--;
				}
			}//while gettingNeighbors		
			region.polygon=polygon.simplifyHybrid(region.polygon, importImg.threshold);
		}//for regions		
	}//getEdges
}