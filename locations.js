var mongoose = require('mongoose');
var locationSchema = new mongoose.schema({
	name: {type: String, required: true},
	address: String,
	rating: {type: Number, "default": 0, min: 0, max: 5},
	facilities: [String],
	coord: {type: [Number], index: '2dsphere'}
});