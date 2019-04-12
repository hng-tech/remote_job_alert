/* eslint-disable no-param-reassign */
var Validator = require('validator');
var isEmpty = require('./is-empty');

const validateQueryText = data => {
	const errors = {};

	// data.advert_header = !isEmpty(data.advert_header) ? data.advert_header : '';
	data.company_name = !isEmpty(data.company_name) ? data.company_name : '';
	data.job_title = !isEmpty(data.job_title) ? data.job_title : '';
	data.job_link = !isEmpty(data.job_link) ? data.job_link : '';
	data.job_description = !isEmpty(data.job_description) ? data.job_description : '';
	data.job_category = !isEmpty(data.job_category) ? data.job_category : '';
	// data.location = !isEmpty(data.location) ? data.location : '';

	// if (Validator.isEmpty(data.advert_header)) {
	// 	errors.advert_header = 'Advert Header is required';
	// }
	if (Validator.isEmpty(data.company_name)) {
		errors.company_name = 'Company Name  is required';
	}
	if (Validator.isEmpty(data.job_title)) {
		errors.job_title = 'The job title is required';
	}
/*
	if (Validator.isEmpty(data.job_link)) {
		errors.job_link = 'Job link is required';
	}
	*/
	if (Validator.isEmpty(data.job_description)) {
		errors.job_description = 'Job Description is required';
	}
	/*
	if (Validator.isEmpty(data.job_category)) {
		errors.job_category = 'Job Category is required';
	}
	*/
	// if (Validator.isEmpty(data.location)) {
	// 	errors.location = 'Job Location is required';
	// }

	return {
		errors,
		isValid: isEmpty(errors),
	};
};

module.exports = validateQueryText;
