const mongoose = require('mongoose');
const { body } = require('express-validator');

const Book = mongoose.model('Book');
const List = mongoose.model('List');

const { levelAndGradeOptions, listItems } = require('./allowedValues');

exports.addBookValidationRules = () => [
  body('levelAndGrade').custom((value, { req }) => {
    const { year, publisher, authorSurname } = req.body;
    const bookKey =
      `${value}_${year}_${publisher}_${authorSurname}`.toLowerCase();
    return new Promise((resolve, reject) => {
      Book.findOne({ bookKey }).then((book) => {
        if (book) {
          reject('Book already added.');
        }
        resolve();
      });
    });
  }),
  body('levelAndGrade', 'Select a level and grade.').notEmpty(),
  body('levelAndGrade').custom((value) => {
    if (levelAndGradeOptions.map((option) => option.value).includes(value)) {
      return true;
    }
    throw new Error('Invalid level and grade.');
  }),
  body('authorSurname', 'Enter first author surname.').notEmpty(),
  body('authorSurname', 'Surname must be at least 2 characters long.').isLength(
    {
      min: 2,
    }
  ),
  body('authorSurname', 'The maximum number of characters is 50.').isLength({
    max: 50,
  }),
  body('authorSurname').custom((value) => {
    if (`a${value}`.split('').includes(' ') === false) {
      return true;
    }
    throw new Error('Only add 1 surname');
  }),
  body('publisher', 'Enter publisher.').notEmpty(),
  body('publisher', 'Surname must be at least 2 characters long.').isLength({
    min: 2,
  }),
  body('publisher', 'The maximum number of characters is 50.').isLength({
    max: 50,
  }),
  body('publisher').custom((value) => {
    if (`a${value}`.split('').includes(' ') === false) {
      return true;
    }
    throw new Error('Only add 1 word for publisher.');
  }),
  body('year', 'The minimum year is 2014. The maximum year is 2030.')
    .notEmpty()
    .isInt({
      min: 2014,
      max: 2030,
    }),
];

exports.addListKoreaTextBookValidationRules = () => [
  // prevent adding list if book not added
  body('levelAndGrade').custom((value, { req }) => {
    const { year, publisher, authorSurname } = req.body;
    const pageKey =
      `${value}_${year}_${publisher}_${authorSurname}`.toLowerCase();
    return new Promise((resolve, reject) => {
      Book.findOne({ bookKey: pageKey }).then((book) => {
        if (!book) {
          reject('Book not found. Add the book first.');
        }
        resolve();
      });
    });
  }),
  body('levelAndGrade').custom((value, { req }) => {
    const { year, publisher, authorSurname, title } = req.body;
    const pageKey =
      `${value}_${year}_${publisher}_${authorSurname}`.toLowerCase();
    return new Promise((resolve, reject) => {
      List.findOne({ pageKey, title }).then((book) => {
        if (book) {
          reject('List already added for book.');
        }
        resolve();
      });
    });
  }),
  body('levelAndGrade', 'Select a level and grade.').notEmpty(),
  body('levelAndGrade').custom((value) => {
    if (levelAndGradeOptions.map((option) => option.value).includes(value)) {
      return true;
    }
    throw new Error('Invalid level and grade.');
  }),
  body('authorSurname', 'Enter first author surname.').notEmpty(),
  body('authorSurname', 'Surname must be at least 2 characters long.').isLength(
    {
      min: 2,
    }
  ),
  body('authorSurname', 'The maximum number of characters is 50.').isLength({
    max: 50,
  }),
  body('authorSurname').custom((value) => {
    if (`a${value}`.split('').includes(' ') === false) {
      return true;
    }
    throw new Error('Only add 1 surname');
  }),
  body('publisher', 'Enter publisher.').notEmpty(),
  body('publisher', 'Surname must be at least 3 characters long.').isLength({
    min: 3,
  }),
  body('publisher', 'The maximum number of characters is 50.').isLength({
    max: 50,
  }),
  body('publisher').custom((value) => {
    if (`a${value}`.split('').includes(' ') === false) {
      return true;
    }
    throw new Error('Only add 1 word for publisher.');
  }),
  body('year', 'The minimum year is 2014. The maximum year is 2030.')
    .notEmpty()
    .isInt({
      min: 2014,
      max: 2030,
    }),
  body('title', 'Enter title.').notEmpty(),
  body('title', 'Title must be at least 3 characters long.').isLength({
    min: 3,
  }),
  body('title', 'The maximum number of characters is 50.').isLength({
    max: 50,
  }),
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

exports.addListOtherValidationRules = () => [
  body('pageKey', 'Select a list.').notEmpty(),
  body('pageKey').custom((value, { req }) => {
    const { title } = req.body;
    return new Promise((resolve, reject) => {
      List.findOne({ pageKey: value, title }).then((list) => {
        if (list) {
          reject(`List already added to ${value} list.`);
        }
        resolve();
      });
    });
  }),
  body('pageKey').custom((value) => {
    if (listItems.map((option) => option.value).includes(value)) {
      return true;
    }
    throw new Error('Invalid Other list.');
  }),
  body('title', 'Enter title.').notEmpty(),
  body('title', 'Title must be at least 3 characters long.').isLength({
    min: 3,
  }),
  body('title', 'The maximum number of characters is 50.').isLength({
    max: 50,
  }),
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
