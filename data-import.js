var util = require('./util.js');

// Load data from the montgomery county data set.
util.connect(function(err, db) {
    console.log("Loading data file...");
    var data = require('./input/moco.json')["data"];
    var timeIndex = 9;
    var typeIndex = 11;
    var lattitudeIndex = 24;
    var longitudeIndex = 25;
    console.log("Importing data...");
    for (i in data)
        util.storeIncident(
                db, 
                data[i][lattitudeIndex], 
                data[i][longitudeIndex], 
                data[i][timeIndex], 
                data[i][typeIndex]);
    db.close();
    console.log("Finished importing.");
});
