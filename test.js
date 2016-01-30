var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var ObjectId = require('mongodb').ObjectID;
var util = require('./util.js');
var url = 'mongodb://localhost:27017/dangerzone';

var readData = function(collection, callback, lattitude, longitude, distance) {
    var query = { "lattitude" : { $gt: lattitude - distance, $lt: lattitude + distance }, 
        "longitude" : { $gt: lattitude - distance, $lt: lattitude + distance }};
    var cursor = collection.find(query);
    cursor.each(function(err, doc) {
        assert.equal(err, null);
        if (doc != null)
            console.log(doc);
    });
    callback();
}

MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    readData(db.collection("crimes"), function() {db.close;}, 39.090566576040032,  -77.153181723299696, 0.001);
});
