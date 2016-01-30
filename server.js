//base install
var express = require('express');
var app = express();
var bodyParser = require('body-parser');

var mongoose   = require('mongoose');
mongoose.connect('mongodb://localhost:27017/dangerzone'); // connect to our database

var Bear = require('./app/models/crime'); //using this within our database

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;

var router = express.Router();

router.use(function(req, res, next){
	//do logging
	console.log('something is happening');
	next();//make sure we don't stop here
});

// test route to verify everything is 
router.get('/', function(req, res) {
	res.json({ message: 'hooray! welcome to our api!'});
});

app.use('/api',  router);

app.listen(port);
console.log('Magic happens on port' + port);