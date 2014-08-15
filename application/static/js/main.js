var windowWidth = 0,
	windowHeight = 0,
	loadingBool = false,
	halfWidthMin = 500,
	fullWidthMin = 700,
	betweenslides = 400,
	mousedownStart = null,
	scrollmoving = false,
	SCROLLLEFT = 0,
	draggerText = " noVertical MOUSEWHEELX noOverscroll noStatus",
	HOMEIFRAME = null,
	currentHASH = null;

$(document).ready(function() {
	windowWidth = $(window).width();
	windowHeight = $(window).height();
	$("#content > div .title").click(function() {
		if (loadingBool || $(this).hasClass("notloaded")) {
			return false;
		}
		$("#content").addClass("content-on");
		$(".active").removeClass("active").addClass("section-off");
		$(this.parentNode).addClass("active").removeClass("section-off");
		$(".on-page").removeClass("on-page");
		$(this).next().addClass("on-page")

		setHash(this.parentNode.id)
		showHome();
	})

	$("#work .title").click(loadWork);
	$("#about .title").click(loadAbout);
	$("#process .title").click(loadProcess);
	$("#home").click(clickHome);
	GoToHash();

	$(window).resize(function() {
		$('#about .section-content').height(Math.ceil(windowHeight * 0.9))
		$('#process .section-content').height(Math.ceil(windowHeight * 0.9))
		windowWidth = $(window).width();
		windowHeight = $(window).height();
		resizeWork();
		resizeAbout();
	});
});

function loadWork() {
	if (loadingBool || $("#work .section-content").html()) {
		return false;
	}
	loadingBool = true;
	$(this).removeClass("notloaded")
	$(this.parentNode).addClass("show-loading");
	setHash(this.parentNode.id)
	$('#work .section-content').load('/ajax/work/', loadedWork)
}

function loadedWork() {
	$('#work').ready(function() {
		resizeWork();
		$("#work .lazy").lazyload({
			effect: "fadeIn",
			threshold: 600,
			container: $("#work-scoller")
		});

		$("#work .clickformog").on("mousedown", function(event) {
			mousedownStart = new Date();
		}).on("mouseup", makePopout);
		$("#work .nav a").click(scrollToID);

		new DragDivScroll('work-scoller', draggerText, function(newBol) {
			scrollmoving = newBol;
		});

		//expand element all the way
		$("#content").addClass("content-on");
		$(".active").removeClass("active").addClass("section-off");
		$("#work").addClass("active").removeClass("section-off");
		$("#work").removeClass("show-loading");
		$(".on-page").removeClass("on-page");
		$("#work-scoller").scroll(scrollLocationToHash)

		setTimeout(function() {
			$("#work-scoller").addClass("on-page")
			loadingBool = false;
			showHome();
		}, 1000);
	})
}


function resizeWork() {
	if (!$("#work .section-content").html()) {
		return false
	}
	$('#work .section-content').height(Math.ceil(windowHeight * 0.9));

	var half = $("#work .halfPage"),
		whole = $("#work .page"),
		article = $("#work .articles"),
		hW = minValue(((windowWidth / 2) - 100), halfWidthMin),
		wW = minValue((windowWidth - 100), fullWidthMin),
		aPadding = betweenslides;

	half.width(hW);
	whole.width(wW);
	article.css({
		"margin-left": aPadding
	})

	article[0].style.marginLeft = hW + "px"

	$("#work .section-content").width(((half.length + 1) * hW) + (whole.length * wW) + ((article.length - 1) * aPadding) + 100 /*for good measure*/ );
}

function loadAbout() {
	if (loadingBool || $("#about .section-content").html()) {
		return false
	}

	loadingBool = true;
	$(this.parentNode).addClass("show-loading");
	$(this).removeClass("notloaded")
	setHash(this.parentNode.id)

	$('#about .section-content').load('/ajax/about/', loadedAbout)
}

function loadedAbout() {
	$('#about').ready(function() {
		resizeAbout();
		$("#about .nav a").click(scrollToID);
		$("#about .lazy").lazyload({
			effect: "fadeIn",
			threshold: 600,
			container: $("#about-scoller")
		});

		$("#about .clickformog").on("mousedown", function(event) {
			mousedownStart = new Date();
		}).on("mouseup", makePopout);

		new DragDivScroll('about-scoller', draggerText, function(newBol) {
			scrollmoving = newBol;
		});
		$('#about .section-content').height(Math.ceil(windowHeight * 0.9));

		readyGoogleMaps();

		//expand element all the way
		$("#content").addClass("content-on");
		$(".active").removeClass("active").addClass("section-off");
		$("#about").addClass("active").removeClass("section-off");
		$("#about").removeClass("show-loading");
		$(".on-page").removeClass("on-page");
		$("#about-scoller").scroll(scrollLocationToHash)

		setTimeout(function() {
			$("#about-scoller").addClass("on-page")
			loadingBool = false;
			showHome()
		}, 1000);
	});
}

function resizeAbout() {
	if (!$("#about .section-content").html()) {
		return false
	}
	$('#about .section-content').height(Math.ceil(windowHeight * 0.9));

	var half = $("#about .halfPage"),
		whole = $("#about .page"),
		article = $("#about .articles"),
		hW = minValue(((windowWidth / 2) - 100), halfWidthMin),
		wW = minValue((windowWidth - 100), fullWidthMin),
		aPadding = betweenslides;

	half.width(hW);
	whole.width(wW);

	article.css({
		"margin-left": aPadding
	})
	article[0].style.marginLeft = hW + "px"

	$("#about .section-content").width(((half.length + 1) * hW) + (whole.length * wW) + ((article.length - 1) * aPadding) + 100);
}


function readyGoogleMaps() {
	var script = document.createElement('script');
	script.type = 'text/javascript';
	script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyAsprgq2AfDNOAr9zdeizAbhG_FNGyP8-4&v=3.exp&callback=initialize';
	document.body.appendChild(script);
}

function loadProcess() {
	if (loadingBool || $("#process .section-content").html()) {
		return false;
	}

	loadingBool = true;

	$(this.parentNode).addClass("show-loading");
	$(this).removeClass("notloaded")
	setHash(this.parentNode.id)

	$('#process .section-content').load('/ajax/process/', loadedProcess)

}

function loadedProcess() {
	$('#process').ready(function() {
		resizeProcess();

		$("#process .lazy").lazyload({
			effect: "fadeIn",
			threshold: 600,
			container: $("#process-scoller")
		});

		new DragDivScroll('process-scoller', draggerText);
		$("#content").addClass("content-on");
		$(".active").removeClass("active").addClass("section-off");
		$("#process").addClass("active").removeClass("section-off");
		$("#process").removeClass("show-loading");
		$(".on-page").removeClass("on-page");

		setTimeout(function() {
			$("#process-scoller").addClass("on-page")
			showHome()
		}, 500);

		loadingBool = false;
	});
}

function resizeProcess() {
	var height = Math.ceil(windowHeight * 0.9);
	$('#process .section-content').height(height);

	var article = $("#process .instagram-page"),
		w = (height / 2) + "px",
		aPadding = minValue(((windowWidth / 2) - 100), fullWidthMin);
	article.css({
		"width": w
	})
	article[0].style.marginLeft = aPadding + "px"
	$("#process .section-content").width((article.length * (height / 2)) + aPadding)
}

function resizeImages() {
	$(".image img").each(function(index, value) {
		var width = $(value).width();
		if (width > (windowWidth - 100)) {
			$(value).css({
				"margin-left": "-" + (windowWidth - 100 / 2) + "px",
				"width": "auto"
			});
		} else {
			$(value).css({
				"margin-left": "-" + ((windowWidth - 100) / 2) + "px",
				"height": "auto",
				"width": "100%"
			});
		}
	})
}


function makePopout(event) {
	var difference = mousedownStart.getTime() - (new Date().getTime())
	if (difference > -150) {
		var container = document.createElement("div");
		container.className = "fullscreenmodul";
		var subcon = document.createElement("div");

		var children = $(this).children();
		var img = null;
		if (children.length == 0) {
			img = document.createElement("img");
			var loc = this.style.backgroundImage.split("(")[1].split(")")[0].replace('"', "").replace('"', "");
			console.log(loc);
			img.src = loc;
		} else {
			img = document.createElement("iframe");
			img.src = children[0].href + "?title=0&amp;byline=0&amp;portrait=0&amp;autoplay=1"
			img.setAttribute('frameborder', "0")
			img.setAttribute('webkitallowfullscreen', "")
			img.setAttribute('mozallowfullscreen', "")
			img.setAttribute('allowfullscreen', "")
			img.height = Math.ceil(windowHeight * 0.8);
			img.width = Math.ceil(windowHeight * 0.8 * 1.779);
		}
		subcon.appendChild(img);
		container.appendChild(subcon);
		document.body.appendChild(container);

		if ($(img).height() > (Math.ceil(windowHeight * 0.9))) {
			$(img).height(Math.ceil(windowHeight * 0.9)).width("auto");
		}

		$(container).click(closeTHIS);
	}

}

function scrollToID(event) {
	event.preventDefault();
	event.stopPropagation();
	if (scrollmoving) {
		return false;
	}
	var location = this.href.split("#")[1],
		parentEl = $(this.parentNode.parentNode.parentNode.parentNode.parentNode),
		parentOffset = parentEl.scrollLeft();

	setHash("/" + parentEl[0].parentNode.id + "/" + location)

	parentEl.scrollLeft($("#" + location).offset().left + parentOffset, 0)
	return false;
}

function setHash(location) {
	// if (ga) {
	if (currentHASH == location) {
		return false;
	}
	currentHASH = location;
	console.log(location);
	ga('send', 'pageview', {
		'page': location
	});
	// }
	window.location.hash = location;
}

function closeTHIS() {
	this.parentNode.removeChild(this);
}

function initialize() {
	var styles = [{
		"stylers": [{
			"hue": "#33ccff"
		}]
	}];

	google.maps.visualRefresh = true;

	var mapOptions = {
		center: new google.maps.LatLng(43.650153, -79.397196),
		zoom: 17,
		mapTypeId: google.maps.MapTypeId.ROADMAP,
		overviewMapControl: true,
		disableDefaultUI: true,
		scrollwheel: false,
		styles: styles,
		backgroundColor: "33ccff",

		zoomControl: true,
		zoomControlOptions: {
			style: google.maps.ZoomControlStyle.LARGE,
			position: google.maps.ControlPosition.BOTTOM_LEFT
		}
	};

	google.maps.visualRefresh = true;

	map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);

	var marker = new google.maps.Marker({
		position: new google.maps.LatLng(43.650153, -79.397196),
		map: map,
		fillColor: "#e6dc5a",
		title: "also Collective"
	});

	var infoContent = $("#smith-address")[0].cloneNode(true);
	var infowindow = new google.maps.InfoWindow({
		content: infoContent
	});

	infowindow.open(map, marker);

	google.maps.event.addListener(marker, 'click', function() {
		infowindow.open(map, marker);
	});
}

function minValue(value, min) {
	if (value > min) {
		return value;
	} else {
		return min;
	}
}

function showHome() {
	$("#home").addClass("show");
	var el = $("#splash"),
		html = el.html();
	if (html) {
		HOMEIFRAME = html;
		el.html("");
	}

}

function hideHome() {
	$("#home").removeClass("show");
	setTimeout(function() {
		$("#splash").html(HOMEIFRAME);
	}, 1000)
}

function clickHome() {
	hideHome();
	$("#content").removeClass("content-on");
	$(".active").removeClass("active").addClass("section-off");
}

function scrollLocationToHash(event) {
	var list = $($($(this).children()[0]).children().get().reverse());
	list.each(testLocation);
}

function testLocation(index, el) {
	var el = $(el);
	if (index !== 0) {
		if (el.position().left < 0) {
			setHash(el[0].parentNode.parentNode.parentNode.id + "/" + el[0].id)
			return false;
		}
	}
}

function GoToHash() {
	if (window.location.hash) {
		setTimeout(function() {
			var subloc = window.location.hash.split("#");
			loc = subloc;
			if (loc.length > 0) {
				loc = loc[1].split("/");
				$("#" + loc[0] + " .title").click();
				if (loc[1]) {
					(function(loc) {
						setTimeout(function() {
							$("#" + loc[0] + " .nav [href='#" + loc[1] + "']").click()
						}, 2000)
					})(loc)
				}
			}
		}, 2000);
	} else {
		return false;
	}
}



// $(window).on("mousemove", function(event) {
// 	if (!mouseDown) {
// 		return false;
// 	}
// 	console.log(event);
// 	mouseMove = true;
// });
// $(window).on("mouseup", function(event) {
// 	mouseDown = false;
// 	return false;
// });