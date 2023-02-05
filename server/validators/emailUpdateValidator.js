const mongoose = require('mongoose');

const User = mongoose.model('User');
const { body } = require('express-validator');

exports.emailUpdateValidationRules = () => [
  body('email', 'Enter your new email address.').notEmpty(),
  body('email', 'Enter a valid email.').isEmail().normalizeEmail({
    remove_dots: false,
    remove_extension: false,
    gmail_remove_dots: false,
    gmail_remove_subaddress: false,
  }),
  body('email', 'The maximum number of characters is 50.').isLength({
    max: 50,
  }),
  body('email').custom((value) =>
    User.findOne({ email: value }).then((user) => {
      if (user) {
        return Promise.reject('E-mail already in use.');
      }
    })
  ),
];
