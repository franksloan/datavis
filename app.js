var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var stats = require('./stats.json');
var employees = require('./employees.json');
var listener = app.listen

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());



//serve the static index file
app.use(express.static(__dirname + '/app'));
app.get('/', function(req, res){

	res.sendFile('/index.html');
});

//set up routes for API endpoints
var router = express.Router();

router.use(function(req, res, next){
	next();
});

router.route('/stats')
.get(function(req, res){
	res.json(stats);
});

router.route('/employees')
.get(function(req, res){
	res.json(employees);
});


router.route('/stats/:day')
//get a specific day info - unused
.get(function(req, res){
	var day = req.params.day.toLowerCase();
	if(!stats[day]){
		res.statusCode = 404;
		return res.send('Error 404: That is not a valid working day');
	}
	var stat = stats[day];
	res.json(stat);
})
//set a value for a property in that day
.put(function(req, res){
	var day = req.params.day.toLowerCase();
	if(!stats[day]){
		res.statusCode = 404;
		return res.send('Error 404: That is not a valid working day');
	}
	//find the correct property to update
	for(var i = 0; i < stats[day].length; i++){
		if(stats[day][i].axis === req.body.axis){
			stats[day][i].value = req.body.value;
		}
	}
	res.json({message: 'Updated'});
});

//use data route as base
app.use('/', router);

app.listen(process.env.PORT || 8080, function(){
	console.log('Listening on port 8080');
});