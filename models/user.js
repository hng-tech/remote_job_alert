const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    firstName: {
        type: String,
        required: 'FirstNaame is required',
        trim: true
    },
    lastName: {
        type: String,
        required: 'LastName is required',
        trim: true
    },
    email: {
        type: String,
        trim: true,
        match: [/.+\@.+\..+/, 'Please fill a valid email address'],
        required: 'Email is required'
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    plan: {
        type: String,
        default: 'regular'
    }
})
const User = mongoose.model('User', userSchema);

module.exports = User;