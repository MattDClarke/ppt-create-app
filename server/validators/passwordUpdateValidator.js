const mongoose = require('mongoose');

const User = mongoose.model('User');
const { body } = require('express-validator');
const { validatePassword } = require('../lib/passwordUtils');

exports.passwordUpdateValidationRules = () => [
  body('oldPassword', 'Enter your old password.').notEmpty(),
  body('oldPassword').custom((value, { req }) =>
    User.findOne({ _id: req.user.id }).then((user) => {
      if (user) {
        const isValid = validatePassword(value, user.hash, user.salt);
        // if old pw correct
        if (isValid) {
          return true;
        }
        return Promise.reject('Old password not correct.');
      }
    })
  ),
  body('newPassword', 'Enter your new password').notEmpty(),
  body(
    'newPassword',
    'New password should be at least 8 characters long and contain at least 1 lowercase word, 1 uppercase word, 1 number and 1 symbol.'
  ).isStrongPassword(),
  body('newPassword', 'The maximum number of characters is 50.').isLength({
    max: 50,
  }),
  body('newPassword').custom((value, { req }) => {
    if (value === req.body.oldPassword) {
      throw new Error('Your new password is the same as your old password.');
    }
    // Indicates the success of this synchronous custom validator
    return true;
  }),
  body(
    'newPasswordConfirm',
    'Confirmed new password cannot be blank.'
  ).notEmpty(),
  body('newPasswordConfirm').custom((value, { req }) => {
    if (value !== req.body.newPassword) {
      throw new Error('Oops! Your new passwords do not match.');
    }
    // Indicates the success of this synchronous custom validator
    return true;
  }),
];
