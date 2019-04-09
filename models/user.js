var mongoose = require('mongoose');
var Schema = mongoose.Schema;
const userSchema = new Schema({
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
    }
});


module.exports = mongoose.model('User', userSchema);
