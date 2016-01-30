var basePrecision = 3;
var cellPrecision = 5;

var getCellName = function(lattitude, longitude) {
    var lat = lattitude * Math.pow(10,(cellPrecision - basePrecision));
    var lon = longitude * Math.pow(10,(cellPrecision - basePrecision));
    return Math.floor(lat) + ":" + Math.floor(lon);
}

console.log(getCellName(39.188573792034447,-77.20146939275935));
