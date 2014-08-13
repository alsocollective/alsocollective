jQuery(document).ready(function() {
	
	navigator.sayswho= (function(){
	    var N= navigator.appName, ua= navigator.userAgent, tem;
	    var M= ua.match(/(opera|chrome|safari|firefox|msie)\/?\s*(\.?\d+(\.\d+)*)/i);
		var W= navigator.userAgent.match(/(iPod|iPhone|iPad)/);
		
		if(W == null){
			W = ["desk"];
		}
	    if(M && (tem= ua.match(/version\/([\.\d]+)/i))!= null) M[2]= tem[1];
	    M= M? [M[1], M[2], W[0]]: [N, navigator.appVersion, '-?'], [W];

	    return M;
	})();
	
	if ((navigator.sayswho[0] == "Safari" && parseFloat(navigator.sayswho[1]) < 6.0 && (navigator.sayswho[2] != "iPad")) ||
		(navigator.sayswho[0] == "Safari" && parseFloat(navigator.sayswho[1]) >= 6.0 && (navigator.sayswho[2] == "iPhone") || (navigator.sayswho[2] == "iPod")) ||
	    (navigator.sayswho[0] == "MSIE" && parseFloat(navigator.sayswho[1]) < 9.0) ||
		(navigator.sayswho[0] == "Opera" && parseFloat(navigator.sayswho[1]) < 13.0) ||
		(navigator.sayswho[0] == "Firefox" && parseFloat(navigator.sayswho[1]) < 6.0)
	){
			
		$("#charts").remove();
		$("#subtext").remove();
		$("#backup").toggleClass('hidden');
		
	}
	else {
		plotData();
	}

});

function makeData(data) {
  
  var dataContainer = [];
  var lastKey = '';
  var iter = 0;
  var dataObject = { 'key' : '', values : []};
  var finish = false;
  var last = data.length -1;
  
  data.forEach(function(d){
	  
	  if (iter == last) finish = true;
	  
	  if ((d.key != lastKey && lastKey ) || finish) {
	  	
		  dataObject.key = lastKey;
		  
		  if (dataObject.key == 'Canada') {
			  dataObject.area = true;
			  dataObject.color = '#4F90CA';
		  }
		  if (dataObject.key =='Males') {
			  dataObject.area = true;
			  dataObject.flip = false;
			  dataObject.color = '#4F90CA';
		  }
		  if (dataObject.key =='Females') {
			  dataObject.area = true;
			  dataObject.color = '#456b92';
		  }
		  
		  if (finish) dataObject.values.push({x:new Date(d.x).getTime(),y:d.y});
		  
		  dataContainer.push(dataObject);
		  dataObject = {'key':'', values:[]};
	  }
	  
	  dataObject.values.push({x: new Date(d.x).getTime(),y:d.y});
	  lastKey = d.key;
	  iter++;
  });
  return dataContainer;

};


function plotData() {

	   d3.csv('data/EmployedByIndustry.csv', function(data){
	  	    var data3 = [];
	    var titles = ['Agriculture', 'Forrestry, Fishing, and Hunting', 'Mining, Quarrying and oil and Gas Extraction', 'Manufacturing', 'Professional, Scientific, and Technical Support', 'Information, Culture and Recreation', 'Health Care', 'Public Administration'];

		finish = false;
		var last = data.length;
		var lastTitle = '';
		var iter = 0;
		var multiDataContainer = [];
		var tempContainer = [];
		
		for (var x = 0; x<last; x++){
			
			if (iter == last-1) finish = true;
			
			if ((data[x].key != lastTitle && lastTitle ) || finish) {
				
				if (finish) tempContainer.push(data[x]);
				
				multiDataContainer.push(makeData(tempContainer));
				tempContainer = [];
				
			}
			tempContainer.push(data[x]);
			lastTitle = data[x].key;
			iter++;
		};
		 
		 for (var i = 0; i < 8; i++) {
			 var data3 = multiDataContainer[i];
			 
			 data3[0].area = true;
			 
	      	 (function(v, data) { 
				 nv.addGraph(function() {
					 //setup variables
					 var gapLine;
					 var bee, gapAmount = 0;
					 var xs, ys;
					 
					 
					 var div = d3.select('#charts').append('div').attr('class', 'chart');
					 div.append("h5").text(titles[v]);
					 var svg = div.append('svg');
		      		 
	
		      	     var chart = nv.models.lineChart()
					 .x(function(d) { return d3.time.format('%Y')(new Date(d.x)) })
					 .tooltipPos({'left':75, 'top':50})
					 .showLegend(false)
					 .margin({'left':35, 'right':70, 'top':0, 'bottom':40})
					 .clipEdge(true)
					 .width(270)
					 .tooltipContent(function(key, x, y, e, graph) {

						 
		   			  return "<h3>" + numberWithCommas(y*1000) + "</h3>" +  "<p>" + (Math.round(x * 0.1)+1)  + "</p>";
		    	   	 });
					 
					 function numberWithCommas(x) {
					     return Math.round(x).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
					 }

					 // declare scales
					 xs = chart.xScale();
					 ys = chart.yScale();

					 
	   					 chart.forceY([0, 2500]);
//						 chart.xScale(d3.time.scale());
//	   					 chart.forceX([new Date('1990'), new Date('2012')]);
					 
					 chart.xAxis
						.orient('bottom')
						.tickSubdivide(1)
						.showMaxMin(true)
						.tickFormat(function(d) { return parseInt(d+1) });
					 
					 //y axis
					 chart.yAxis
					 	.showMaxMin(false)
						.tickPadding(6)
					 	.hideText(true)
					 	.tickFormat(function(d) { return d });

				 	 if (v==0) chart.yAxis.hideText(false);
					 if (v==4) chart.yAxis.hideText(false);
				     
	      	 			
		      	     svg.datum(data).transition().duration(500).call(chart);
	
		      	     nv.utils.windowResize(chart.update);
						
		      	     return chart;
	       	  });
			})(i, data3);
		};
	 

	  });

}

