const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const preferenceSchema = new Schema({
    user_id: {
        type: Schema.Types.ObjectId, 
        ref: 'User'
    },
    job_roles: { //e.g Frontend, Design, Backend, Fullstack
        type: String,
    },
    job_levels: { // e.g Entry level, Senior, Intermediate, Junior
        type: String,
    },
    job_types: { //e.g Full-time, part-time, remote
        type: String,
    },
    locations: {
        type: String,
    },
    stack: { 
        type: String,
    },
    min_pay: {
        type: Number,
        min: 0
    },
    max_pay: {
        type: Number,
        min: 0
    },
    frequency: { //Daily, Weekly, Monthly
        type: String,
        enum: ['Daily', 'Weekly', 'Monthly']
    }
});


module.exports = mongoose.model('JobPreference', preferenceSchema);
