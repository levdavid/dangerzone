var basePrecision = 3;
var cellPrecision = 5;

var getCellName = function(lattitude, longitude, dlat, dlon) {
    var lat = lattitude * Math.pow(10,(cellPrecision - basePrecision));
    var lon = longitude * Math.pow(10,(cellPrecision - basePrecision));
    return Math.floor(lat + dlat) + ":" + Math.floor(lon + dlon);
}

var url = 'mongodb://localhost:27017/dangerzone';
var collectionName = "crime";
var cellNameField = "cellName";
var incidentsArrayField = "incidents";

exports.lattitudeFieldName = "lattitude";
exports.longitudeFieldName = "longitude";
exports.dateFieldName = "date";
exports.typeFieldName = "type";

exports.connect = function(handle) {
    require('mongodb').MongoClient.connect(url, handle);
}

var options = { upsert: true };

exports.storeIncident = function(db, lattitude, longitude, date, type) {
    var data = {
        lattitudeFieldName : lattitude,
        longitudeFieldName : longitude,
        dateFieldName : date,
        typeFieldName : type
    }
    var filter = { cellNameField : getCellName(lattitude, longitude, 0, 0) };
    var update = { $push: { incidentsArrayField : data }};
    db.collection(collectionName).update(filter, update, options);
}

var pollByName = function(db, name) {
    var cursor = db.collection(collectionName).find({ cellNameField : name });
    if (cursor == null || !cursor.hasNext())
        return [];
    else
        return cursor.next()[incidentsArrayField];
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
                input[i][lattitudeField], input[i][longitudeField]);
        if (d < max)
            output[output.length] = input[i];
    }
    return output;
}





















