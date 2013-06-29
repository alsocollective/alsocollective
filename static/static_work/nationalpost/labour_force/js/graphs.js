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
			
		$("#chart svg").remove();
		$("h5").remove();
		$("#backup").toggleClass('hidden');
		
	}
	else {
		plotTheData();
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
		  
		  if (dataObject.key == 'Labour force') {
			  dataObject.area = true;
			  dataObject.color = '#4F90CA';
		  }
		  if (dataObject.key =='Full-time employment') {
			  dataObject.color = '#316184';
		  }
		  if (dataObject.key =='Employment') {
			  dataObject.color = '#316184';
		  }
		  if (dataObject.key =='Part-time employment') {
			  dataObject.color = '#316184';
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


function plotTheData() {
		 
	var data1 = [];
	
	d3.csv('data/6a.csv', function(data){
		 data1 = makeData(data);
	  	 nv.addGraph(function() {
			 var svg = d3.select('#chart svg');
			 
		     var myChart = nv.models.lineChart()
			 .color(d3.scale.category5().range())
			 .y(function(d) { return d.y/1000 })
			 .x(function(d) { return d.x})
			 .margin({'left':40, 'right':30, 'top':30, 'bottom':40})
			 		
		 	 myChart.forceY([0,20]);
			 myChart.forceX([new Date('1993'), new Date('2011')]);
			 
			 myChart.xScale(d3.time.scale());
			 
			 myChart.xAxis
				.tickSubdivide(1)
				.showMaxMin(false)
			 	.tickFormat(function(d) { return d3.time.format('%Y')(new Date(d)) })
				
			 myChart.yAxis
			 
			 	.tickFormat(d3.format('b'))
				.tickPadding(10);
		     
			 svg.datum(data1).transition().duration(500).call(myChart);
	 		
		     nv.utils.windowResize(myChart.update);
			 
		     return myChart;
	   	});
		
		
	   });

}

