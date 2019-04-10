/* eslint-disable no-param-reassign */
var Validator = require('validator');
var isEmpty = require('./is-empty');

const validateAgentQueryText = data => {
	const errors = {};
	data.first_name = !isEmpty(data.first_name) ? data.first_name : '';
	data.last_name = !isEmpty(data.last_name) ? data.last_name : '';
	data.email = !isEmpty(data.email) ? data.email : '';
	data.job_role = !isEmpty(data.job_role) ? data.job_role : '';

	if (Validator.isEmpty(data.first_name)) {
		errors.first_name = 'First name is required';
	}
	if (Validator.isEmpty(data.last_name)) {
		errors.last_name = 'Last Name  is required';
	}
	if (Validator.isEmpty(data.email)) {
		errors.email = 'Email is required';
	}
	if (!Validator.isEmail(data.email)) {
		errors.email = 'Email is invalid';
	}

	if (Validator.isEmpty(data.job_role)) {
		errors.job_role = 'Job Role is required';
	}

	return {
		errors,
		isValid: isEmpty(errors),
	};
};

module.exports = validateAgentQueryText;
