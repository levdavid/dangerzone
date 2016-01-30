var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var CrimeSchema   = new Schema({
    name: String
});

module.exports = mongoose.model('Crime', CrimeSchema);
