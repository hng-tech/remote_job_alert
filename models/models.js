const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const jobSchema = new Schema({
    advert_header: {
        type: String,
        required: true
    },
    company_name: {
        type: String,
        required: true
    },
    job_title: {
        type: String,
        required: true
    },
    job_link: {
        type: String,
        required: true
    },
    job_description: {
        type: String,
        required: true
    },
    job_category: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    date_added: {
        type: Date,
        default: Date.now
    }
});

const Job = mongoose.models("Job", jobSchema);

const UserSchema = new Schema({
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    }
});

const User = mongoose.models("User", UserSchema);

module.exports = {
    Job,
    User
}