const mongoose = require("mongoose");
//const mongoosePaginate = require('mongoose-paginate');
const Schema = mongoose.Schema;

const jobSchema = new Schema(
  {
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
    image_link: {
      type: String,
      required: false
    },
    job_description: {
      type: String,
      required: true
    },
    job_pay_min: {
      type: Number,
      min: 0
    },
    job_pay_max: {
      type: Number,
      min: 0
    },
    employer_email: {
      type: String,
      required: false
    },
    slug:{
      type: String,
      required: false
    },
    job_type: {
      type: String,
      required: false
    },
    /*
    job_category: {
      type: String,
      required: false
    },
    */
    location: {
      type: String,
      required: false
    },
    created_date: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Job", jobSchema);
