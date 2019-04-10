const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const jobSchema = new Schema({
	advert_header: {
		type: String,
		required: true,
	},
	company_name: {
		type: String,
		required: true,
	},
	job_title: {
		type: String,
		required: true,
	},
	job_link: {
		type: String,
		required: true,
	},
	job_description: {
		type: String,
		required: true,
	},
	job_pay_range: {
		currency: { type: String },
		range: {
			min: { type: Number, min: 0 },
			max: { type: Number, min: 0 },
		},
	},
	employer_email: {
		type: String,
		required: false,
	},
	career_level: {
		type: String,
		required: true,
	},
	job_category: {
		type: String,
		required: true,
	},
	location: {
		type: String,
		required: true,
	},
	date_added: {
		type: Date,
		default: Date.now,
	},
});

module.exports = mongoose.model('Job', jobSchema);
