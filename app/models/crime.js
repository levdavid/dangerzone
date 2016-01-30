var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var CrimeSchema   = new Schema({
    score: String,
    lat: String,
    lon: String
});

module.exports = mongoose.model('Crime', CrimeSchema);
