/* eslint-disable no-param-reassign */
var Validator = require('validator');
var isEmpty = require('./is-empty');

const validateRegisteredUser = data => {
	const errors = {};
	data.first_name = !isEmpty(data.first_name) ? data.first_name : '';
	data.last_name = !isEmpty(data.last_name) ? data.last_name : '';
	data.email = !isEmpty(data.email) ? data.email : '';
	data.phone_number = !isEmpty(data.phone_number) ? data.phone_number : '';


		if (Validator.isEmpty(data.first_name)) {
			errors.first_name = 'Your First Name is required';
    }
    if (Validator.isEmpty(data.last_name)) {
			errors.last_name = 'Your Last Name is required';
    }
		if (Validator.isEmpty(data.email)) {
			errors.email = 'Your Email is required';
    }
    if (!Validator.isEmail(data.email)) {
			errors.email = 'Email is not valid. Enter a valid email';
    }

    if (Validator.isEmpty(data.phone_number)) {
			errors.phone_number = 'Your Phone Number is required';
    }
      if (!Validator.isLength(data.phone_number, { min: 9, max: 19})) {
        errors.phone_number = 'Your Phone Number must be between 9 to 19 ';
      }
    

	return {
		errors,
		isValid: isEmpty(errors),
	};
};

module.exports = validateRegisteredUser;
