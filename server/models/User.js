const mongoose = require('mongoose');

const { Schema } = mongoose;
mongoose.Promise = global.Promise;
const mongodbErrorHandler = require('mongoose-mongodb-errors');

const userSchema = new Schema({
  // local or Google
  auth: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    // unique: true,
    lowercase: true,
    trim: true,
    required: false,
    // allows more than google user to be added. Email field unique... ignore null values
    // (Google auth) ... else 1st account email = null... 2nd null... not unique -> not allowed
    index: {
      unique: true,
      partialFilterExpression: { email: { $type: 'string' } },
    },
    // null allowed multiple times because null filtered out
    default: null,
  },
  googleId: {
    required: false,
    type: String,
  },
  name: {
    type: String,
    required: 'Please supply a name',
    trim: true,
  },
  hash: String,
  salt: String,
  isAdmin: {
    type: Boolean,
    defaultValue: false,
  },
  isEmailConfirmed: {
    type: Boolean,
    defaultValue: false,
  },
  emailConfirmToken: String,
  emailConfirmExpires: Date,
  resetPasswordToken: String,
  resetPasswordExpires: Date,
});

userSchema.plugin(mongodbErrorHandler);

module.exports = mongoose.model('User', userSchema);
