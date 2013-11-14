var google;

if(document.getElementById("map-canvas")){
	console.log("addeing DOM listener");
	google.maps.event.addDomListener(window, 'load', initialize);
}
var workObject, aboutObject, processObject;
var screenIsMoving = false;
var objectList = [];
var splashsrc;
var pageWidth,padgeHeight;


window.onload = pageInitilizer;

function pageInitilizer(){
	// setpage();
	workObject = new SetupWork("work");
	workObject.setSizeOfElements();
	workObject.startPosition();

	aboutObject = new SetupWork("about");
	aboutObject.setSizeOfElements();
	aboutObject.startPosition();

	processObject = new SetupWork("process");
	processObject.setSizeOfElements("instegram");
	processObject.startPosition();

	workObject.setSiblings([aboutObject,processObject]);
	aboutObject.setSiblings([workObject,processObject]);
	processObject.setSiblings([aboutObject,workObject]);

	objectList.push(workObject);
	objectList.push(aboutObject);
	objectList.push(processObject);

	$($("#globalNave").children()[0]).bind("click",function(event){
		event.preventDefault();
		window.location.hash = '';
		if(splashsrc){
		setTimeout(function(){
			var newSplash = document.createElement("iframe");
			newSplash.src = splashsrc;
			newSplash.width = "100%";
			newSplash.height = "100%";
			newSplash.id = "splashFrame";
			newSplash.frameBorder="0";
			document.getElementById("splash").appendChild(newSplash);
		},1000);

		}
		workObject.resetSize();
		aboutObject.resetSize();
		processObject.resetSize();
	});

	setTimeout(function(){
		workObject.resetSize(true);
		aboutObject.resetSize(true);
		processObject.resetSize(true);

		setTimeout(function(){
			var hash = window.location.hash;
			if(hash){
				hash = hash.substring(1);
				var subHashs = hash.split("_");
				$(objectList).each(function(index){
					if(objectList[index].paerentID()==subHashs[0]){
						objectList[index].expandThisZoneFromOut();
						window.location.hash = hash;
					}
				});
			}
		},100);
	},1000);

	$(window).bind("resize",function(){
		workObject.setSizeOfElements();
		aboutObject.setSizeOfElements();
		processObject.setSizeOfElements("instegram");
		var temp = $($(".page")[2]);
		pageWidth = temp.width();
		padgeHeight = temp.height();
		$(".image-fullscreen").each(imagefullscreenresize);
	});

	$(window).keydown(function(event){
		var move = 0;
		if(event.keyCode == '39'){
			move = 120;
		} else if(event.keyCode == '37'){
			move = -120;
		}
		aboutObject.scrollAmout(move);
		workObject.scrollAmout(move);
		processObject.scrollAmout(move);
	});
}


var	toLoadWork = true;
function loadwork(){
	if(toLoadWork){
		toLoadWork = false;
		$.getJSON('/data/', function(data) {
			var projects = $(".articles");
			data = data.articles;
			var children;
			projects.each(function(artLvl){
				children = $(projects[artLvl]).children();
				children.each(function(imgLvl){
					if(data[artLvl].image[imgLvl]){
						if(data[artLvl].image[imgLvl].link){
							createImage(children[imgLvl+1],'/static/img/uploaded/'+data[artLvl]["image"][imgLvl].title,data[artLvl].image[imgLvl].link);
						} else {
							createImage(children[imgLvl+1],'/static/img/uploaded/'+data[artLvl]["image"][imgLvl].title);
						}
					}
				});
			});
		});
	}
	setTimeout(function(){
		var temp = $($(".page")[2]);
		pageWidth = temp.width();
		padgeHeight = temp.height();
		$(".image-fullscreen").each(imagefullscreenresize);
	},1000);
}

function imagefullscreenresize(){
	this.style.minHeight = padgeHeight;
	this.style.position = "absolute";
	this.style.left = pageWidth/2 - $(this).width()/2;
	this.style.top = padgeHeight/2 - $(this).height()/2;
}

function createImage(parent,image,video){
	var out = document.createElement("img");
	out.src = image;
	out.className = "image-fullscreen";
	out.alt = image;
	parent.appendChild(out);
	if(video){
		var ontop = document.createElement("div");
		ontop.className="playvideo-button";
		$(ontop).click(function(){
			createVideo(parent,video);
		});
		parent.appendChild(ontop);
	}
}

function createVideo(parent,link){
	parent.innerHTML = "";
	var out = document.createElement("iframe");
	out.src = link+"?autoplay=1;title=0&amp;byline=0&amp;portrait=0&amp;color=c67eb4";
	out.frameBorder = "0";
	out.width = "100%;";
	out.height = "100%;";
	parent.appendChild(out);
}



var toLoadAbout = true;
function loadAbout(){
	if(toLoadAbout){
		toLoadAbout = false;
		$.getJSON('/adata/', function(data) {
			var children = $(".biodesc");
			children.each(function(index){
				// if(index != 0){
					children[index].parentNode.style.backgroundImage = "url('/static/img/uploaded/"+ data[index+1].bkImage +"')";
				// }
			});
			//style="background-image: url('/static/img/uploaded/{{text.bkImage}}')"
		});
	}
}




function SetupWork(paerentID){
	//getting all the elements
	var parentNode = 2222;
	parentNode = $("#"+paerentID)[0]; //ver top element
	var titleBackground = $($(parentNode).children()[0]).children()[0]/*findFirstEl(parentNode.childNodes[0]);*/
	var slidingElement = $(parentNode).children()[1];			//the sliding element
	var backgroundElement = $(slidingElement).children()[0];// the background Element that is fixed
	var widthOfSliding = $(slidingElement).children()[1];	//container of articles
	//test to make sure the file mark up is good
	if(!parentNode || parentNode.nodeType != 1 || slidingElement.nodeType != 1 || backgroundElement.nodeType != 1 || widthOfSliding.nodeType != 1){
		//console.log("FAILED Loading the setup");
		// var style = document.getElementById("style1");
		// style.disabled = !style.disabled
	} else {

	}

	//setting up the scroller and makeing a new instance of it
	var WorkScroller = new DragDivScroll(slidingElement.id, "mouseWheelX noOverscroll");

	var isActiveElement = false;
	var currentActiveIs;
	var siblingsElements;				//the other objects containing this data
	var theCountofElement;				//the locaiotn in this list
	var siblingSections = parentNode.parentNode.childNodes; //siblings can contain the total numbers
	var button = widthOfSliding.childNodes[0];	//the button that selects the area
	var windowWidth;
	var catName = paerentID;
	var slideWidth = 0;
	var offsetBetween = 0;
	var widthsOfEl = [0];
	var sectionTages = [];
	var currentHash = window.location.hash.split("_")[1];

	for(var a = 0, max = siblingSections.length; a < max; ++a){
		if(parentNode.id == siblingSections[a].id){
			theCountofElement = a;
		}
	}

	parentNode.setAttribute("style","transition: height 1s, width 1s, left 1s, top 1s; -moz-transition: height 1s, width 1s, left 1s, top 1s; -webkit-transition: height 1s, width 1s, left 1s, top 1s; -o-transition: height 1s, width 1s, left 1s, top 1s;");

	parentNode.onclick = expandThisZone;
	function expandThisZone(){
		if(!screenIsMoving){
			screenIsMoving = true;
			if(!isActiveElement){
				isActiveElement = true;
				setSize();
				window.location.hash = "#"+parentNode.id;
				currentHash = parentNode.id;
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
			}, 1000);
		}
	}

	this.scrollAmout = function(inAmmout){
		if(isActiveElement){
			$(slidingElement).scrollLeft($(slidingElement).scrollLeft() + inAmmout);
		}
	};

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
	};
	function setBackgroundDefault(){
		$(parentNode).removeClass("navstate");
		$(parentNode).removeClass("activestate");
		if(!$(parentNode).hasClass("defaultstate")){
			$(parentNode).addClass("defaultstate");
		}
	};
	function setBackgroundNav(){
		$(parentNode).removeClass("activestate");
		$(parentNode).removeClass("defaultstate");
		if(!$(parentNode).hasClass("navstate")){
			$(parentNode).addClass("navstate");
		}
	};

	this.expandThisZoneFromOut = function(){
		expandThisZone();
	};

	this.scrollTo = function(newLocation){
		if(isActiveElement){
			$(slidingElement).scrollLeft(newLocation);
		}
	};

	this.setSiblings = function(inputArray){
		siblingsElements = inputArray;
	};

	this.paerentID = function(){
		return parentNode.id;
	};

	$(widthOfSliding.parentNode).on("scroll",function(){
		var contentScrollTop = $(this).scrollLeft();
		//console.log(sectionTages);
		for(var a = 0, max = widthsOfEl.length; a < max; a += 1){
			if(sectionTages[a] != currentHash && widthsOfEl[a] < contentScrollTop &&widthsOfEl[a+1] > contentScrollTop){
				currentHash = sectionTages[a];
				if(history.pushState) {
					history.pushState(null, null, "#"+currentHash);
				}else {
					location.hash = "#"+currentHash;
				}

				var parseHash = currentHash.split("_");
				var pageTracker = _gat._getTracker("UA-37086718-1");
				if(parseHash.length > 1) {
					pageTracker._trackPageview("/"+parseHash[0]+"/"+parseHash[1]);
				}else {
					pageTracker._trackPageview("/"+parseHash[0]);
				}
			}
		}
	});

	this.setSizeOfElements = function(formatOfDivs){
		formatOfDivs = typeof formatOfDivs !== 'undefined' ? formatOfDivs : "default";

		slideWidth = 0;									//size of each block
		offsetBetween = 0;								//distance between each slide
		windowWidth = $(window).width();				//we find the total width of the screen

		//getting the children of the working area
		var children = widthOfSliding.childNodes;

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
		widthsOfEl = [0];

		//console.log("--------------");
		for(var a = 0, max = children.length; a < max; ++a){
			if(children[a].nodeType == 1 && children[a].id != "workButton"){
				var possibleWidth;
				if(catName == "work"){
					possibleWidth = findChildWidth(children[a],slideWidth,1,"first");
				} else {
					possibleWidth = findChildWidth(children[a],slideWidth,1,"normal");
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
			size = Math.floor(size);
			widthsOfEl.push(size);
			//console.log(children[a].id);
			sectionTages.push(children[a].id);
		}
		backgroundElement.style.width = offsetBetween/4 +"px";
		titleBackground.parentNode.style.marginLeft = offsetBetween/4+"px";
		widthOfSliding.style.width = Math.ceil(size)+10 +"px";

		//setting the navigation up
		var links = $($(backgroundElement).children()[0]).children();
		for (var a = 0, max = links.length; a < max; ++a){
			if(links[a].nodeType == 1 && links[a].hasChildNodes()){
				addEvent(links[a],links[a].firstChild.name,offsetBetween*0.5);
			}
		}
	};

	function findChildWidth(element, setWidth, percentOfOriginal,type){
		if(element.id == "about_people"){
			type = "all";
		}
		var funcChildren = element.childNodes;
		if(element.hasChildren || funcChildren.length < 1 || funcChildren[0].nodeType != 1){
			return false;
		}
		var returnSize = 0;
		if(type == "normal"){
			for(var a = 0, max = funcChildren.length; a < max; ++a){
				funcChildren[a].style.width = setWidth*percentOfOriginal+"px";
				funcChildren[a].style.minWidth = setWidth*percentOfOriginal+"px";
				returnSize += setWidth*percentOfOriginal;
			}
		} else if(type == "first"){
			for(var a = 0, max = funcChildren.length; a < max; ++a){
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
			for(var a = 0, max = funcChildren.length; a < max; ++a){
					funcChildren[a].style.width = setWidth*percentOfOriginal/2+"px";
					funcChildren[a].style.minWidth = setWidth*percentOfOriginal/2+"px";
					returnSize += setWidth*percentOfOriginal/2;
			}
		}
		return returnSize;
	}
/*
	function heightOfTitle(){
		var outHeight =0;
		var childNodesBg = titleBackground.childNodes;
		for(var a = 0, max = childNodesBg.length; a < max; ++a){
			if(childNodesBg[a].nodeType == 1){
				outHeight = getPageTopLeft(childNodesBg[a]).top;// + childNodesBg[a].offsetHeight;
			}
		}
		return outHeight;
	}*/

	this.resetSize = function(scroll){
		if(!scroll){
			widthOfSliding.childNodes[0].scrollIntoView();
		}
		parentNode.style.top = "";
		parentNode.style.left = "80%";
		parentNode.style.height = "";
		parentNode.style.width = "";
		isActiveElement = false;
		hideBackroundElement();
	}

	this.startPosition  = function(){
			parentNode.style.left = windowWidth;
	};

	this.setActive = function(){
		isActiveElement = true;
	};
	this.deActive = function(){
		isActiveElement = false;
	};
	this.activeElement = function(number){
		currentActiveIs = number;
	};
	this.activity = function(){
		return isActiveElement;
	};
	this.OutSidesetSize = function(){
		setSize();
	};

	function hideBackroundElement(){
		setBackgroundDefault();
		if(currentActiveIs > theCountofElement){
			backgroundElement.style.top = (theCountofElement*5) + "%";
		} else {
			backgroundElement.style.top = (100-((siblingSections.length - theCountofElement)*5)) + "%";
		}
		backgroundElement.style.opacity = 0;

	}

	function setSize(){
		if(isActiveElement){
			//resizes the element to large format
			parentNode.style.top	= (theCountofElement*5)+"%";
			parentNode.style.height = "90%";
			parentNode.style.left = "0px";
			parentNode.style.width = "100%";
			slidingElement.style.zIndex = 0; //enables the scrolling
			for(var a = 0; a < siblingsElements.length; ++a){
				siblingsElements[a].deActive();
				siblingsElements[a].activeElement(theCountofElement);
				siblingsElements[a].OutSidesetSize();
			}

			backgroundElement.style.top = (theCountofElement*5)+"%";
			backgroundElement.style.opacity = 1;

		} else {
			//resizes to the appropirate size and location
			if(currentActiveIs > theCountofElement){
				parentNode.style.top = (theCountofElement*5) + "%";
				parentNode.style.height = "5%";
				parentNode.style.left = "0%";
				parentNode.style.width = "100%";
			} else {
				parentNode.style.top = (100-((siblingSections.length - theCountofElement)*5)) + "%";
				parentNode.style.height = "5%";
				parentNode.style.left = "0%";
				parentNode.style.width = "100%";
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
}
/*
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
	};
}*/

function getPageTopLeft(el) {
	var rect = el.getBoundingClientRect();
	var docEl = document.documentElement;
	return {
		left: rect.left + (window.pageXOffset || docEl.scrollLeft || 0),
		top: rect.top + (window.pageYOffset || docEl.scrollTop || 0)
	};
}



function isParent(el){
	if(!el || !el.tagName || el.tagName === "body" || el.tagName === "html"){
		return false;
	}
	el = el.parentNode;
	if(el.id === "contentWrapper"){
		return false;
	} else {
		return el;
	}
}

var map;
function initialize() {
	console.log("initializer is going");
	var styles =[
		{
			"stylers": [
				{ "hue": "#33ccff" }
			]
		}
	];

	google.maps.visualRefresh = true;

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
		}
	};

	google.maps.visualRefresh = true;

	map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);

	var marker = new google.maps.Marker({
		position: new google.maps.LatLng(43.650153,-79.397196),
		map: map,
		fillColor: "#e6dc5a",
		title: "also Collective"
	});

	var infoContent = $("#smith-address")[0].cloneNode(true);

	var infowindow = new google.maps.InfoWindow({
		content: infoContent
	});

	infowindow.open(map,marker);

	google.maps.event.addListener(marker, 'click', function() {
		infowindow.open(map,marker);
	});

	$("#about").click(function(){
		setTimeout(function(){
			map.setCenter(marker.getPosition());

		},1000);
	});
}





///////////////////////
//// youtube stuff ////
///////////////////////
//to use this be sure to disable the
//window.onload = pageInitilizer;
//at the top of the page
//add style="display:none;" to splash
//add style="display:none" to iframe of splashframe
//add display:none to #globalNave in main.css line 755
/*
var myPlayer = $("#youtube-player").Jtube({
		videoId:"_vJG9kaVLEA",
		debugMode:true,
		vidWidth:"1920",
		vidHeight:"1080",
		vidQuality:"hd720",
		ldCssFunc:function(){
			var loc = document.createElement("div");
			loc.id = "center-tis-box";
			var div1 = document.createElement("div");
			div1.className = "ld-box";
			div1.id = "minus1";
			var div2 = div1.cloneNode(true);
			div2.id = "minus2";
			loc.appendChild(div1);
			loc.appendChild(div2);
			document.body.appendChild(loc);
			return loc;
		},
		onStart:function(){
			var splashEl = $("#splashFrame")[0];
			splashsrc = splashEl.src;
			$("#location-details").hide();
		},
		onDone:function(){
			pageInitilizer();
			$("#globalNave").fadeIn('fast');
			var splashEl = $("#splashFrame")[0];
			var removeYT = $(".backface-hidden")[0];
			removeYT.parentNode.removeChild(removeYT);
			if(!splashEl.src){
				splashEl.src = splashsrc;
			} else {
				splashsrc = splashEl.src;
				splashEl.src = null;
				splashEl.src = splashsrc;
			}
			$("#splashFrame").fadeIn('fast');
			$("#location-details").fadeIn('fast');
		},
		onLoaded:function(settings){
			console.log("onload was called");
			settings.player.setPlaybackQuality('hd720');
		},
		onBuffering:function(settings){
			console.log("on buffering was called");
			settings.player.setPlaybackQuality('hd720');
		}
	});
function onYouTubeIframeAPIReady() {
	myPlayer.setupPlayer();
}
*/

