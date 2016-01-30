var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var ObjectId = require('mongodb').ObjectID;
var util = require('./util.js');
var url = 'mongodb://localhost:27017/dangerzone';

var storeIncident = function(collection, lattitude, longitude, date, name) {
    var data = {
        "lattitude": lattitude,
        "longitude": longitude,
        "date":date,
        "name":name
    }
    var filter = { "cellName" : util.getCellName(lattitude, longitude) };
    var update = { $push: { "incidents" : data }};
    var options = { upsert: true };
    collection.update(filter, update, options);
}

var loadFile = function(collection, callback) {
   console.log("Loading raw file.");
    var file = require('./input/moco.json');
    var data = file["data"];
    var timeIndex = 9;
    var nameIndex = 11;
    var lattitudeIndex = 24;
    var longitudeIndex = 25;
   console.log("Sending data to database.");
    for (i in data) {
        var incident = data[i];
        storeIncident(collection, incident[lattitudeIndex], incident[longitudeIndex], incident[timeIndex], incident[nameIndex]);
    }
    console.raw("Saving to disk.");
    callback();
    console.log("Finished");
}

MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    loadFile(db.collection("crime"), function() { db.close(); });
});
