const mongoose = require('mongoose');
const Schema = mongoose.Schema;

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
    job_role: {
        type: String,
        required: true
    }
});


module.exports = mongoose.model('Agent', agentSchema);