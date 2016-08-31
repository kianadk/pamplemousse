var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var Meal = require('./models/meal');

var connection = mongoose.connect('mongodb://localhost/pamplemousse');

var port = 3000;
var app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
var router = express.Router();

router.use(function(req, res, next){
	console.log('doing something');
	next();
});

router.get('/', function(req, res){
	res.sendFile('/index.html');
});

router.route('/meals')
	.get(function(req, res){
		Meal.find(function(err, meals){
			if(err)
				res.send(err);
			res.json(meals);
		});
	})
	.post(function(req, res){
		var meal = new Meal();
		meal.chef = req.body.chef;
		meal.food = req.body.food;
		meal.date = req.body.date;
		meal.save(function(err){
			if(err)
				res.send(err);
			console.log("added meal to db");
		});
	});

app.use(express.static('.'))
app.use('/', router);

app.listen(port, (err) => {
	if(err){
		return console.log("There was an error", err)
	}

	console.log(`server is listening on ${port}`)
});