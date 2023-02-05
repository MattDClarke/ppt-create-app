const mongoose = require('mongoose');

const User = mongoose.model('User');
const { body } = require('express-validator');

exports.userValidationRules = () => [
  body('name', 'Enter your name.').notEmpty(),
  body('name', 'Name must be at least 3 characters long.').isLength({ min: 3 }),
  body('name', 'The maximum number of characters is 50.').isLength({ max: 50 }),
  body('email', 'Enter your email address.').notEmpty(),
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
        // eslint-disable-next-line
        return Promise.reject('E-mail already in use.');
      }
    })
  ),
  body('password', 'Enter your password.').notEmpty(),
  body(
    'password',
    'Password should be at least 8 characters long and contain at least 1 lowercase word, 1 uppercase word, 1 number and 1 symbol.'
  ).isStrongPassword(),
  body('password', 'The maximum number of characters is 50.').isLength({
    max: 50,
  }),
  body('passwordConfirm', 'Confirmed password cannot be blank.').notEmpty(),
  body('passwordConfirm').custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error('Oops! Your passwords do not match.');
    }
    // Indicates the success of this synchronous custom validator
    return true;
  }),
];
