const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const preferenceSchema = new Schema({
    _id: String,
    stacks: [String],
    job_types: [String],
    mail_frequency: String
});

module.exports = mongoose.model('Preferences', preferenceSchema);