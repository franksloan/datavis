var w = 480,
	h = 480;

var colorscale = d3.scale.category10();

//Legend titles
var LegendOptions = ['Today','Yesterday'];

//Data
var dayStats = {};
var d = [];
var employees = [];

//default day is monday on starting the app
var day = 'monday';

//Options for the Radar chart, other than default
var mycfg = {
  w: w,
  h: h,
  maxValue: 0.2,
  levels: 4,
  ExtraWidthX: 300
}

//allow convert json stats real value data into percentages
var maximums = {
	tempOut: {value:40, reset: true},
	tempIn: {value: 35, reset: true},
	drinksAvail: {value: 40, reset: true},
	waterPlants: {value: 60, reset: true},
	totalVisitors: {value: 1000, reset: true}
};

//get employee data to display in sidebar	
$.getJSON('/employees', function(data){
		employees = data;
		function setEmployees(employees){
			$('#sidebar').children().remove();
			$('#sidebar').append('<h3>Choose employee to complete task</h3>');
			for(var i = 0; i < employees.length; i++){
				$('#sidebar').append('<div class="employee-img" id="'+employees[i].name+'"></div>');
				$('#'+employees[i].name).append('<img src="'+employees[i].picUrl+'"></img>');
			}
		}
		setEmployees(employees);
	});

//get office stats data with ajax call
$.getJSON('/stats', function(data){
		dayStats = data;
		//just display monday stats on intialisation
		d.push(data[day]);
		
		//draw the chart out on when data has been received
		RadarChart.draw("#chart", d, mycfg,0);
		//call interaction to set up clickable nodes etc
		interaction();
	});