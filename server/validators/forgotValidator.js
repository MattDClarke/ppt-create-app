const { body } = require('express-validator');

exports.forgotValidationRules = () => [
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
];
