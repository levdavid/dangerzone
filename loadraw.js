var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var ObjectId = require('mongodb').ObjectID;
var util = require('./util.js');
var url = 'mongodb://localhost:27017/dangerzone';

var storeIncident = function(collection, callback, lattitude, longitude, date, name) {
    var data = {
        "lattitude": lattitude,
        "longitude": longitude,
        "date":date,
        "name":name
    }
    var filter = { "cellName" : util.getCellName(lattitude, longitude) };
    var update = { $push: { "incidents" : data }};
    var options = { upsert: true };
    console.log("Inserting!");
    collection.findOneAndUpdate(filter, update, options, callback);
}

var loadFile = function(collection, callback) {
    var file = require('./input/moco.json');
    var data = file["data"];
    var timeIndex = 9;
    var nameIndex = 11;
    var lattitudeIndex = 24;
    var longitudeIndex = 25;

    var storeCallback = function(err, res){
        console.log("Inserted!");
        assert.equal(err, null);
        console.log("Success!");
    }

    for (i in data) {
        var incident = data[i];
        storeIncident(collection, storeCallback, 
                incident[lattitudeIndex], incident[longitudeIndex], incident[timeIndex], incident[nameIndex]);
    }
    callback();
}

var loadData = function(db, callback) {
    loadFile(db.collection("data"), callback);
};

MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    loadData(db, function() {
        db.close();
    });
});
