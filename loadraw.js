var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var ObjectId = require('mongodb').ObjectID;
var url = 'mongodb://localhost:27017/dangerzone';

var gridDigits = 5;
var locDigits = 2;

var storeIncident = function(collection, lattitude, longitude, date, name) {
    console.log(lattitude + "," + longitude + "," + date + "," + name);
}

var loadFile = function(collection) {
    var file = require('./input/moco.json');
    var data = file["data"];
    var timeIndex = 9;
    var nameIndex = 11;
    var lattitudeIndex = 24;
    var longitudeIndex = 25;
    for (i in data) {
        var incident = data[i];
        storeIncident(collection, incident[lattitudeIndex], incident[longitudeIndex], incident[timeIndex], incident[nameIndex]);
    }
}

var loadData = function(db, callback) {
    loadFile(db.collection("data"));
    callback();
};

MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    loadData(db, function() {
        db.close();
    });
});
