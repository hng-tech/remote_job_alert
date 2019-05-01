const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const UserSchema = new Schema({
    userid: {
        type: String
    },
    token: {
        type: String
    },
    name: {
        type: String
    },
    email: {
        type: String,
        required: true
    },
    updated_at: { type: Date, default: Date.now },
});

UserSchema.statics.findOrCreate = require("find-or-create");

module.exports = mongoose.model('User', UserSchema);
