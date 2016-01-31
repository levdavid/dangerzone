var basePrecision = 3;
var cellPrecision = 5;

var getCellName = function(lattitude, longitude, dlat, dlon) {
    var lat = lattitude * Math.pow(10,(cellPrecision - basePrecision));
    var lon = longitude * Math.pow(10,(cellPrecision - basePrecision));
    return (Math.floor(lat) + dlat) + ":" + (Math.floor(lon) + dlon);
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

var pollByName = function(db, name, callback) {
   var cursor = db.collection("crime").find({ "cellName" : name });
   cursor.each(function(err, doc) {
      if (err != null) {
         callback(err, null);
      }
      if (doc != null) {
         callback(null, doc.incidents);
      }
   });
}

exports.pollCell = function(db, lattitude, longitude, callback) {
    pollByName(db, getCellName(lattitude, longitude, 0, 0), callback);
}

exports.pollCells = function(db, lattitude, longitude, callback) {
   var offset = [-1,0,1];
   var responseCount = 0;
    var output = [];
    var combiner = function(err, arr) {
       if (err != null)
          callback(err, null);
       output = output.concat(arr);
       responseCount = responseCount + 1;
       if (responseCount == 9)
          callback(null, output);
    }
    for (x in offset)
        for (y in offset) 
           pollByName(db, getCellName(lattitude, longitude, offset[x], offset[y]), combiner)
}

var distance = function(latA, lonA, latB, lonB) {
    var latD = latA-latB;
    var lonD = lonA-lonB;
    return latD*latD + lonD*lonD;
}

exports.pollDistance = function(db, lattitude, longitude, radius, callback) {
   var max = radius*radius;
   var cullFilter = function(err, input) {
      if (err != null)
         callback(err, input);
      var output = [];
      for (i in input) {
         var d = distance(lattitude, longitude,
               input[i]["lattitude"], input[i]["longitude"]);
         if (d < max)
            output[output.length] = input[i];
      }
      callback(null, output);
   }
   exports.pollCells(db, lattitude, longitude, cullFilter);
}





















