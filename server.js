//base install
var express = require('express');
var url = 'mongodb://localhost:27017/dangerzone';
var util = require('./util.js');
var MongoClient = require('mongodb').MongoClient;
var app = express();
var bodyParser = require('body-parser');

var mongoose   = require('mongoose');
mongoose.connect('mongodb://localhost:27017/dangerzone'); // connect to our database

var Crime = require('./app/models/crime'); //using this within our database

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());

var port = process.env.PORT || 80;

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
		crime.lon = req.body.lon;
		crime.lat = req.body.lat;

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


//Search for the element based on lat and lon
router.route('/crime/:lat/:lon')
	.get(function(req, res) {
      var loadCell = function(collection, callback, lattitude, longitude) {
         cellName = util.getCellName(lattitude, longitude);
         var cursor = collection.find({ "cellName" : cellName });
         cursor.each(function(err, doc) {
            if (doc != null) {
               var danger = Math.max(Math.min(doc.incidents.length/75,5),1);
               res.json({ "danger" : danger.toPrecision(1) })
            } else {
               res.json({ "danger" : "1" });
            }
            callback();
         });
      }
      MongoClient.connect(url, function(err, db) {
         loadCell(db.collection("crime"), function() { db.close() }, req.params.lat, req.params.lon);
      });
	});

//on routes that end in /crime/:crime_id
router.route('/crime/:crime_id')
	
	//get criminal activity for this id
	.get(function(req, res) {
		Crime.findById(req.params.crime_id, function(err, crime){
			if (err)
				res.send(err);
			res.json(crime);
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
console.log('Magic happens on port ' + port);
