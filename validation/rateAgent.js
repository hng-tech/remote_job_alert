/* eslint-disable no-param-reassign */
var Validator = require('validator');
var isEmpty = require('./is-empty');

const validateRateAgent = data => {
	const errors = {};
	data.rate = !isEmpty(data.rate) ? data.rate : '';

	if (Validator.isEmpty(data.rate)) {
		errors.rate = 'Rating an agent is required';
    }
    
    if (!Validator.isLength(data.rate, { min: 1, max: 5})) {
        errors.rate = 'Rating must be between 1 to 5 with 5 being the best and 1 the worst';
      }

	return {
		errors,
		isValid: isEmpty(errors),
	};
};

module.exports = validateRateAgent;
