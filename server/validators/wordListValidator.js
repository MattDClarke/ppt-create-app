const mongoose = require('mongoose');
const { body } = require('express-validator');

const WordList = mongoose.model('WordList');

exports.addOrEditValidationRules = () => [
  body('title', 'Enter a title.').notEmpty(),
  body('title', 'The maximum number of title characters is 50.').isLength({
    max: 50,
  }),
  body('order', 'Word list/s order out of accepted range (1-21).')
    .notEmpty()
    .isInt({
      min: 1,
      max: 21,
    }),
  body('words').custom((value, { req }) =>
    WordList.countDocuments({ user: req.user.id }).then((count) => {
      if (count > 20) {
        // will only be issue if someone purposefully thwarts frontend check
        // 21 can be added... but then can't edit 21st
        return Promise.reject('Max of 20 word lists.');
      }
    })
  ),
  body('words').custom((value) => {
    const len = value.length;
    if (len < 3 || len > 30) {
      throw new Error('Word list should have 3 - 30 words.');
    }
    return true;
  }),
  body('words.*.word')
    .isLength({ min: 1, max: 50 })
    .withMessage('Each word must be between 1 and 50 characters long.'),
];

exports.deleteValidationRules = () => [
  body('title', 'Each word list must have a title.').notEmpty(),
  body('title', 'The maximum number of title characters is 50.').isLength({
    max: 50,
  }),
  body('order', 'Word list/s order out of accepted range (1-20).')
    .notEmpty()
    .isInt({
      min: 1,
      max: 21,
    }),
  body('numberOfWordLists', 'Invalid number of word lists.').notEmpty().isInt({
    min: 1,
    max: 20,
  }),
];

exports.reorderValidationRules = () => [
  body('wordListsTitles.*.title')
    .isLength({ min: 1, max: 50 })
    .withMessage('Each title must be between 1 and 50 characters long.'),
  body('wordListsTitles.*.order')
    .isInt({
      min: 1,
      max: 20,
    })
    .withMessage('Word list/s order out of accepted range (1-20)'),
];
