function pageInitilizer(){workObject=new SetupWork("work");workObject.setSizeOfElements();workObject.startPosition();aboutObject=new SetupWork("about");aboutObject.setSizeOfElements();aboutObject.startPosition();processObject=new SetupWork("process");processObject.setSizeOfElements("instegram");processObject.startPosition();workObject.setSiblings([aboutObject,processObject]);aboutObject.setSiblings([workObject,processObject]);processObject.setSiblings([aboutObject,workObject]);objectList.push(workObject);objectList.push(aboutObject);objectList.push(processObject);$($("#globalNave").children()[0]).bind("click",function(e){e.preventDefault();window.location.hash="";splashsrc&&setTimeout(function(){var e=document.createElement("iframe");e.src=splashsrc;e.width="100%";e.height="100%";e.id="splashFrame";document.getElementById("splash").appendChild(e)},1e3);workObject.resetSize();aboutObject.resetSize();processObject.resetSize()});setTimeout(function(){workObject.resetSize(!0);aboutObject.resetSize(!0);processObject.resetSize(!0);setTimeout(function(){var e=window.location.hash;if(e){e=e.substring(1);var t=e.split("_");$(objectList).each(function(n){if(objectList[n].paerentID()==t[0]){objectList[n].expandThisZoneFromOut();window.location.hash=e}})}},100)},1e3);$(window).bind("resize",function(){workObject.setSizeOfElements();aboutObject.setSizeOfElements();processObject.setSizeOfElements("instegram");var e=$($(".page")[2]);pageWidth=e.width();padgeHeight=e.height();$(".image-fullscreen").each(imagefullscreenresize)});$(window).keydown(function(e){var t=0;e.keyCode=="39"?t=120:e.keyCode=="37"&&(t=-120);aboutObject.scrollAmout(t);workObject.scrollAmout(t);processObject.scrollAmout(t)})}function loadwork(){if(toLoadWork){toLoadWork=!1;$.getJSON("/data/",function(e){var t=$(".articles");e=e.articles;var n;t.each(function(r){n=$(t[r]).children();n.each(function(t){e[r].image[t]&&(e[r].image[t].link?createImage(n[t+1],"/static/img/uploaded/"+e[r].image[t].title,e[r].image[t].link):createImage(n[t+1],"/static/img/uploaded/"+e[r].image[t].title))})})})}setTimeout(function(){var e=$($(".page")[2]);pageWidth=e.width();padgeHeight=e.height();$(".image-fullscreen").each(imagefullscreenresize)},1e3)}function imagefullscreenresize(){this.style.minHeight=padgeHeight;this.style.position="absolute";this.style.left=pageWidth/2-$(this).width()/2;this.style.top=padgeHeight/2-$(this).height()/2}function createImage(e,t,n){var r=document.createElement("img");r.src=t;r.className="image-fullscreen";r.alt=t;e.appendChild(r);if(n){var i=document.createElement("div");i.className="playvideo-button";$(i).click(function(){createVideo(e,n)});e.appendChild(i)}}function createVideo(e,t){e.innerHTML="";var n=document.createElement("iframe");n.src=t+"?autoplay=1;title=0&amp;byline=0&amp;portrait=0&amp;color=c67eb4";n.frameBorder="0";n.width="100%;";n.height="100%;";e.appendChild(n)}function loadAbout(){if(toLoadAbout){toLoadAbout=!1;$.getJSON("/adata/",function(e){var t=$(".biodesc");t.each(function(n){t[n].parentNode.style.backgroundImage="url('/static/img/uploaded/"+e[n+1].bkImage+"')"})})}}function SetupWork(e){function S(){if(!screenIsMoving){screenIsMoving=!0;if(!u){u=!0;L();window.location.hash="#"+t.id;b=t.id;x()}setTimeout(function(){screenIsMoving=!1},1e3)}var e=document.getElementById("splashFrame");e&&setTimeout(function(){splashsrc=e.src;e.parentNode.removeChild(e)},1e3)}function x(){t.id=="about"&&document.getElementById("map-canvas")&&setTimeout(function(){document.getElementById("map-canvas").style.height=$("#map-canvas").parent().height();google.maps.event.trigger(map,"resize")},1100);toLoadWork&&t.id=="work"&&setTimeout(loadwork,1e3);toLoadAbout&&t.id=="about"&&setTimeout(function(){loadAbout()},1e3);$(t).removeClass("navstate");$(t).removeClass("defaultstate");$(t).hasClass("activestate")||$(t).addClass("activestate")}function T(){$(t).removeClass("navstate");$(t).removeClass("activestate");$(t).hasClass("defaultstate")||$(t).addClass("defaultstate")}function N(){$(t).removeClass("activestate");$(t).removeClass("defaultstate");$(t).hasClass("navstate")||$(t).addClass("navstate")}function C(e,t,n,r){e.id=="about_people"&&(r="all");var i=e.childNodes;if(e.hasChildren||i.length<1||i[0].nodeType!=1)return!1;var s=0;if(r=="normal")for(var o=0,u=i.length;o<u;++o){i[o].style.width=t*n+"px";i[o].style.minWidth=t*n+"px";s+=t*n}else if(r=="first")for(var o=0,u=i.length;o<u;++o)if(o==0){i[o].style.width=t*n/2+"px";i[o].style.minWidth=t*n/2+"px";s+=t*n/2}else{i[o].style.width=t*n+"px";i[o].style.minWidth=t*n;s+=t*n}else if(r=="all")for(var o=0,u=i.length;o<u;++o){i[o].style.width=t*n/2+"px";i[o].style.minWidth=t*n/2+"px";s+=t*n/2}return s}function k(){T();a>l?i.style.top=l*5+"%":i.style.top=100-(c.length-l)*5+"%";i.style.opacity=0}function L(){if(u){t.style.top=l*5+"%";t.style.height="90%";t.style.left="0px";t.style.width="100%";r.style.zIndex=0;for(var e=0;e<f.length;++e){f[e].deActive();f[e].activeElement(l);f[e].OutSidesetSize()}i.style.top=l*5+"%";i.style.opacity=1}else{if(a>l){t.style.top=l*5+"%";t.style.height="5%";t.style.left="0%";t.style.width="100%"}else{t.style.top=100-(c.length-l)*5+"%";t.style.height="5%";t.style.left="0%";t.style.width="100%"}r.style.zIndex=-1;k();N()}}var t=2222;t=$("#"+e)[0];var n=$($(t).children()[0]).children()[0],r=$(t).children()[1],i=$(r).children()[0],s=$(r).children()[1];!t||t.nodeType!=1||r.nodeType!=1||i.nodeType!=1||s.nodeType!=1;var o=new DragDivScroll(r.id,"mouseWheelX noOverscroll"),u=!1,a,f,l,c=t.parentNode.childNodes,h=s.childNodes[0],p,d=e,v=0,m=0,g=[0],y=[],b=window.location.hash.split("_")[1];for(var w=0,E=c.length;w<E;++w)t.id==c[w].id&&(l=w);t.setAttribute("style","transition: height 1s, width 1s, left 1s, top 1s; -moz-transition: height 1s, width 1s, left 1s, top 1s; -webkit-transition: height 1s, width 1s, left 1s, top 1s; -o-transition: height 1s, width 1s, left 1s, top 1s;");t.onclick=S;this.scrollAmout=function(e){u&&$(r).scrollLeft($(r).scrollLeft()+e)};this.expandThisZoneFromOut=function(){S()};this.scrollTo=function(e){u&&$(r).scrollLeft(e)};this.setSiblings=function(e){f=e};this.paerentID=function(){return t.id};$(s.parentNode).on("scroll",function(){var e=$(this).scrollLeft();for(var t=0,n=g.length;t<n;t+=1)if(y[t]!=b&&g[t]<e&&g[t+1]>e){b=y[t];history.pushState?history.pushState(null,null,"#"+b):location.hash="#"+b;var r=b.split("_"),i=_gat._getTracker("UA-37086718-1");r.length>1?i._trackPageview("/"+r[0]+"/"+r[1]):i._trackPageview("/"+r[0])}});this.setSizeOfElements=function(e){e=typeof e!="undefined"?e:"default";v=0;m=0;p=$(window).width();var t=s.childNodes,r=0;v=p*.8;staticWidth=v;m=p*.8;if(e=="instegram"){var o=$(window).height()*.9/2;v=o}var u=0;g=[0];for(var a=0,f=t.length;a<f;++a){if(t[a].nodeType==1&&t[a].id!="workButton"){var l;d=="work"?l=C(t[a],v,1,"first"):l=C(t[a],v,1,"normal");l?t[a].style.width=l+"px":t[a].style.width=v+"px";u=t[a].offsetWidth;t[a].style.marginLeft=m+"px";r+=u+m}else if(t[a].nodeType==1&&t[a].id=="workButton"){t[a].style.width=staticWidth*.125+"px";r+=staticWidth*.125}r=Math.floor(r);g.push(r);y.push(t[a].id)}i.style.width=m/4+"px";n.parentNode.style.marginLeft=m/4+"px";s.style.width=Math.ceil(r)+10+"px";var c=$($(i).children()[0]).children();for(var a=0,f=c.length;a<f;++a)c[a].nodeType==1&&c[a].hasChildNodes()&&addEvent(c[a],c[a].firstChild.name,m*.5)};this.resetSize=function(e){e||s.childNodes[0].scrollIntoView();t.style.top="";t.style.left="80%";t.style.height="";t.style.width="";u=!1;k()};this.startPosition=function(){t.style.left=p};this.setActive=function(){u=!0};this.deActive=function(){u=!1};this.activeElement=function(e){a=e};this.activity=function(){return u};this.OutSidesetSize=function(){L()}}function addEvent(e,t,n){$(e).unbind();$(e).bind("click",function(e){goToThisEndPoint(t,n)})}function goToThisEndPoint(e,t){t||(t=0);var n=document.getElementById(e),r=$(n).offset().left,i=$(n.parentNode.parentNode),s=$(n.parentNode).offset().left*-1;i.scrollLeft(s+r-t/2)}function getPageTopLeft(e){var t=e.getBoundingClientRect(),n=document.documentElement;return{left:t.left+(window.pageXOffset||n.scrollLeft||0),top:t.top+(window.pageYOffset||n.scrollTop||0)}}function isParent(e){if(!e||!e.tagName||e.tagName==="body"||e.tagName==="html")return!1;e=e.parentNode;return e.id==="contentWrapper"?!1:e}function initialize(){console.log("initializer is going");var e=[{stylers:[{hue:"#33ccff"}]}];google.maps.visualRefresh=!0;var t={center:new google.maps.LatLng(43.650153,-79.397196),zoom:17,mapTypeId:google.maps.MapTypeId.ROADMAP,overviewMapControl:!0,disableDefaultUI:!0,scrollwheel:!1,styles:e,backgroundColor:"33ccff",zoomControl:!0,zoomControlOptions:{style:google.maps.ZoomControlStyle.LARGE,position:google.maps.ControlPosition.BOTTOM_LEFT}};google.maps.visualRefresh=!0;map=new google.maps.Map(document.getElementById("map-canvas"),t);var n=new google.maps.Marker({position:new google.maps.LatLng(43.650153,-79.397196),map:map,fillColor:"#e6dc5a",title:"also Collective"}),r=$("#smith-address")[0].cloneNode(!0),i=new google.maps.InfoWindow({content:r});i.open(map,n);google.maps.event.addListener(n,"click",function(){i.open(map,n)});$("#about").click(function(){setTimeout(function(){map.setCenter(n.getPosition())},1e3)})}function onYouTubeIframeAPIReady(){myPlayer.setupPlayer()}var google;if(document.getElementById("map-canvas")){console.log("addeing DOM listener");google.maps.event.addDomListener(window,"load",initialize)}var workObject,aboutObject,processObject,screenIsMoving=!1,objectList=[],splashsrc,pageWidth,padgeHeight,toLoadWork=!0,toLoadAbout=!0,map,myPlayer=$("#youtube-player").Jtube({videoId:"_vJG9kaVLEA",ldCssFunc:function(){var e=document.createElement("div");e.id="center-tis-box";var t=document.createElement("div");t.className="ld-box";t.id="minus1";var n=t.cloneNode(!0);n.id="minus2";e.appendChild(t);e.appendChild(n);document.body.appendChild(e);return e},onStart:function(){var e=$("#splashFrame")[0];splashsrc=e.src;$("#location-details").hide()},onDone:function(){pageInitilizer();$("#globalNave").fadeIn("fast");var e=$("#splashFrame")[0];if(!e.src)e.src=splashsrc;else{splashsrc=e.src;e.src=null;e.src=splashsrc}$("#splashFrame").fadeIn("fast");$("#location-details").fadeIn("fast")}});