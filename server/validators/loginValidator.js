const { body } = require('express-validator');

exports.loginValidationRules = () => [
  body('email', 'Enter your email.').notEmpty(),
  body('email', 'Enter a valid email.').isEmail().normalizeEmail({
    remove_dots: false,
    remove_extension: false,
    gmail_remove_dots: false,
    gmail_remove_subaddress: false,
  }),
  body('email', 'The maximum number of characters is 50.').isLength({
    max: 50,
  }),
  body('password', 'Enter your password.').notEmpty(),
  body(
    'password',
    'Password should be at least 8 characters long and contain at least 1 lowercase word, 1 uppercase word, 1 number and 1 symbol.'
  ).isStrongPassword(),
  body('password', 'The maximum number of characters is 50.').isLength({
    max: 50,
  }),
];
