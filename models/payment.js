const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const paymentSchema = new Schema({
	email: {
		type: String,
		required: true,
	},
	amount: {
		type: String,
		required: true,
	},
	reference: {
		type: String,
		required: true,
	},
	created_At: {
		type: String,
		required: true,
	},
});

module.exports = mongoose.model('Payment', paymentSchema);
