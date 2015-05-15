var w = 500,
	h = 500;

var colorscale = d3.scale.category10();

//Legend titles
var LegendOptions = ['Today','Yesterday'];

//Data
var d = [
		];

//Options for the Radar chart, other than default
var mycfg = {
  w: w,
  h: h,
  maxValue: 0.2,
  levels: 4,
  ExtraWidthX: 300
}

//Call function to draw the Radar chart
//Will expect that data is in %'s

$.getJSON('/stats', function(data){
		d.push(data.monday);
		// d.push(data.tuesday);
	
		RadarChart.draw("#chart", d, mycfg);
		interaction();
	});
$.getJSON('/employees', function(data){
		for(var i = 0; i < data.length; i++){
			$('#sidebar').append('<div class="employee-img" id="'+data[i].name+'"></div>');
			$('#'+data[i].name).append('<img src="'+data[i].picUrl+'"></img>');
		}
	});

////////////////////////////////////////////
/////////// Initiate legend ////////////////
////////////////////////////////////////////

// var svg = d3.select('#body')
// 	.selectAll('svg')
// 	.append('svg')
// 	.attr("width", w+300)
// 	.attr("height", h)

// //Create the title for the legend
// var text = svg.append("text")
// 	.attr("class", "title")
// 	.attr('transform', 'translate(90,0)') 
// 	.attr("x", w - 70)
// 	.attr("y", 10)
// 	.attr("font-size", "18px")
// 	.attr("fill", "#hhh")
// 	.text("Day of the week");
		
// //Initiate Legend	
// var legend = svg.append("g")
// 	.attr("class", "legend")
// 	.attr("height", 500)
// 	.attr("width", 200)
// 	.attr('transform', 'translate(90,20)') 
// 	;
// 	//Create colour squares
// 	legend.selectAll('rect')
// 	  .data(LegendOptions)
// 	  .enter()
// 	  .append("rect")
// 	  .attr("x", w - 65)
// 	  .attr("y", function(d, i){ return i * 20;})
// 	  .attr("width", 10)
// 	  .attr("height", 10)
// 	  .style("fill", function(d, i){ return colorscale(i);})
// 	  ;
// 	//Create text next to squares
// 	legend.selectAll('text')
// 	  .data(LegendOptions)
// 	  .enter()
// 	  .append("text")
// 	  .attr("x", w - 52)
// 	  .attr("y", function(d, i){ return i * 20 + 9;})
// 	  .attr("font-size", "16px")
// 	  .attr("fill", "#eee")
// 	  .text(function(d) { return d; });	