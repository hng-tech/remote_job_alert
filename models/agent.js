const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');
const saltRounds = 10;

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
        unique: true,
        trim: true,
        required: true
    },
    number: {
        type: Number,
        required: true
    },
    password: {
        type: String,
        required: true,
    }
});
//No password_confirm, should verify locally that the two passwords match

    //To authenticate input against database
agentSchema.statics.authenticate = function (email, password, callback) {
    agent.findOne({ email: email })
    .exec(function (err, agent){
        if (err) {
            return callback(err)
        }else if (!agent){
            var err = new Error('Agent Not Found.');
            err.status = 401;
            return callback(err);
        }
        bcrypt.compare(password, agent.password, function(err, result){
            if (result === true) {
                return callback(null, agent);
            } else {
                return callback();
            }
        })
    });
}

//hashing a password before saving it to the database
agentSchema.pre('save', function (next){
    var agent = this;
    bcrypt.hash(agent.password, 10, function (err, hash){
        if (err) {
            return next(err);
        }
        agent.password = hash;
        next();
    })
});

module.exports = mongoose.model('Agent', agentSchema);