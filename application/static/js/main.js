var windowWidth = 0,
	windowHeight = 0,
	loadingBool = false,
	halfWidthMin = 500,
	fullWidthMin = 700,
	betweenslides = 400,
	mousedownStart = null,
	draggerText = " noVertical MOUSEWHEELX noOverscroll noStatus";

$(document).ready(function() {
	windowWidth = $(window).width();
	windowHeight = $(window).height();
	$("#content > div .title").click(function() {
		if (loadingBool) {
			return false;
		}
		if ($(this.parentNode).find(".loading-section").length > 0) {
			console.log("has a loading section still")
		} else {
			$("#content").addClass("content-on");
			$(".active").removeClass("active").addClass("section-off");
			$(this.parentNode).addClass("active").removeClass("section-off");
			setHash(this.parentNode.id)
			showHome();
			console.log("does not have laoder")
		}
	})

	$("#work .title").click(loadWork);
	$("#about .title").click(loadAbout);
	$("#process .title").click(loadProcess);
	$("#home").click(clickHome);

	function loadWork() {
		console.log("clicked work")

		if (loadingBool) {
			console.log("loading something")
			return false;
		}
		if ($("#work .section-content").html()) {
			console.log("already Loaded");
			return false
		}

		loadingBool = true;
		$(this.parentNode).addClass("show-loading");
		setHash(this.parentNode.id)

		console.log("work: " + new Date().getTime());
		setTimeout(function() {
			$.ajax({
				cache: false,
				url: '/ajax/work/',
				success: function(data) {
					$('#work .section-content').html(data).waitForImages({
						finished: function() {
							resizeWork();
							$("#work .clickformog").on("mousedown", function(event) {
								mousedownStart = new Date();
							}).on("mouseup", makePopout);
							$("#work .nav a").click(scrollToID);
							new DragDivScroll('work-scoller', draggerText);

							//expand element all the way
							$("#content").addClass("content-on");
							$(".active").removeClass("active").addClass("section-off");
							$("#work").addClass("active").removeClass("section-off");
							$("#work").removeClass("show-loading");

							//fade and destroy
							var loading = $("#work .loading-section")
							loading.addClass("fadeout-animation");
							setTimeout(function() {
								var loading = $("#work .loading-section")
								loading[0].parentNode.removeChild(loading[0]);
								loadingBool = false;
								showHome();
							}, 2000);

						},
						waitForAll: true
					});
				}
			});
		}, 500)
	}

	function resizeWork() {
		if (!$("#work .section-content").html()) {
			return false
		}
		$('#work .section-content').height(windowHeight * 0.9);

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
		if (loadingBool) {
			return false;
		}
		if ($("#about .section-content").html()) {
			return false
		}

		loadingBool = true;
		$(this.parentNode).addClass("show-loading");
		setHash(this.parentNode.id)

		console.log("about: " + new Date().getTime());
		setTimeout(function() {
			$.ajax({
				cache: false,
				url: '/ajax/about/',
				success: function(data) {
					$('#about .section-content').html(data).waitForImages({
						finished: function() {
							console.log("about: " + new Date().getTime());
							resizeAbout();
							$("#about .nav a").click(scrollToID);

							$("#about .clickformog").on("mousedown", function(event) {
								mousedownStart = new Date();
							}).on("mouseup", makePopout);

							new DragDivScroll('about-scoller', draggerText);
							$('#about .section-content').height(windowHeight * 0.9)

							readyGoogleMaps();

							//expand element all the way
							$("#content").addClass("content-on");
							$(".active").removeClass("active").addClass("section-off");
							$("#about").addClass("active").removeClass("section-off");
							$("#about").removeClass("show-loading");

							//fade and destroy
							var loading = $("#about .loading-section")
							loading.addClass("fadeout-animation");
							setTimeout(function() {
								var loading = $("#about .loading-section")
								loading[0].parentNode.removeChild(loading[0]);
								loadingBool = false;
								showHome()
							}, 2000);

						},
						waitForAll: true
					});
				}
			});
		}, 500)
	}

	function resizeAbout() {
		if (!$("#about .section-content").html()) {
			return false
		}
		$('#about .section-content').height(windowHeight * 0.9);

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
		console.log(article[0])
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
		if (loadingBool) {
			return false;
		}
		if ($("#process .section-content").html()) {
			return false;
		}

		loadingBool = true;

		$(this.parentNode).addClass("show-loading");
		setHash(this.parentNode.id)

		console.log("process: " + new Date().getTime());
		setTimeout(function() {
			$.ajax({
				cache: false,
				url: '/ajax/process/',
				success: function(data) {
					$('#process .section-content').html(data).waitForImages({
						finished: function() {
							console.log("process: " + new Date().getTime());

							resizeProcess();
							new DragDivScroll('process-scoller', draggerText);
							var loading = $("#process .loading-section")
							loading.addClass("fadeout-animation");
							setTimeout(function() {
								var loading = $("#process .loading-section")
								loading[0].parentNode.removeChild(loading[0]);

								$("#content").addClass("content-on");
								$(".active").removeClass("active").addClass("section-off");
								$("#process").addClass("active").removeClass("section-off");
								$("#process").removeClass("show-loading");
								showHome()
							}, 500);

							loadingBool = false;



						},
						waitForAll: true
					});
				}
			});
		}, 500)
	}

	function resizeProcess() {
		var height = windowHeight * 0.9;
		$('#process .section-content').height(height);

		var article = $("#process .instagram-page"),
			w = (height / 2) + "px",
			aPadding = minValue(((windowWidth / 2) - 100), fullWidthMin);
		article.css({
			"width": w
		})
		article[0].style.marginLeft = aPadding + "px"
		console.log((article.length * (height / 2)) + aPadding)
		$("#process .section-content").width((article.length * (height / 2)) + aPadding)
	}

	function resizeImages() {
		$(".image img").each(function(index, value) {
			var width = $(value).width();
			console.log(width);
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

	$(window).resize(function() {
		$('#about .section-content').height(windowHeight * 0.9)
		$('#process .section-content').height(windowHeight * 0.9)
		windowWidth = $(window).width();
		windowHeight = $(window).height();
		resizeWork();
		resizeAbout();
	});
});



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
			img.src = this.style.backgroundImage.split("(")[1].split(")")[0];
		} else {
			img = document.createElement("iframe");
			img.src = children[0].href + "?title=0&amp;byline=0&amp;portrait=0&amp;autoplay=1"
			img.setAttribute('frameborder', "0")
			img.setAttribute('webkitallowfullscreen', "")
			img.setAttribute('mozallowfullscreen', "")
			img.setAttribute('allowfullscreen', "")
			img.height = windowHeight * 0.8;
			img.width = windowHeight * 0.8 * 1.779;
		}
		subcon.appendChild(img);
		container.appendChild(subcon);
		document.body.appendChild(container);

		if ($(img).height() > (windowHeight * 0.9)) {
			$(img).height(windowHeight * 0.9).width("auto");
		}

		$(container).click(closeTHIS);
	}

}


function scrollToID(event) {
	event.preventDefault();
	event.stopPropagation();
	var location = this.href.split("#")[1],
		parentEl = $(this.parentNode.parentNode.parentNode.parentNode.parentNode),
		parentOffset = parentEl.scrollLeft();

	setHash("/" + parentEl[0].parentNode.id + "/" + location)

	parentEl.scrollLeft($("#" + location).offset().left + parentOffset, 0)
	return false;
}

function setHash(location) {
	window.location.hash = location;
}

function closeTHIS() {
	this.parentNode.removeChild(this);
}

function initialize() {
	console.log("initializer is going");

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
}

function hideHome() {
	$("#home").removeClass("show");
}

function clickHome() {
	hideHome();
	$("#content").removeClass("content-on");
	$(".active").removeClass("active").addClass("section-off");
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