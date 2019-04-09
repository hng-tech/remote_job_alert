const  mongoose = require('mongoose');
const Schema = mongoose.Schema;

const jobSchema = new Schema({
    header: {
        type: String,
        required: "Advert header is required"
    },
    company: {
        type: String,
        required: 'Company name is required',
        trim: true
    },
    title: {
        type: String,
        required: 'Job title is required',
        trim: true
    },
    url: {
        type: String,
        required: 'Job url is required',
        trim: true
    },
    description: {
        type: String,
        required: 'Job description is required',
        trim: true
    },
    category: {
        type: String,
        required: 'Job category is required',
        trim: true
    },
    level: {
        type: String,
        required: 'career level is required',
        trim: true
    },
    location: {
        type: String,
        required: 'Location is required',
        trim: true
    },
    created: {
      type: Date,
      default: Date.now
    },
})
const Job = mongoose.model('Job', jobSchema);

module.exports = Job;