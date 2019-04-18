const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const applicantSchema = new Schema({
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    number: {
        type: Number,
        required: true
    },
    experience: {
        type: String,
        required: true
    },
    tech_stack: {
        type: String,
        required: true
    },
    linkedin_profile: {
        type: String,
        required: true
    },
    github_profile: {
        type: String,
        required: true
    },
    website: {
        type: String,
        required: true
    }
});


module.exports = mongoose.model('Applicant', applicantSchema);