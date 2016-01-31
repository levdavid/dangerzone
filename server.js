//base install
var util = require('./util.js');

var express = require('express');
var app = express();
var bodyParser = require('body-parser');

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());

var port = process.env.PORT || 80;

var router = express.Router();

router.use(function(req, res, next){
	//do logging
	next();//make sure we don't stop here
});

// test route to verify everything is 
router.get('/', function(req, res) {
	res.json({ message: 'hooray! welcome to our api!'});
});

//Search for the element based on lattitude and longitude
router.route('/crime/:lat/:lon')
    .get(function(req, res) {
        var lattitude = req.params.lat;
        var longitude = req.params.lon;
        console.log("Processing " + lattitude + "/" + longitude);
        var reportDanger = function(err, db) {
            if (err != null) {
                var incidents = util.pollDistance(db, lattitude, longitude, 0.001);
                var danger = Math.max(5, incidents.length / 25 + 1);
                res.json({ "danger" : danger, "error" : false});
            } else
                res.json({ "danger" : 1, "error" : true });
            db.close();
        }
        util.connect(reportDanger);
	});

//all of the routes are going to be prefixed with api
app.use('/api',  router);

app.listen(port);
console.log("Listening...");
