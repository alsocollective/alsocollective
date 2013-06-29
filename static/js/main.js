if(google && document.getElementById("map-canvas")){
	console.log("tried to lad the maps");
	google.maps.event.addDomListener(window, 'load', initialize);
}
var workObject, aboutObject, processObject;
var screenIsMoving = false;
var objectList = [];
var splashsrc;

window.onload = function(){
	//setpage();
	workObject = new setupWork("work");
	workObject.setSizeOfElements();
	workObject.startPosition();

	aboutObject = new setupWork("about");
	aboutObject.setSizeOfElements();
	aboutObject.startPosition();

	processObject = new setupWork("process");
	processObject.setSizeOfElements("instegram");
	processObject.startPosition();

	workObject.setSiblings([aboutObject,processObject]);
	aboutObject.setSiblings([workObject,processObject]);
	processObject.setSiblings([aboutObject,workObject]);

	objectList.push(workObject);
	objectList.push(aboutObject);
	objectList.push(processObject);

	$(document.getElementById("globalNave").childNodes[0]).bind("click",function(event){
		event.preventDefault();

		if(splashsrc){
			var newSplash = document.createElement("iframe");
			newSplash.src = splashsrc;
			newSplash.width = "100%";
			newSplash.height = "100%";
			newSplash.id = "splashFrame";
			document.getElementById("splash").appendChild(newSplash);
		}
		setTimeout(function(){
			workObject.resetSize();
			aboutObject.resetSize();
			processObject.resetSize();
		},250);
	})

	setTimeout(function(){
		workObject.resetSize(true);
		aboutObject.resetSize(true);
		processObject.resetSize(true);

		setTimeout(function(){
			var hash = window.location.hash;
			if(hash){
				var hashParent = findElementCat(document.getElementById(hash.substring(1))).id;
				$(objectList).each(function(index){
					if(objectList[index].paerentID()==hashParent){
						objectList[index].expandThisZoneFromOut();
					}
				});
			}
		},100);
	},1000);


}

var	toLoadWork = true;
function loadwork(){
	if(toLoadWork){
		toLoadWork = false;
		$.getJSON('/data/', function(data) {
			var projects = $(".articles");
			data = data["articles"];
			var children;
			projects.each(function(artLvl){
				children = $(projects[artLvl]).children();
				children.each(function(imgLvl){
					if(data[artLvl]["image"][imgLvl]){
						if(data[artLvl]["image"][imgLvl]["link"]){
							var iframe = document.createElement("iframe");
							iframe.src = data[artLvl]["image"][imgLvl]["link"]+"?title=0&amp;byline=0&amp;portrait=0&amp;color=ff0179";
							iframe.frameBorder = "0";
							iframe.width = "100%;";
							iframe.height = "100%;";
							children[imgLvl+1].appendChild(iframe);
						} else {
							children[imgLvl+1].style.backgroundImage = "url('/static/img/uploaded/"+ data[artLvl]["image"][imgLvl]["title"] +"')";
						}
					}
				});
			});
		});
	}
}

var toLoadAbout = true;
function loadAbout(){
	if(toLoadAbout){
		toLoadAbout = false;
		console.log("loading about");
		$.getJSON('/adata/', function(data) {
			var children = $(".biodesc");
			children.each(function(index){
				// if(index != 0){
					children[index].parentNode.style.backgroundImage = "url('/static/img/uploaded/"+ data[index+1]["bkImage"] +"')";
				// }
			});
			//style="background-image: url('/static/img/uploaded/{{text.bkImage}}')"
		});
	}
}

$(window).bind("resize",function(){
	workObject.setSizeOfElements();
	aboutObject.setSizeOfElements();
	processObject.setSizeOfElements("instegram");
})

function setupWork(paerentID){
	//getting all the elements
	var parentNode = document.getElementById(paerentID); //ver top element
	var titleBackground = findFirstEl(parentNode.childNodes[0]);
	var slidingElement = parentNode.childNodes[1];			//the sliding element
	var backgroundElement = slidingElement.childNodes[0];// the background Element that is fixed
	var widthOfSliding = slidingElement.childNodes[1];	//container of articles
	//test to make sure the file mark up is good
	if(parentNode.nodeType != 1 || slidingElement.nodeType != 1 || backgroundElement.nodeType != 1 || widthOfSliding.nodeType != 1){
		console.log("FAILED Loading the setup");
	} else {

	}

	//setting up the scroller and makeing a new instance of it
	var WorkScroller = new DragDivScroll(slidingElement.id, "mouseWheelX noOverscroll");

	var isActiveElement = false;
	var currentActiveIs;
	var siblingsElements; 				//the other objects containing this data
	var theCountofElement;				//the locaiotn in this list
	var siblingSections = parentNode.parentNode.childNodes; //siblings can contain the total numbers
	var button = widthOfSliding.childNodes[0];	//the button that selects the area
	var windowWidth;
	var catName = paerentID;

	for(var a = 0; a < siblingSections.length; ++a){
		if(parentNode.id == siblingSections[a].id){
			theCountofElement = a;
		}
	}

	parentNode.setAttribute("style","transition: height 1s, width 1s, left 1s, top 1s; -moz-transition: height 1s, width 1s, left 1s, top 1s; -webkit-transition: height 1s, width 1s, left 1s, top 1s; -o-transition: height 1s, width 1s, left 1s, top 1s;");

	parentNode.onclick = expandThisZone;
	function expandThisZone(){
		if(!screenIsMoving){
			screenIsMoving = true
			if(!isActiveElement){
				isActiveElement = true;
				setSize();
				window.location.hash = "#"+parentNode.id;
				setBackgroundActive();
			}
			setTimeout(function(){
				screenIsMoving = false;
			},1000);
		}
		var splash = document.getElementById("splashFrame");
		if(splash){
			setTimeout(function(){
				splashsrc = splash.src;
				splash.parentNode.removeChild(splash);
			}, 1000)
		}
	}

	function setBackgroundActive(){
		if(parentNode.id=="about" && document.getElementById("map-canvas")){
			setTimeout(function(){
				document.getElementById("map-canvas").style.height = $("#map-canvas").parent().height();
				google.maps.event.trigger(map, 'resize');
			},1100);
		}
		if(toLoadWork && parentNode.id=="work"){
			setTimeout(loadwork, 1000);
		}
		if(toLoadAbout && parentNode.id=="about"){
			setTimeout(function(){
				loadAbout();
			},1000);
		}
		$(parentNode).removeClass("navstate");
		$(parentNode).removeClass("defaultstate");
		if(!$(parentNode).hasClass("activestate")){
			$(parentNode).addClass("activestate");
		}
	}
	function setBackgroundDefault(){
		$(parentNode).removeClass("navstate");
		$(parentNode).removeClass("activestate");
		if(!$(parentNode).hasClass("defaultstate")){
			$(parentNode).addClass("defaultstate");
		}
	}
	function setBackgroundNav(){
		$(parentNode).removeClass("activestate");
		$(parentNode).removeClass("defaultstate");
		if(!$(parentNode).hasClass("navstate")){
			$(parentNode).addClass("navstate");
		}
	}

	this.expandThisZoneFromOut = function(){
		expandThisZone();
	}

	this.scrollTo = function(newLocation){
		if(isActiveElement){
			$(slidingElement).scrollLeft(newLocation);
		}
	}

	this.setSiblings = function(inputArray){
		siblingsElements = inputArray;
	}

	this.paerentID = function(){
		return parentNode.id;
	}

	var slideWidth = 0;
	var offsetBetween = 0;

	this.setSizeOfElements = function(formatOfDivs){
		formatOfDivs = typeof formatOfDivs !== 'undefined' ? formatOfDivs : "default";

		slideWidth = 0; 								//size of each block
		offsetBetween = 0; 								//distance between each slide
		windowWidth = $(window).width();				//we find the total width of the screen

		//getting the children of the working area
		var children = widthOfSliding.childNodes

		var size = 0;
		//these set the ratio, they HAVE TO equal 1!!!!!
		slideWidth = windowWidth*0.8;
		staticWidth = slideWidth; //for when we use instagram!!!

		offsetBetween = windowWidth*0.8;

		if(formatOfDivs == "instegram"){ 
			var windowHeight = $(window).height()*0.90/2;
			slideWidth = windowHeight;//$("#process").height()/2;
		}

		var thisSlideWidth = 0;

		for(var a = 0; a < children.length; ++a){
			if(children[a].nodeType == 1 && children[a].id != "workButton"){
				var possibleWidth;
				if(catName == "work"){
					possibleWidth = findCildWidth(children[a],slideWidth,1,"first");
				} else {
					possibleWidth = findCildWidth(children[a],slideWidth,1,"normal");
				}
				if( possibleWidth ){
					children[a].style.width = possibleWidth+"px";
				} else {
					children[a].style.width = slideWidth+"px";
				}

				thisSlideWidth = children[a].offsetWidth;
				children[a].style.marginLeft = offsetBetween + "px";
				size += thisSlideWidth + offsetBetween;

			} else if(children[a].nodeType == 1 && children[a].id == "workButton"){
				children[a].style.width = staticWidth*0.125+"px";
				size += staticWidth*0.125;
			}
		}
		backgroundElement.style.width = offsetBetween/4 +"px";
		titleBackground.parentNode.style.marginLeft = offsetBetween/4+"px";
		widthOfSliding.style.width = Math.ceil(size)+10 +"px";

	//setting the navigation up
		var links = backgroundElement.childNodes[1].childNodes;
		for (var a = 0; a < links.length; ++a){
			if(links[a].nodeType == 1 && links[a].hasChildNodes()){
				addEvent(links[a],links[a].firstChild.name,offsetBetween*0.5);
			}
		}
	}

	function findCildWidth(element, setWidth, percentOfOriginal,type){
		if(element.id == "people"){
			type = "all";
		}
		var funcChildren = element.childNodes;
		if(element.hasChildren || funcChildren.length < 1 || funcChildren[0].nodeType != 1){
			return false;
		}
		var returnSize = 0;
		if(type == "normal"){
			for(var a = 0; a < funcChildren.length; ++a){
				funcChildren[a].style.width = setWidth*percentOfOriginal+"px";
				funcChildren[a].style.minWidth = setWidth*percentOfOriginal+"px";
				returnSize += setWidth*percentOfOriginal;
			}
		} else if(type == "first"){
			for(var a = 0; a < funcChildren.length; ++a){
				if(a == 0){
					funcChildren[a].style.width = setWidth*percentOfOriginal/2+"px";
					funcChildren[a].style.minWidth = setWidth*percentOfOriginal/2+"px";
					returnSize += setWidth*percentOfOriginal/2;
				} else {
					funcChildren[a].style.width = setWidth*percentOfOriginal+"px";
					funcChildren[a].style.minWidth = setWidth*percentOfOriginal;
					returnSize += setWidth*percentOfOriginal;
				}
			}
		} else if(type == "all"){
			for(var a = 0; a < funcChildren.length; ++a){
					funcChildren[a].style.width = setWidth*percentOfOriginal/2+"px";
					funcChildren[a].style.minWidth = setWidth*percentOfOriginal/2+"px";
					returnSize += setWidth*percentOfOriginal/2;
			}
		}
		return returnSize;
	}

	function heightOfTitle(){
		var outHeight =0;
		var childNodesBg = titleBackground.childNodes;
		for(var a = 0; a < childNodesBg.length; ++a){
			if(childNodesBg[a].nodeType == 1){
				outHight = getPageTopLeft(childNodesBg[a]).top;// + childNodesBg[a].offsetHeight;
			}
		}
		return outHight
	}

	this.resetSize = function(scroll){
		if(!scroll){
			widthOfSliding.childNodes[0].scrollIntoView();
		}
		with(parentNode.style){
			top = "";
			left = "80%";
			height = "";
			width = "";
		}
		isActiveElement = false;
		hideBackroundElement();
	}

	this.startPosition  = function(){
		with(parentNode.style){
			left = windowWidth;
		}
	}

	this.setActive = function(){
		isActiveElement = true;
	}
	this.deActive = function(){
		isActiveElement = false;
	}
	this.activeElement = function(number){
		currentActiveIs = number;
	}
	this.activity = function(){
		return isActiveElement;
	}
	this.OutSidesetSize = function(){
		setSize();
	}

	function hideBackroundElement(){
		setBackgroundDefault();
		with(backgroundElement.style){
			if(currentActiveIs > theCountofElement){
				top = (theCountofElement*5) + "%";
			} else {
				top = (100-((siblingSections.length - theCountofElement)*5)) + "%";
			}
			opacity = 0;
		}
	}

	function setSize(){
		if(isActiveElement){
			with (parentNode.style){		//resizes the element to large format
				top	= (theCountofElement*5)+"%"
				height = "90%";
				left = "0px";
				width = "100%";
			}
			slidingElement.style.zIndex = 0; //enables the scrolling
			for(var a = 0; a < siblingsElements.length; ++a){
				siblingsElements[a].deActive();
				siblingsElements[a].activeElement(theCountofElement);
				siblingsElements[a].OutSidesetSize();
			}
				with(backgroundElement.style){
					top = (theCountofElement*5)+"%";
					opacity = 1;
				}

		} else {
			with (parentNode.style){		//resizes to the appropirate size and location
				if(currentActiveIs > theCountofElement){
					top = (theCountofElement*5) + "%";
					height = "5%";
					left = "0%";
					width = "100%";
				} else {
					top = (100-((siblingSections.length - theCountofElement)*5)) + "%";
					height = "5%";
					left = "0%";
					width = "100%";
				}
			}
			slidingElement.style.zIndex = -1; //makes the area none dragable
			hideBackroundElement();
			setBackgroundNav();
		}
	}
}

function addEvent(link, endPoint, offset){
	$(link).unbind();
	$(link).bind('click', function(event){
		event.preventDefault();
		goToThisEndPoint(endPoint,offset);
	});
}

function goToThisEndPoint(location,offset){
	if(!offset){
		offset = 0;
	}
	var element = document.getElementById(location);
	var left = $(element).offset().left;
	var body = $(element.parentNode.parentNode);
	var bodyOffset = $(element.parentNode).offset().left*-1;
	body.scrollLeft(bodyOffset + left - (offset/2));
	console.log(body);
	//body.animate({scrollLeft : bodyOffset + left - (offset/2)},1000);
// 	setTimeout(function(){
// //		setHashTag(location);
// 	},1100);
}

function setHashTag(newTag){
	var element = document.getElementById(newTag);
	element.id = "";
	window.location.replace("#"+newTag);
	element.id = newTag;
}

function windowSize() {
  var myWidth = 0, myHeight = 0;
  if( typeof( window.innerWidth ) == 'number' ) {
    //Non-IE
    myWidth = window.innerWidth;
    myHeight = window.innerHeight;
  } else if( document.documentElement && ( document.documentElement.clientWidth || document.documentElement.clientHeight ) ) {
    //IE 6+ in 'standards compliant mode'
    myWidth = document.documentElement.clientWidth;
    myHeight = document.documentElement.clientHeight;
  } else if( document.body && ( document.body.clientWidth || document.body.clientHeight ) ) {
    //IE 4 compatible
    myWidth = document.body.clientWidth;
    myHeight = document.body.clientHeight;
  }

  return {
  	"width": myWidth,
  	"height": myHeight
  }
}

function getPageTopLeft(el) {
	var rect = el.getBoundingClientRect();
	var docEl = document.documentElement;
	return {
		left: rect.left + (window.pageXOffset || docEl.scrollLeft || 0),
		top: rect.top + (window.pageYOffset || docEl.scrollTop || 0)
	};
}

function findElementCat(el){
	if(!el || el.tagName == "body" || el.tagName == "html"){
		return false;
	}
	var element = el.parentNode;
	var previouse = null;
	while(true){
		previouse = element;
		element = isParent(element);
		if(!element){
			if(previouse){
				return previouse;
			}
		}
	}
}

function findFirstEl(el){
	el = el.childNodes;
	for(var a = 0; a < el.length; ++a){
		if(el[a].nodeType == 1){
			return el[a];
		}
	}
}

function isParent(el){
	if(!el || !el.tagName || el.tagName == "body" || el.tagName == "html"){
		return false;
	}
	el = el.parentNode;
	if(el.id == "contentWrapper"){
		return false;
	} else {
		return el;
	}
}

var map;
function initialize() {
	var styles =[
		{
			"stylers": [
				{ "hue": "#33ccff" }
			]
		}
	]

	var mapOptions = {
		center: new google.maps.LatLng(43.650153,-79.397196),
		zoom: 17,
		mapTypeId: google.maps.MapTypeId.ROADMAP,
		overviewMapControl: true,
		disableDefaultUI: true,
	    scrollwheel: false,
		styles: styles,
		backgroundColor:"33ccff",

		zoomControl: true,
		zoomControlOptions: {
		        style: google.maps.ZoomControlStyle.LARGE,
		        position: google.maps.ControlPosition.BOTTOM_LEFT
			},
	};

	google.maps.visualRefresh = true;

	map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);

	var marker = new google.maps.Marker({
		position: new google.maps.LatLng(43.650153,-79.397196),
		map: map,
		fillColor: "#e6dc5a",
		title: "ALSO Collective"
	});
}