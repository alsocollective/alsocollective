var width,height;
var context,orignalImageData;
var blueValue,redValue;
var variable = 0.0;

window.onload = function(){
	width = window.innerWidth;
	height = window.innerHeight;

	context = loadImageToCanvas("forest",5);	//loads canvas and places image in it then removes image from window
	orignalImageData = context[1];
	context = context[0];

	var imageData = copyImageData(context,orignalImageData);

	redValue = findRedValue(imageData);
	blueValue = findBlueValue(imageData);

	imageFromSin();
}
function loadImageToCanvas(imageLoc,quality){
	var locCanvas = document.createElement("canvas"); //document.getElementById("myCanvas");//
	var context = locCanvas.getContext("2d");

	locCanvas.id = "branding";
	var parent = document.getElementById("container");
	parent.appendChild(locCanvas);

	var imageData = null; //innitialize the image data
	var myImage =  document.getElementById(imageLoc);
	var imgHight =  myImage.height;
	locCanvas.width = myImage.width;
	locCanvas.height = imgHight;

	context.drawImage(myImage,0,0,locCanvas.width, locCanvas.height);
	// document.body.removeChild(myImage);
	parent.style.marginLeft = document.getElementById("staticBk").width/2-locCanvas.width/2;

	imageData = context.getImageData(0, 0, locCanvas.width, locCanvas.height);
	return [context,imageData];
}
function findRedValue(imageData){
	var list = [];
	var temp = 0;
	for(var x = 0; x < imageData.width; ++x){
		for(var y = 0; y < imageData.height; ++y){
		var loc = (imageData.width*y*4)+(x*4);
			temp+=imageData.data[loc];
		}
		list.push(temp);
		temp = 0;
	}
	return list;
}
function findBlueValue(imageData){
	var list = [];
	var temp = 0;
	for(var x = 0; x < imageData.width; ++x){
		for(var y = 0; y < imageData.height; ++y){
		var loc = (imageData.width*y*4)+(x*4)+2;
			temp+=imageData.data[loc];
		}
		list.push(temp);
		temp = 0;
	}
	return list;
}


function imageFromSin(){
	variable += 0.1;
	var imageData = copyImageData(context,orignalImageData); //never use original image data... orelse well just loop and it will be come crazy

	var outRedValue = map(redValue,Math.sin(variable)*5+5,1);
	var ourBlueValue = map(blueValue,Math.cos(variable)*5+5,1);

	shiftRedandBlue(imageData,outRedValue,ourBlueValue);

	context.putImageData(imageData,0,0);
	//setTimeout(imageFromSin,24);
}


window.addEventListener( 'mousemove', function( e ) {
	var imageData = copyImageData(context,orignalImageData); //never use original image data... orelse well just loop and it will be come crazy

	//var redValue = findRedValue(imageData);
	var outRedValue = map(redValue,e.clientY/height*100,5);

	//var blueValue = findBlueValue(imageData);
	var ourBlueValue = map(blueValue,e.clientX/height*100,5);

	shiftRedandBlue(imageData,outRedValue,ourBlueValue);

	context.putImageData(imageData,0,0);
	console.log(Math.floor(e.clientY/height));
});

function copyImageData(ctx, src){
    var dst = ctx.createImageData(src.width, src.height);
    dst.data.set(src.data);
    return dst;
}
function map(list,newMax,newMin){
	var min = 99999999999;
	var max = 0;
	var newList = [];
	for(var a = 0; a < list.length; ++a){
		if(list[a] < min){
			min = list[a];
		}
		if(list[a] > max){
			max = list[a];
		}
	}
	max = max - min;
	for(var a = 0; a < list.length; ++a){
		newList.push(Math.floor(((list[a]-min)/max*newMax)+newMin));
	}
	return newList;
}
function shiftRedandBlue(imageData,value,value2){
	for(var y = 0; y < imageData.height; ++y){
		for(var x = 0; x < imageData.width; ++x){
			var loc = (imageData.width*y*4)+(x*4);
			var take = (imageData.width*(y+value[x])*4)+(x*4);
			imageData.data[loc] = imageData.data[take];
			if(imageData.data[loc+3] > 0){
				imageData.data[loc+3] = 255;
			}
			if(imageData.data[loc]>0 && imageData.data[loc+1] === 0 &&imageData.data[loc+2] === 0){
				if(imageData.data[loc+3] === 0){
					imageData.data[loc+3] = 255;
				}
			}

			loc++;
			var take = (imageData.width*(y+value2[x])*4)+(x*4)+1;
			imageData.data[loc] = imageData.data[take];
			if(imageData.data[loc+3] > 0){
				imageData.data[loc+3] = 255;
			}
			if(imageData.data[loc]>0 && imageData.data[loc+1] === 0 &&imageData.data[loc+2] === 0){
				if(imageData.data[loc+3] === 0){
					imageData.data[loc+3] = 255;
				}
			}
		}
	}
}
