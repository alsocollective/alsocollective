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
  var last = data.length - 1;
  
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
			  dataObject.flip = true;
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
		 
	d3.csv('data/9.csv', function(data){
	
	
	  	var data8 = [];
	    var titles = ['All Occupations', 'Management', 'Business, Finance & Administrative', 'Natural & Applied Sciences', 'Health Occupations', 'Education & Gov. Service', 'Art, Culture & Recreation', 'Sales & Service', 'Trades & Transport', 'Processing & Manufacturing'];
	    //data3 = makeData(data);
		finish = false;
		var last = data.length;
		var lastTitle = '';
		var iter = 0;
		var multiDataContainer = [];
		var tempContainer = [];
		for (var x = 0; x<last; x++){
				
			if (iter == last-1) finish = true;
				
			if ((data[x].key != lastTitle && data[x].key != "change" && lastTitle ) || finish) {
					
				if (finish) {
					tempContainer.push(data[x]);
					multiDataContainer.push(makeData(tempContainer));
				}
				else {
					console.log(tempContainer);
					var dataContainer = makeData(tempContainer);
					multiDataContainer.push(dataContainer);
					tempContainer = [];
				}
			}
			if (!finish) tempContainer.push(data[x]);
	
			lastTitle = data[x].key;
			iter++;
		};
		
		
	for (var i = 0; i < 24; i++) {
	
	
			 var data9 = multiDataContainer[i];
			 
			 (function(v, data) { 
		  	 	nv.addGraph(function() {
			 
	//				 setup variables
				 var gapLine;
				 var bee, gapAmount = 0;
				 var xs, ys;
				 //console.log("VALUE LOW : " + data[0].values[0].y );
				 //console.log("VALUE HIGH : " + data[1].values[1].y );
				 //var change = 100 - (data[1].values[0].y / data[1].values[1].y) * 100.0;
								 
				 var div = d3.select('#charts').append('div').attr('class', 'chart-2');
				 div.append("h5").text(data[0].key);
				 var diffDiv = div.append("h2");
				 //var diffDiv = div.append("h2");
				  //div.append("h3").text(change.toFixed(1) + " %");
				 var svg = div.append('svg');
				  	
					      		 
				
	      	     var chart = nv.models.lineChart()
					 .y(function(d) { return d.y/100 })
					 .x(function(d) { return d.x})
					 .tooltips(true)
					 .tooltipPos({'left':0, 'top':20})
					 .tooltipContent(function(key, x, y, e, graph) {
						 console.log(" X: " + x + " Y: " + y);
						 return  "<h4> $" + y.toFixed(2) + ' in ' + x + '</h4>';
					 })
					 .margin({'left':30, 'right':30, 'top':20, 'bottom':60})
					 .showLegend(false)
					 .yDomain([0,50])

					 .width(180);

				 

				 									 
				 chart.xAxis
//					.hideText(false)
					.showMaxMin(true)
				 	.tickFormat(function(d) { return d3.time.format('%Y')(new Date(d)) })
				
				 //chart.forceX([1992, 2012]);
//			     chart.yAxis.tickFormat(d3.format(',.2f'));
				 chart.yAxis
   				    .ticks (0)
					.tickSubdivide(0)
				 	.hideText(true)
					.tickFormat(function(d) { return d});
					
				 
				 
   				 chart.xScale(d3.time.scale());
   				 chart.forceX([new Date('1997'), new Date('2012')]);
			 

   				 xs = chart.xScale();
   				 ys = chart.yScale();
		     
				 svg.datum(data).transition().duration(500).call(chart);
	 		
			
				
				 var gapdiv = div.select('.nv-scatter .nv-groups .nv-series-0');

				 var op = gapdiv.node().__data__.values[0];
									 
				 var lp = gapdiv.node().__data__.values[3];
				 
				 xs = chart.xScale();
				 ys = chart.yScale();
									 
				 var difference = 100 - (op.y/lp.y * 100.0);
				 var gapdata = [[op.x, difference/2], [lp.x, difference/2]];

//										 div.select('.nv-groups').append()
 				 gapLine = d3.svg.area()
					 .x(function(d) { return xs(d[0])})
					 .y0(function(d) { return ys(d[1])})
				     .y1(240);
					 
										
//										 div.select('.nv-groups').append()
 				div.select('.nv-groups').append('g')
 					 .insert('path')
 					 .datum(gapdata)
 					 .attr('d', gapLine)
 				 	 .attr('class', 'dline2');
									
				var diffString = (difference > 0) ? "+" + difference.toFixed(1) : difference.toFixed(1);
				diffString += "%";
				diffDiv.text(diffString);
											 	
				 
			     nv.utils.windowResize(chart.update);
	
			     return chart;
				 
		   	});
		   })(i, data9);
	  
	   	 };
	   });	   

//    d3.csv('data/8.csv', function(data){
//   	var data8 = [];
//     var titles = ['All Occupations', 'Management', 'Business, Finance & Administrative', 'Natural & Applied Sciences', 'Health Occupations', 'Education & Gov. Service', 'Art, Culture & Recreation', 'Sales & Service', 'Trades & Transport', 'Processing & Manufacturing'];
//     //data3 = makeData(data);
// 	finish = false;
// 	var last = data.length;
// 	var lastTitle = '';
// 	var iter = 0;
// 	var multiDataContainer = [];
// 	var tempContainer = [];
// 	
// 	console.log("DATA LENGTH: " + data.length);
// 	
// 	
// 	for (var x = 0; x<last; x++){
// 			
// 		if (iter == last-1) finish = true;
// 			
// 		if ((data[x].key != lastTitle && data[x].key != "change" && lastTitle ) || finish) {
// 				
// 			if (finish) {
// 				tempContainer.push(data[x]);
// 				multiDataContainer.push(makeData(tempContainer));
// 			}
// 			else {
// 				console.log(tempContainer);
// 				var dataContainer = makeData(tempContainer);
// 				multiDataContainer.push(dataContainer);
// 				tempContainer = [];
// 			}
// 		}
// 		if (!finish) tempContainer.push(data[x]);
// 
// 		lastTitle = data[x].key;
// 		iter++;
// 	};
// 	
// 	
// 	for (var i = 0; i < 10; i++) {
// 			 
// 			 var cdata = multiDataContainer[i];
// 			 cdata[0].area = true;
// 			 cdata[0].color = '#4F90CA';
// 			 console.log(cdata[1]);
// 	      	 (function(v, data) { 
// 				 nv.addGraph(function() {
// 					 //setup variables
// 					 var gapLine;
// 					 var bee, gapAmount = 0;
// 					 var xs, ys;
// 					 //console.log("VALUE LOW : " + data[0].values[0].y );
// 					 //console.log("VALUE HIGH : " + data[1].values[1].y );
// 					 //var change = 100 - (data[1].values[0].y / data[1].values[1].y) * 100.0;
// 					 
// 					 var div = d3.select('#charts').append('div').attr('class', 'chart-2');
// 					 div.append("h5").text(data[0].key);
// 					 var diffDiv = div.append("h2");
// 					  //div.append("h3").text(change.toFixed(1) + " %");
// 					 var svg = div.append('svg');
// 					
// 		      		 
// 	
// 		      	     var chart = nv.models.lineChart()
// 					 .y(function(d) { return d.y/100000 })
// 					 .tooltipPos({'left':100, 'top':500})
// 					 .margin({'left':30, 'right':30, 'top':20, 'bottom':60})
// 					 .showLegend(false)
// 					 
// 					 .yDomain([0,5])
// 					 .xDomain([ new Date("01-01-2000"), new Date("01-01-2010") ])
// 					 .width(180)
// 					 .tooltipContent(function(key, x, y, e, graph) {
// 						 //e.seriesIndex ? bee = 0 : bee = 1;
// 						 // gapdiv = div.select('.nv-scatter .nv-groups .nv-series-' + bee);
// 						 // var op = gapdiv.node().__data__.values[e.pointIndex];
// 						 // var gapdata = [[e.point.x, e.point.y], [op.x, op.y]];
// 						 // console.log(gapdata);
// 						 // 
// 						 // gapLine = d3.svg.line()
// 						 // 							 .x(function(d) { return xs(d[0])})
// 						 // 							 .y(function(d) { return ys(d[1])});
// 						 // 							 
// 						 // div.select('.nv-groups').append('g')
// 						 // 							 .insert('path')
// 						 // 							 .datum(gapdata)
// 						 // 							 .attr('d', gapLine)
// 						 // 	 .attr('class', 'cline');
// 						 // 
// 						 // gapAmount = d3.format('.2f')(Math.abs(e.point.y - op.y));
// 						 // wageAmount = d3.format('.2f')(e.point.y);
// 						 
// 						 /*return '<h3>' + key + '<br>' + '$' + e.point.y +'</h3>' + '<p>' + ((op.y < e.point.y) ? '+' : '- $') + gapAmount + ' gap ' + x + ' in' + e.point.y + '</p>';*/
// 						 console.log(" X: " + x + " Y: " + y);
// 						 return  "<h4>" + y.toFixed(2) + ' in ' + (parseInt(x) + 1) + '</h4>';
// 					 });
// 					 
// 					 // declare scales
// 	
// 					
// 					   //converted to ms already after you did +(date)
// 
// 					   //then you just rewrite the ticks - if you want a custom number of ticks you can do it like this
// 
// 					   //numberOfTicks is a method I added to the axis component (axis.js) to give the number of ticks the user would like to have
// 
// 					   //x.domain() now contains the forced values instead of the values you initially used..
// 
// 			
// 					 //console.log(gapdiv);
// 					 //console.log("OP: " + op + " LP: " + lp);
// 					 // 					 var gapdata = [[e.point.x, e.point.y], [op.x, op.y]];
// 					 // 					 console.log(gapdata);
// 					 // 						 
// 					 // 					 gapLine = d3.svg.line()
// 					 // 						 .x(function(d) { return xs(d[0])})
// 					 // 						 .y(function(d) { return ys(d[1])});
// 					 // 							 
// 					 // 					 div.select('.nv-groups').append('g')
// 					 // 						 .insert('path')
// 					 // 						 .datum(gapdata)
// 					 // 						 .attr('d', gapLine)
// 					 // 					 	 .attr('class', 'cline');
// 					 // 					 
// 				 chart.xAxis
// 					.orient('bottom')
// 					.showMaxMin(true)
// 					.tickFormat(function(d) { return d3.time.format('%Y')(new Date(d)); });
// 					 
// 				 //y axis
// 				 chart.yAxis
// 					.tickPadding(20)
// 				 	.hideText(true)
// 					.tickFormat(function(d) { return d});
// 					
// 					chart.forceX([new Date('01/01/2000'), new Date('01/01/2010')]);
// 				
// 				 if (v == 0 || v==5) chart.yAxis.hideText(false);
// 	      	 	
// 				 // var gapdata = [[d3.time.format('%Y')(new Date(2000)), "100990"], [d3.time.format('%Y')(new Date(2010)), "236240"]];
// 				 // 				 
// 				 // 				 gapdiv = div.select('.nv-scatter .nv-groups .nv-series');
// 				 // 				 //var op = gapdiv.node().__data__.values[e.pointIndex];
// 				 // 				 
// 
// 				 // 							 
// 				 // 				 div.select('.nv-groups').append('g')
// 				 // 					 .insert('path')
// 				 // 					 .datum(gapdata)
// 				 // 					 .attr('d', gapLine)
// 				 // 				 	 .attr('class', 'cline');
// 				 // 					 
// 				 // 					 
// 		      	   svg.datum(data).transition().duration(500).call(chart);
// 				   
// 		      	     nv.utils.windowResize(chart.update);
// 					 
// 				
// 									 var gapdiv = div.select('.nv-scatter .nv-groups .nv-series-0');
// 
// 									 var op = gapdiv.node().__data__.values[0];
// 									 
// 									 var lp = gapdiv.node().__data__.values[10];
// 									 xs = chart.xScale();
// 									 ys = chart.yScale();
// 									 
// 									 var difference = 100 - (op.y/lp.y * 100.0);
// 									 var gapdata = [[op.x, op.y/100000], [lp.x, lp.y/100000]];
// 								
// 					 				 gapLine = d3.svg.line()
// 										 .x(function(d) { return xs(d[0])})
// 										 .y(function(d) { return ys(d[1])});
// 										
// //										 div.select('.nv-groups').append()
// 					 				 div.select('.nv-groups').append('g')
// 					 					 .insert('path')
// 					 					 .datum(gapdata)
// 					 					 .attr('d', gapLine)
// 					 				 	 .attr('class', 'dline');
// 									
// 									var diffString = (difference > 0) ? "+" + difference.toFixed(1) : difference.toFixed(1);
// 									diffString += "%";
// 									diffDiv.text(diffString);
// 											 	
// 			 					 
// 									 //console.log("OP: " + op.y + " LP: " + lp.y);
// 									 
// 		      	     return chart;
// 	
// 						 
// 	       	  });
// 			})(i, cdata);
// 		};
//     });
	  

}

