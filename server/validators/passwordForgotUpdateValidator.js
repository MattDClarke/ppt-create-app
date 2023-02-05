const { body } = require('express-validator');

exports.passwordForgotUpdateValidationRules = () => [
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
