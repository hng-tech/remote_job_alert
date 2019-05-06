const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const RegisteredUsersSchema = new Schema({

    first_name: {
        type: String,
        required: false
    },
    last_name: {
        type: String,
        required: false
    },
    email: {
        type: String,
        required: false
    },
    phone_number: {
        type: String,
        required: false
    },
    prefered_job_role: {
        type: String,
        required: false
    },
    prefered_job_level: {
        type: String,
        required: false
    },
    prefered_job_type: {
        type: String,
        required: false
    },
    prefered_job_location: {
        type: String,
        required: false
    },
    prefered_job_stack: {
        type: String,
        required: false
    },
    created_At: {
        type: Date,
        required: true
    },
   
});



module.exports = mongoose.model('RegisteredUsers', RegisteredUsersSchema);
