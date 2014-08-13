
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

	d3.csv('data/8.csv', function(data){
		finish = false;
		var last = data.length;
		var lastTitle = '';
		var iter = 0;
		var multiDataContainer = [];
		var tempContainer = [];
		//itterate through the data using the makeData function
		for (var x = 0; x<last; x++){
			if (iter == last-1) finish = true;

			if ((data[x].key != lastTitle && data[x].key != "change" && lastTitle ) || finish) {

				if (finish) {
					tempContainer.push(data[x]);
					multiDataContainer.push(makeData(tempContainer));
				}
				else {
					var dataContainer = makeData(tempContainer);
					multiDataContainer.push(dataContainer);
					tempContainer = [];
				}
			}
			if (!finish) tempContainer.push(data[x]);

			lastTitle = data[x].key;
			iter++;
		};

		//itterate createing the charts
		for (var i = 0; i < 10; i++) {
			var cdata = multiDataContainer[i];

			cdata[0].area = true;
			cdata[0].color = '#4F90CA';
			(function(v, data) {

				nv.addGraph(function() {
					//setup variables
					var gapLine;
					var bee, gapAmount = 0;
					var xs, ys;

					//setting the title above each chart
					var div = d3.select('#charts').append('div').attr('class', 'chart-2');
					div.append("h5").text(data[0].key);

					//setting up the sub text
					var diffDiv = div.append("h2");

					//div.append("h3").text(change.toFixed(1) + " %");
					var svg = div.append('svg');

					var chart = nv.models.lineChart()
						.y(function(d) { return d.y/100000 })
						.tooltipPos({'left':100, 'top':500})
						.margin({'left':30, 'right':30, 'top':20, 'bottom':60})
						.showLegend(false)
						.width(220)

						.yDomain([0,5])
						.xDomain([new Date('01/01/2000'),new Date('01/01/2010')])

						.tooltipContent(function(key, x, y, e, graph) {
							var op = gapdiv.node().__data__.values[0];

							xs = chart.xScale();
							ys = chart.yScale();

							var gapdata = [[op.x, op.y/100000], [e.point.x, e.point.y/100000]];

							gapLine = d3.svg.line()
								.x(function(d) { return xs(d[0])})
								.y(function(d) { return ys(d[1])});

							//adding a new line with the class of cline
							div.select('.nv-groups').append('g')
								.insert('path')
								.datum(gapdata)
								.attr('d', gapLine)
								.attr('class', 'cline');
								//this line if removed in chart.dispatch.on where it removes all clines.

							var locDiff = (100 - ((e.point.y/op.y) * 100.0)) * -1;

							var locDiffString = (locDiff > 0) ? "+" + locDiff.toFixed(1) : locDiff.toFixed(1);
							locDiffString += "%";

							div[0][0].children[1].innerHTML = locDiffString;
							//hide the main line
							div.select('.dline').style("display","none");

							return  '<h4>' + numberWithCommas((y.toFixed(10)*100000).toFixed(0)) + '</h4>' +
							
							'<p> claims in ' + (parseInt(x)+1) + '</p>';
							
						});

					chart.dispatch.on('tooltipHide', function(event) {
						nv.tooltip.cleanup();
						$('.cline').remove();
						div[0][0].children[1].innerHTML = diffString;

						//displays the main line (didn't know what to put so left it blank makeing the css not work)
						div.select('.dline').style("display","");

					});
					
					function numberWithCommas(x) {
					    return Math.round(x).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
					}

					chart.xAxis
						.orient('bottom')
						.showMaxMin(true)
						.tickSize(5)
						.tickValues([new Date('01/01/2000'),new Date('01/01/2010')])
						.tickFormat(function(d) { return d3.time.format('%Y')(new Date(d)); });

					chart.yAxis
						.tickPadding(20)
						.hideText(true)
						.tickFormat(function(d) { return d});


					if (v == 0 || v==5) chart.yAxis.hideText(false);

					svg.datum(data).transition().duration(500).call(chart);

					nv.utils.windowResize(chart.update);


					var gapdiv = div.select('.nv-scatter .nv-groups .nv-series-0');

					var op = gapdiv.node().__data__.values[0];
					var lp = gapdiv.node().__data__.values[10];

					xs = chart.xScale();
					ys = chart.yScale();


					var difference = (100 - ((lp.y/op.y) * 100.0)) * -1;
					var gapdata = [[op.x, op.y/100000], [lp.x, lp.y/100000]];


					gapLine = d3.svg.line()
						.x(	function(d) { return xs(d[0])})
						.y(function(d) { return ys(d[1])});

					div.select('.nv-groups').append('g')
						.insert('path')
						.datum(gapdata)
						.attr('d', gapLine)
						.attr('class', 'dline');


					var diffString = (difference > 0) ? "+" + difference.toFixed(1) : difference.toFixed(1);
					diffString += "%";
					diffDiv.text(diffString);
					//console.log("OP: " + op.y + " LP: " + lp.y);

					return chart;
				});
			})(i, cdata);
		};
	});
}