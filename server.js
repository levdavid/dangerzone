//base install
var express = require('express');
var app = express();
var bodyParser = require('body-parser');

var mongoose   = require('mongoose');
mongoose.connect('mongodb://localhost:27017/dangerzone'); // connect to our database

var Crime = require('./app/models/crime'); //using this within our database

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

router.route('/crime')
	
	//create a crime (post request to http://localhost:8000)
	.post(function(req, res) {
		var crime = new Crime();
		crime.date = req.body.date;
		crime.name = req.body.name;

		crime.save(function(err) {
			if(err)
				res.send(err);
			res.json({message: 'Crime posted!'});
		});
	})

	.get(function(req, res) {
		Crime.find(function(err,crimes) {
			if(err)
				res.send(err);

			res.json(crimes);
		});
	});

//on routes that end in /crime/:crime_id
router.route('/crime/:crime_id')
	
	//get criminal activity for this id
	.get(function(req, res) {
		Crime.findById(req.params.crime_id, function(err, crime){
			if (err)
				res.send(err);
			res.json(crime)
		});
	})

	.delete(function(req, res) {
        Crime.remove({
            _id: req.params.crime_id
        }, function(err, crime) {
            if (err)
                res.send(err);

            res.json({ message: 'Successfully deleted' });
        });
    });
//all of the routes are going to be prefixed with api
app.use('/api',  router);

app.listen(port);
console.log('Magic happens on port' + port);