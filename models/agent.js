var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const agentSchema = new Schema({
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
    // phone_number: {
    //     type: Number,
    //     required: true
    // },
    job_role: {
        type: String,
        required: true
    }
});


module.exports = mongoose.model('Agent', agentSchema);