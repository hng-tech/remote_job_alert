const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const socialSchema = new Schema({
    account: {
        
    _id: {
        type: String
    },
    token: {
        type: String
    },
    name: {
        type: String
    },
    email: {
        type: String
    },
    type: {
        type: String
    }

}
    
});

module.exports = mongoose.model('Social', socialSchema);