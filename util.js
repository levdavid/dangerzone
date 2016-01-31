var basePrecision = 3;
var cellPrecision = 5;

var getCellName = function(lattitude, longitude, dlat, dlon) {
    var lat = lattitude * Math.pow(10,(cellPrecision - basePrecision));
    var lon = longitude * Math.pow(10,(cellPrecision - basePrecision));
    return Math.floor(lat + dlat) + ":" + Math.floor(lon + dlon);
}

var url = 'mongodb://localhost:27017/dangerzone';

exports.connect = function(handle) {
    require('mongodb').MongoClient.connect(url, handle);
}

var options = { upsert: true };

exports.storeIncident = function(db, lattitude, longitude, date, type) {
    var data = {
        "lattitude" : lattitude,
        "longitude" : longitude,
        "date" : date,
        "type" : type
    }
    var filter = { "cellName" : getCellName(lattitude, longitude, 0, 0) };
    var update = { $push: { "incidents" : data }};
    db.collection("crime").update(filter, update, options);
}

var pollByName = function(db, name) {
    var cursor = db.collection("crime").find({ "cellName" : name });
    if (cursor == null || !cursor.hasNext())
        return [];
    else
        return cursor.next()["incidents"];
}

exports.pollCell = function(db, lattitude, longitude) {
    return pollByName(db, getCellName(lattitude, longitude, 0, 0));
}

exports.pollCells = function(db, lattitude, longitude) {
    var output = [];
    for (dx in [-1,0,1])
        for (dy in [-1,0,1])
            output = output.concat(pollByName(db, lattitude, longitude, x, y));
}

var distance = function(latA, lonA, latB, lonB) {
    var latD = latA-latB;
    var lonD = lonA-lonB;
    return latD*latD + lonD*lonD;
}

exports.pollDistance = function(db, lattitude, longitude, radius) {
    var max = radius*radius;
    var input = pollCells(db, lattitude, longitude);
    var output = [];
    for (i in input) {
        var d = distance(lattitude, longitude,
                input[i]["lattitude"], input[i]["longitude"]);
        if (d < max)
            output[output.length] = input[i];
    }
    return output;
}





















