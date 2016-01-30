var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var ObjectId = require('mongodb').ObjectID;
var util = require('./util.js');
var url = 'mongodb://localhost:27017/dangerzone';

var loadCell = function(collection, callback, lattitude, longitude) {
    cellName = util.getCellName(lattitude, longitude);
    var cursor = collection.find({ "cellName": cellName });
    cursor.each(function(err, doc) {
        assert.equal(err, null);
        if (doc != null) {
            console.log(doc);
        }
        callback();
    });
}

var readData = function(db, callback) {
    loadCell(db.collection("data"), callback, 39.055411901484248, -76.97202793402198);
};

MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    readData(db, function() {
        db.close();
    });
});
