import * as yup from 'yup';
import {
  isStrongPassword,
  isValidLevelAndGrade,
  isValidList,
} from './validatorUtils';

export const emailUpdateValidationSchema = yup.object({
  email: yup
    .string('Enter your new email address')
    .trim('Remove leading and trailing whitespace')
    .strict()
    .email('Enter a valid email')
    .max(50, 'The maximum number of characters is 50')
    .required('Email is required'),
});

export const forgotValidationSchema = yup.object({
  email: yup
    .string('Enter your email address')
    .trim('Remove leading and trailing whitespace')
    .strict()
    .email('Enter a valid email')
    .max(50, 'The maximum number of characters is 50')
    .required('Email is required'),
});

export const loginValidationSchema = yup.object({
  email: yup
    .string('Enter your email')
    .strict()
    .email('Enter a valid email')
    .max(50, 'The maximum number of characters is 50')
    .required('Email is required'),
  password: yup
    .string('Enter your password')
    .strict()
    .test(
      'isStrongPassword',
      'Password should be at least 8 characters long and contain at least 1 lowercase word, 1 uppercase word, 1 number and 1 symbol.',
      function (value) {
        return isStrongPassword(value);
      }
    )
    .max(50, 'The maximum number of characters is 50')
    .required('Password is required'),
});

export const nameUpdateValidationSchema = yup.object({
  name: yup
    .string('Enter your name')
    .strict()
    .min(3, 'Name must be at least 3 characters long')
    .max(50, 'The maximum number of characters is 50')
    .required('Name is required'),
});

export const passwordForgotValidationSchema = yup.object({
  password: yup
    .string('Enter your password')
    .trim('Remove leading and trailing whitespace')
    .strict()
    .test(
      'isStrongPassword',
      'Password should be at least 8 characters long and contain at least 1 lowercase word, 1 uppercase word, 1 number and 1 symbol.',
      function (value) {
        return isStrongPassword(value);
      }
    )
    .max(50, 'The maximum number of characters is 50')
    .required('Password is required'),
  passwordConfirm: yup
    .string('Enter your password again')
    .trim('Remove leading and trailing whitespace')
    .strict()
    .test(
      'passwordsMatch',
      'Oops! Your passwords do not match.',
      function (value) {
        return this.parent.password === value;
      }
    )
    .required('Password confirm is required'),
});

export const passwordUpdateValidationSchema = yup.object({
  oldPassword: yup
    .string('Enter your oldpassword')
    .trim('Remove leading and trailing whitespace')
    .strict()
    .test(
      'isStrongPassword',
      'Password should be at least 8 characters long and contain at least 1 lowercase word, 1 uppercase word, 1 number and 1 symbol.',
      function (value) {
        return isStrongPassword(value);
      }
    )
    .max(50, 'The maximum number of characters is 50')
    .required('Old password is required'),
  newPassword: yup
    .string('Enter your new password')
    .trim('Remove leading and trailing whitespace')
    .strict()
    .test(
      'isStrongPassword',
      'New password should be at least 8 characters long and contain at least 1 lowercase word, 1 uppercase word, 1 number and 1 symbol.',
      function (value) {
        return isStrongPassword(value);
      }
    )
    .max(50, 'The maximum number of characters is 50')
    .test(
      'newPassword',
      'Your new password is the same as your old password',
      function (value) {
        return this.parent.oldPassword !== value;
      }
    )
    .required('New password is required'),
  newPasswordConfirm: yup
    .string('Enter your new password again')
    .trim('Remove leading and trailing whitespace')
    .strict()
    .test(
      'passwordsMatch',
      'Oops! Your new passwords do not match.',
      function (value) {
        return this.parent.newPassword === value;
      }
    )
    .required('New password confirm is required'),
});

export const userValidationSchema = yup.object({
  name: yup
    .string('Enter your name')
    .strict()
    .min(3, 'Name must be at least 3 characters long')
    .max(50, 'The maximum number of characters is 50')
    .required('Name is required'),
  email: yup
    .string('Enter your email address')
    .strict()
    .email('Enter a valid email')
    .max(50, 'The maximum number of characters is 50')
    .required('Email is required'),
  password: yup
    .string('Enter your password')
    .trim('Remove leading and trailing whitespace')
    .strict()
    .test(
      'isStrongPassword',
      'Password should be at least 8 characters long and contain at least 1 lowercase word, 1 uppercase word, 1 number and 1 symbol.',
      function (value) {
        return isStrongPassword(value);
      }
    )
    .max(50, 'The maximum number of characters is 50')
    .required('Password is required'),
  passwordConfirm: yup
    .string('Enter your password again')
    .trim('Remove leading and trailing whitespace')
    .strict()
    .test(
      'passwordsMatch',
      'Oops! Your passwords do not match.',
      function (value) {
        return this.parent.password === value;
      }
    )
    .required('Password confirm is required'),
});

// Lists forms
export const addBookValidationSchema = yup.object({
  levelAndGrade: yup
    .string('Select a level and grade')
    .strict()
    .required('Select a level and grade')
    .test('isValidLevelAndGrade', 'Invalid selection', function (value) {
      return isValidLevelAndGrade(value);
    }),
  authorSurname: yup
    .string('Enter first author surname')
    .trim('Remove leading and trailing whitespace')
    .strict()
    .min(2, 'Surname must be at least 2 characters long')
    .max(50, 'The maximum number of characters is 50')
    .required('Author is required')
    .test('isOneString', 'Only add 1 surname', function (value) {
      return `a${value}`.split('').includes(' ') === false;
    }),
  publisher: yup
    .string('Enter publisher')
    .trim('Remove leading and trailing whitespace')
    .strict()
    .min(2, 'Name must be at least 2 characters long')
    .max(50, 'The maximum number of characters is 50')
    .required('Publisher is required')
    .test('isOneString', 'Use 1 word', function (value) {
      return `a${value}`.split('').includes(' ') === false;
    }),
  year: yup
    .number('Enter number')
    .min(2014, 'The minimum year is 2014')
    .max(2030, 'The maximum year is 2030'),

  // TODO: could be better
  coverImg: yup
    .object()
    .nullable()
    .test('isNotNull', 'Upload a cover image', function (value) {
      return value == null;
    }),
});

// Lists forms
export const addListKoreaTextBookValidationSchema = yup.object({
  levelAndGrade: yup
    .string('Select a level and grade')
    .strict()
    .required('Select a level and grade')
    .test('isValidLevelAndGrade', 'Invalid selection', function (value) {
      return isValidLevelAndGrade(value);
    }),
  authorSurname: yup
    .string('Enter first author surname')
    .trim('Remove leading and trailing whitespace')
    .strict()
    .min(2, 'Surname must be at least 2 characters long')
    .max(50, 'The maximum number of characters is 50')
    .required('Author is required')
    .test('isOneString', 'Only add 1 surname', function (value) {
      return `a${value}`.split('').includes(' ') === false;
    }),
  publisher: yup
    .string('Enter publisher')
    .trim('Remove leading and trailing whitespace')
    .strict()
    .min(3, 'Name must be at least 3 characters long')
    .max(50, 'The maximum number of characters is 50')
    .required('Publisher is required')
    .test('isOneString', 'Use 1 word', function (value) {
      return `a${value}`.split('').includes(' ') === false;
    }),
  year: yup
    .number('Enter number')
    .min(2014, 'The minimum year is 2014')
    .max(2030, 'The maximum year is 2030'),

  title: yup
    .string('Enter title')
    .strict()
    .min(3, 'Title must be at least 3 characters long')
    .max(50, 'The maximum number of characters is 50')
    .required('Title is required'),
});

export const addListOtherValidationSchema = yup.object({
  list: yup
    .string('Select a list')
    .strict()
    .required('Select a list')
    .test('isValidList', 'Invalid selection', function (value) {
      return isValidList(value);
    }),
  title: yup
    .string('Enter title')
    .strict()
    .min(3, 'Title must be at least 3 characters long')
    .max(50, 'The maximum number of characters is 50')
    .required('Title is required'),
});

// contact form
export const contactValidationSchema = yup.object({
  name: yup
    .string('Enter your name')
    .strict()
    .min(3, 'Name must be at least 3 characters long')
    .max(50, 'The maximum number of characters is 50')
    .required('Name is required'),
  email: yup
    .string('Enter your email address')
    .strict()
    .email('Enter a valid email')
    .max(50, 'The maximum number of characters is 50')
    .required('Email is required'),
  message: yup
    .string('Enter your message')
    .strict()
    .min(10, 'Message must be at least 10 characters long')
    .max(1000, 'The maximum number of characters is 1000')
    .required('Message is required'),
});
