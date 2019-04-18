/* eslint-disable no-param-reassign */
var Validator = require('validator');
var isEmpty = require('./is-empty');

const validateApplicantQueryText = data => {
	const errors = {};
	data.first_name = !isEmpty(data.first_name) ? data.first_name : '';
	data.last_name = !isEmpty(data.last_name) ? data.last_name : '';
	data.email = !isEmpty(data.email) ? data.email : '';
	data.number = !isEmpty(data.number) ? data.number : '';
	data.experience = !isEmpty(data.experience) ? data.experience: '';
	data.tech_stack = !isEmpty(data.tech_stack) ? data.tech_stack: '';
	data.linkedin_profile = !isEmpty(data.linkedin_profile) ? data.linkedin_profile: '';
	data.github_profile = !isEmpty(data.github_profile) ? data.github_profile: '';
	data.website = !isEmpty(data.github_profile) ? data.github_profile: '';

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

	if (Validator.isEmpty(data.number)) {
		errors.number = 'Phone Number is required';
	}

	if (Validator.isEmpty(data.experience)) {
		errors.experience = 'experience is required';
	}

	if (Validator.isEmpty(data.tech_stack)) {
		errors.tech_stack = 'Tech Stack is required';
	}

	if (Validator.isEmpty(data.website)) {
		errors.website = 'Website is required';
	}

	if (Validator.isEmpty(data.github_profile)) {
		errors.github_profile = 'Github Profile is required';
	}

	return {
		errors,
		isValid: isEmpty(errors),
	};
};

module.exports = validateApplicantQueryText;
