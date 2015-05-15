var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var stats = require('./stats.json');
var employees = require('./employees.json');

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
	console.log('In middleware');
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

//get a specific day info
router.route('/stats/:day')
.get(function(req, res){
	var day = req.params.day.toLowerCase();
	if(!stats[day]){
		console.log(req);
		res.statusCode = 404;
		return res.send('Error 404: That is not a valid working day');
	}
	var stat = stats[day];
	res.json(stat);
})
.put(function(req, res){
	var day = req.params.day.toLowerCase();
	if(!stats[day]){
		console.log(req);
		res.statusCode = 404;
		return res.send('Error 404: That is not a valid working day');
	}
	console.log(req.body);
	console.log(stats[day][0]);
	stats[day][0].value = req.body.value;
	console.log(stats[day][0]);
	res.json({message: 'Updated'});
});

//use data route as base
app.use('/', router);

app.listen(process.env.PORT || 4000);