(function ( $ ) {
$.fn.Jtube = function( options ) {
	var YT = null;
	/*
		version 0.1 of J-tube
		by Bohdan Anderson @ Also Collective
		24 10 2013
	*/

	var settings = $.extend({
		iframeEl:this[0],
		player:null,
		playerResizer:null,
		fullscreen:true,
		animationTime:1000,
		winW:0,
		winH:0,
		pW:0,
		pH:0,
		onDone:myDoneFunc,
		onStart:myStartFunc,
		onPause:myPauseFunc,
		videoId:"LkQnJHAPHIU"/*"_vJG9kaVLEA"*//*"dYMgg1evFmw"*/,
		loadingDiv:false,
		loadingEl:null,
		loadingGif:"gif.gif",
		ldCss:true, 		//loading the element
		ldCssEl:null,
		ldCssFunc:null,
		bottomNav:null,
		skipvid:true,
		skipvidEl:null,
		skipvidText:"skipVideo",
		skipvidWidth:0,
		skipvidHeight:0,
		timeLeft:true,
		timeLeftPos:null,
		timePosColour:null,
		timePosGradient:[null,null,null],
		timeNegColour:null,
		timeCounter:true,
		timeCounterEl:null,
		videoLength:0,
		loaded:false,
		cancle:false,
		skipWhash:true,
		skipHash:"#skip-vid"
	}, options );

	if(settings.skipWhash){
		var hash = window.location.hash
		if(hash.length>0){
			settings.cancle = true;
			removeVideo({data:0,target:{a:settings.iframeEl}});
			return null;
		}
	}
	if(settings.loadingDiv){
		settings.winW = $(window).width();
		settings.winH = ($(window).height())
		settings.loadingEl = document.createElement('img');
		settings.loadingEl.src = settings.loadingGif;
		settings.loadingEl.id = "yt-loading-element";
		settings.loadingEl.onload = function(){
			$(settings.loadingEl).css({left:(settings.winW/2)-(settings.loadingEl.width/2),top:(settings.winH/2)-(settings.loadingEl.height/2)})
			document.body.appendChild(settings.loadingEl);
		}
	}
	if(settings.skipvid){
		settings.bottomNav = document.createElement('a');
		settings.bottomNav.href = "#skip-vid";
		settings.bottomNav.id = "yt-bottom-nav";
		settings.skipvidEl = document.createElement('div');
		settings.skipvidEl.id= "yt-skip-video-button";
		settings.skipvidEl.innerHTML = settings.skipvidText;
		settings.bottomNav.appendChild(settings.skipvidEl)
		$(settings.bottomNav).click(function(){
			settings.cancle = true;
			removeVideo({data:0,target:{a:settings.iframeEl}});
		})

		if(settings.timeLeft){
			settings.timeLeftPos = document.createElement("div");
			settings.timeLeftPos.id = "yt-tl-pos";
			if(settings.timePosColour == "" && settings.timePosGradient[0] != null){
				var jtl = $(settings.timeLeftPos);
				// jtl.css("background-image", "-webkit-gradient(linear, 50% 0%, 50% 100%, color-stop(0%, "+settings.timePosGradient[0]+"), color-stop(100%, "+settings.timePosGradient[1]+"))");
				jtl.css("background-image", "-webkit-linear-gradient("+ settings.timePosGradient[0]+", "+ settings.timePosGradient[1]+" 0%,"+settings.timePosGradient[2]+" 100%)");
				jtl.css("background-image", "-moz-linear-gradient("+ settings.timePosGradient[0]+", "+ settings.timePosGradient[1]+" 0%,"+settings.timePosGradient[2]+" 100%)");
				jtl.css("background-image", "-o-linear-gradient("+ settings.timePosGradient[0]+", "+ settings.timePosGradient[1]+" 0%,"+settings.timePosGradient[2]+" 100%)");
				jtl.css("background-image", "linear-gradient("+ settings.timePosGradient[0]+", "+ settings.timePosGradient[1]+" 0%,"+settings.timePosGradient[2]+" 100%)");
			} else {
				settings.timeLeftPos.style.backgroundColor = settings.timePosColour;
			}
			settings.bottomNav.style.backgroundColor = settings.timeNegColour;
			settings.bottomNav.appendChild(settings.timeLeftPos);
			document.body.appendChild(settings.bottomNav);
			resizeCountBar();
			if(settings.timeCounter){
				makeCounter(settings.timeLeftPos);
			}
		} else {
			$(settings.skipvidEl).css("position","absolute");
			document.body.appendChild(settings.bottomNav);
		}
	}

	if(settings.ldCss){
		settings.ldCssEl = settings.ldCssFunc();  //must return a div, this creates the loading elements
	}

	function makeCounter(parent){
		settings.timeCounterEl = document.createElement("div");
		settings.timeCounterEl.id= "time-counter";
		parent.appendChild(settings.timeCounterEl);
		//console.log("what what ",settings.skipvidWidth)
		$(settings.timeCounterEl).css("right",settings.skipvidWidth);

		setInterval(function(){
			if(settings.videoLength && settings.player){
				var out = settings.videoLength - settings.player.getCurrentTime();
				out = sectomin(Math.floor(out));
				settings.timeCounterEl.innerHTML = out;
			}
		},100);
	}

	function sectomin(seconds){
		var min = Math.floor(seconds/60);
		var sec = (seconds - 60*min);
		if(sec < 10){
			sec = "0"+sec;
		}
		return min + ":"+sec;
	}

	function resizeCountBar(){
		settings.skipvidWidth = $(settings.skipvidEl).outerWidth();
		settings.skipvidHeight = $(settings.skipvidEl).outerHeight();
		settings.winW = $(window).width();
		$(settings.timeLeftPos).css({height:settings.skipvidHeight,width:(100 - (settings.skipvidWidth/settings.winW*100)) + "%"});
		// $(settings.timeLeftPos).css({height:settings.skipvidHeight,width:"10%"});
	}

	var tag = document.createElement('script');
	tag.src = "https://www.youtube.com/iframe_api";
	settings.iframeEl.parentNode.insertBefore(tag, settings.iframeEl);
	$(settings.iframeEl).addClass("hide");

	this.setupPlayer = function(){
		if(YT){
			settings.player = new YT.Player(settings.iframeEl.id, {
				height: '390',
				width: '640',
				videoId: settings.videoId,
				// 'autoplay': 1,
				playerVars:{"loop":0,"autohide":0,"controls":0,"showinfo":0,"hd":0,"modestbranding":1,"wmode":"opaque"},
				events: {'onReady': onPlayerReady,'onStateChange':removeVideo}
			});

			setPlayerSizeCustom();
			settings.playerResizer = $(window).on("resize",setPlayerSizeCustom);
			if(!window.addEventListener){
				removeVideo({data:1});
			}
		}
	}
	function onPlayerReady(evt){
		if(!settings.cancle){
			settings.iframeEl = $("#youtube-player")[0];
			settings.player.playVideo();
			evt.target.setPlaybackQuality('hd720');
			setTimeout(fadeInEl,2000);

			//setting up the video length stuff...
			settings.videoLength = settings.player.getDuration();
			//console.log("ths video lenth should be set here", settings.player.getDuration());
			if(settings.skipvid && settings.timeLeft){
				setInterval(function(){
					if(!settings.videoLength){
						settings.videoLength = settings.player.getDuration();
					} else {
						settings.timeLeftPos.style.width = (100 - settings.player.getCurrentTime()/settings.videoLength*100) - (settings.skipvidWidth/settings.winW*100) + "%";
					}
				},50);
			}
		}
	}
	function fadeInEl(){
		if(!settings.cancle){
			$(settings.loadingEl).fadeOut('fast',function(){
				this.parentNode.removeChild(this);
			});
			$(settings.iframeEl).addClass('jtube-animation');
			$(settings.iframeEl).removeClass('hide');
				setTimeout(function(){
					$(settings.iframeEl).removeClass('jtube-animation');
				},settings.animationTime);
		}
	}
	function fadeOutEl(){
		$(settings.iframeEl).addClass('jtube-animation');
		$(settings.iframeEl).addClass('hide');
			setTimeout(function(){
				$(settings.iframeEl).removeClass('jtube-animation');
			},settings.animationTime);
	}
	function removeVideo(evt){
		if(evt.data == 0){
			$(evt.target.a).fadeOut('slow',function(){
				this.parentNode.removeChild(this);
			});
			if(settings.skipvid){
				$(settings.bottomNav).fadeOut('slow',function(){
					this.parentNode.removeChild(this);
				});
			}
			if(!settings.loaded){
				function onPlayerReady(){
					return null;
				}
				$("#splash").fadeIn('fast');
				if(settings.ldCss){
					$(settings.ldCssEl).fadeOut('slow', function() {
						this.parentNode.removeChild(this);
					})
				}
			}
			settings.onDone();
		}else if(evt.data == 1){
			settings.onStart();
			setTimeout(function(){
				$("#splash").fadeIn('slow');
				if(settings.ldCss){
					$(settings.ldCssEl).fadeOut('slow', function() {
						this.parentNode.removeChild(this);
					})
				}
				settings.loaded = true;
			},200);
		} else if(evt.data == 2){
			settings.onPause();
		}

		if(YT){
			if (evt.data == YT.PlayerState.BUFFERING) {
				evt.target.setPlaybackQuality("hd720");
			}
		}
	}
	function myStartFunc(){
	}
	function myDoneFunc(){
	}
	function myPauseFunc() {
	}
	function setPlayerSizeCustom(){
		if(settings.fullscreen){
			settings.winW = $(window).width();
			settings.winH = ($(window).height())+20; //adding 20 for the black bar at bottom
			settings.pW = settings.winW;
			settings.pH = settings.winH;
			var diff = (settings.winW/settings.winH);
			if(settings.winW/16 > settings.winH/9){
				settings.pW = settings.winW;
				settings.pH = settings.winH*(1+diff);
			} else {
				settings.pW = settings.winW*(1+(settings.winH/settings.winW)+diff);
				settings.pH = settings.winH;
			}
			$(settings.player.a).css({width:settings.pW,height:settings.pH,left:(settings.winW-settings.pW)/2,top:(settings.winH-settings.pH)/2});
		}
	}

	return this;


};

}( jQuery ));
