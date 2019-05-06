/* eslint-disable no-param-reassign */
var Validator = require('validator');
var isEmpty = require('./is-empty');

const validateAgentQueryText = data => {
	const errors = {};
	data.first_name = !isEmpty(data.first_name) ? data.first_name : '';
	data.last_name = !isEmpty(data.last_name) ? data.last_name : '';
	data.email = !isEmpty(data.email) ? data.email : '';
	data.phone_number = !isEmpty(data.phone_number) ? data.phone_number : '';

	if (Validator.isEmpty(data.first_name)) {
		errors.first_name = 'First name is required';
	}
	if (Validator.isEmpty(data.last_name)) {
		errors.last_name = 'Last Name  is required';
	}
	if (Validator.isEmpty(data.email)) {
		errors.email = 'Email is required';
	}
	if (Validator.isEmpty(data.phone_number)) {
		errors.phone_number = 'Phone number is required';
	}
	// if (Validator.isMobilePhoneLocales(data.phone_number).trim(data.phone_number)) {
	// 	errors.phone_number = 'Phone number is invalid';
	// }

	return {
		errors,
		isValid: isEmpty(errors),
	};
};

module.exports = validateAgentQueryText;
