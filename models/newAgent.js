const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const agentSchema = new Schema({
	first_name: {
		type: String,
		required: true,
	},
	last_name: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true,
	},
	phone_number: {
		type: String,
		required: true,
	},
	rate: {
		type: String,
		required: false,
	},
	totalRate: {
		type: String,
		required: false,
	},
	totalPeople: {
		type: String,
		required: false,
	},
});

module.exports = mongoose.model('NewAgent', agentSchema);
