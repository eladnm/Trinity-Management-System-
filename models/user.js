var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var UserSchema = new mongoose.Schema({
    email: {
      type: String,
      unique: true,
      required: true,
      trim: true
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    password: {
      type: String,
      required: true
    }
});
// function hashPassword() {
//   bcrypt.genSalt(null, function(err,salt){
//     if (err) {
//       return console.log(err);
//     }
//     console.log(salt);
//   });
// }
//hashPassword('password'); 
// authenticate input against database documents
UserSchema.statics.authenticate = function(email, password, callback) {
  User.findOne({ email: email })
      .exec(function (error, user) {
        if (error) {
          return callback(error);
        } else if ( !user ) {
          var err = new Error('User not found.');
          err.status = 401;
          return callback(err);
        }
        console.log(password, user.password);
        bcrypt.compare(password, user.password , function(error, result) {
          console.log(result==true);
          if (result === true) {
            return callback(null, user);
          } else {
            return callback();
          }
        })
      });
}
// hash password before saving to database
UserSchema.pre('save', function(next) {
  var user = this;
  bcrypt.hash(user.password, 10, function(err, hash) {
    if (err) {
      return next(err);
    }
    user.password = hash;
    next();
  })
});
var User = mongoose.model('User', UserSchema);
module.exports = User;
