const { validationResult } = require('express-validator');

exports.validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  if (errors) {
    const numErrors = errors.array().length;
    // Create Error message
    const errorMsg = `Error${numErrors === 1 ? '' : 's'}: ${errors
      .array()
      .map((err) => err.msg)
      .join(' ')}`;
    res.status(422).json(errorMsg);
  }
};
