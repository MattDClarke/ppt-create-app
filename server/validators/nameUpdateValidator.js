const { body } = require('express-validator');

exports.nameUpdateValidationRules = () => [
  body('name', 'Enter your name.').notEmpty(),
  body('name', 'Name must be at least 3 characters long.').isLength({
    min: 3,
  }),
  body('name', 'The maximum number of characters is 50.').isLength({ max: 50 }),
];
