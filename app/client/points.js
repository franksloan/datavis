var RadarChart = {
  //id - to attach graph to
  //d - data array
  //options - configuration object
  //dayIndex - change colour each day
  draw: function(id, d, options){
	var cfg = {
		radius: 10,
		w: 800,
		h: 800,
		factor: 1,
		factorLegend: .85,
		levels: 3,
		maxValue: 0,
		radians: 2 * Math.PI,
		opacityArea: 0.3,
		ToRight: 5,
		TranslateX: 120,
		TranslateY: 100,
		ExtraWidthX: 100,
		ExtraWidthY: 100,
		color: d3.scale.category10()
	};

	if('undefined' !== typeof options){
	  for(var i in options){
		if('undefined' !== typeof options[i]){
		  cfg[i] = options[i];
		}
	  }
	}
	cfg.maxValue = Math.max(cfg.maxValue, d3.max(d, function(i){return d3.max(i.map(function(o){return o.value/maximums[o.axis].value;}))}));
	var allAxis = (d[0].map(function(i, j){return i.axis}));
	var total = allAxis.length;
	var radius = cfg.factor*Math.min(cfg.w/2, cfg.h/2);
	var Format = d3.format('%');
	d3.select(id).select("svg").remove();
	
	var g = d3.select(id)
			.append("svg")
			.attr("width", cfg.w+cfg.ExtraWidthX)
			.attr("height", cfg.h+cfg.ExtraWidthY)
			.append("g")
			.attr("transform", "translate(" + cfg.TranslateX + "," + cfg.TranslateY + ")");
			;

	//Text indicating at what % each level is
	for(var j=0; j<cfg.levels; j++){
	  var levelFactor = cfg.factor*radius*((j+1)/cfg.levels);
	  g.selectAll(".levels")
	   .data([1]) //dummy data
	   .enter()
	   .append("svg:text")
	   .attr("x", function(d){return levelFactor*(1-cfg.factor*Math.sin(0));})
	   .attr("y", function(d){return levelFactor*(1-cfg.factor*Math.cos(0));})
	   .attr("class", "legend")
	   .style("font-family", "sans-serif")
	   .style("font-size", "10px")
	   .attr("transform", "translate(" + (cfg.w/2-levelFactor + cfg.ToRight) + ", " + (cfg.h/2-levelFactor) + ")")
	   .attr("fill", "#ggg")
	   .text(Format((j+1)*cfg.maxValue/cfg.levels));
	}
	
	series = 0;

	var axis = g.selectAll(".axis")
			.data(allAxis)
			.enter()
			.append("g")
			.attr("class", "axis");

	axis.append("line")
		.attr("x1", cfg.w/2)
		.attr("y1", cfg.h/2)
		.attr("x2", function(d, i){return cfg.w/2*(1-cfg.factor*Math.sin(i*cfg.radians/total));})
		.attr("y2", function(d, i){return cfg.h/2*(1-cfg.factor*Math.cos(i*cfg.radians/total));})
		.attr("class", "line")
		.attr("id", function(d){return d})
		.style("stroke", "grey")
		.style("stroke-width", "3px");

	axis.append("text")
		.attr("class", "legend")
		//get name of stat from id
		.text(function(i){
			for(var j = 0; j < d[0].length; j++){
				if(d[0][j].axis === i){
					return d[0][j].name;
				}
			};
		})
		.style("font-family", "sans-serif")
		.style("font-size", "18px")
		.style("font-weight", "bold")
		.attr("text-anchor", "middle")
		.attr("dy", "1.5em")
		.attr("transform", function(d, i){return "translate(0, -10)"})
		.attr("x", function(d, i){return cfg.w/2*(1-cfg.factorLegend*Math.sin(i*cfg.radians/total))-60*Math.sin(i*cfg.radians/total);})
		.attr("y", function(d, i){return cfg.h/2*(1-Math.cos(i*cfg.radians/total))-20*Math.cos(i*cfg.radians/total);});

	d.forEach(function(y, x){
	  dataValues = [];
	  g.selectAll(".nodes")
		.data(y, function(j, i){
		  dataValues.push([
		  	//set data points for each eventual polygon and convert values into decimals
			cfg.w/2*(1-(parseFloat(Math.max(j.value/maximums[j.axis].value, 0))/cfg.maxValue)*cfg.factor*Math.sin(i*cfg.radians/total)), 
			cfg.h/2*(1-(parseFloat(Math.max(j.value/maximums[j.axis].value, 0))/cfg.maxValue)*cfg.factor*Math.cos(i*cfg.radians/total))
		  ]);
		});
	  dataValues.push(dataValues[0]);

	  g.selectAll(".area")
					 .data([dataValues])
					 .enter()
					 .append("polygon")
					 .attr("class", "radar-chart-serie"+series)
					 .style("stroke-width", "4px")
					 .style("stroke", cfg.color(series))
					 .attr("points",function(d) {
						 var str="";
						 for(var pti=0;pti<d.length;pti++){
							 str=str+d[pti][0]+","+d[pti][1]+" ";
						 }
						 return str;
					  })
					 .style("fill", function(j, i){return cfg.color(series)})
					 .style("fill-opacity", cfg.opacityArea)
					 .on('mouseover', function (d){
										z = "polygon."+d3.select(this).attr("class");
										g.selectAll("polygon")
										 .transition(200)
										 .style("fill-opacity", 0.1); 
										g.selectAll(z)
										 .transition(200)
										 .style("fill-opacity", .7);
									  })
					 .on('mouseout', function(){
										g.selectAll("polygon")
										 .transition(200)
										 .style("fill-opacity", cfg.opacityArea);
					 });
	  series++;
	});
	series=0;

	d.forEach(function(y, x){
	  g.selectAll(".nodes")
		.data(y).enter()
		.append("svg:circle")
		.attr("class", "radar-chart-serie"+series)
		.attr("id", function(j){return j.axis+series})
		.attr('r', cfg.radius)
		.attr("alt", function(j){return Math.max(j.value/maximums[j.axis], 0)})
		.attr("cx", function(j, i){
		  dataValues.push([
			//convert real values to decimals for distance of circles from origin
			cfg.w/2*(1-(parseFloat(Math.max(j.value/maximums[j.axis].value, 0))/cfg.maxValue)*cfg.factor*Math.sin(i*cfg.radians/total)), 
			cfg.h/2*(1-(parseFloat(Math.max(j.value/maximums[j.axis].value, 0))/cfg.maxValue)*cfg.factor*Math.cos(i*cfg.radians/total))
		]);
		return cfg.w/2*(1-(Math.max(j.value/maximums[j.axis].value, 0)/cfg.maxValue)*cfg.factor*Math.sin(i*cfg.radians/total));
		})
		.attr("cy", function(j, i){
		  return cfg.h/2*(1-(Math.max(j.value/maximums[j.axis].value, 0)/cfg.maxValue)*cfg.factor*Math.cos(i*cfg.radians/total));
		})
		.attr("data-id", function(j){return j.axis})
		.style("fill", cfg.color(series)).style("fill-opacity", .9);
	  series++;
	});
  }
};