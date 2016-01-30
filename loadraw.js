var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var ObjectId = require('mongodb').ObjectID;
var util = require('./util.js');
var url = 'mongodb://localhost:27017/dangerzone';

var storeIncident = function(collection, lattitude, longitude, date, name) {
    var data = {
        "lattitude": lattitude,
        "longitude": longitude,
        "date": date,
        "name": name
    }
    var update = { $push: { "crimes" : data }};
    var options = { upsert: true };
    collection.update({}, update, options);
}

var loadData = function(collection, callback) {
    console.log("Loading data...");
    var file = require('./input/moco.json');
    var data = file["data"];
    var timeIndex = 9;
    var nameIndex = 11;
    var lattitudeIndex = 24;
    var longitudeIndex = 25;

    console.log("Inserting data...");
    for (i in data) {
        var incident = data[i];
        storeIncident(collection, incident[lattitudeIndex], incident[longitudeIndex], incident[timeIndex], incident[nameIndex]);
    }
    console.log("Saving changes...");
    callback();
}

MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    loadData(db.collection("moco"), function() {
        db.close();
    });
});
console.log("Finished!");
