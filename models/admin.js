const mongoose = require('mongoose');
const AdminSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
  }
});


AdminSchema.statics.authenticate = function (username, password, callback) {
  Admin.findOne({ username: username })
    .exec(function (err, admin) {
      if (err) {
        return callback(err)
      } else if (!admin) {
        var err = new Error('User not found.');
        err.status = 401;
        return callback(err);
      } else {
        return callback(null, admin);
      }
      
    });
}



var Admin = mongoose.model('Admin', AdminSchema);
module.exports = Admin;