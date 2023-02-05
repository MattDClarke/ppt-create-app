// define all routes
const express = require('express');
const passport = require('passport');

const router = express.Router();
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');
const rateLimitController = require('../controllers/rateLimitController');
const searchController = require('../controllers/searchController');
const wordListController = require('../controllers/wordListController');
const listController = require('../controllers/listController');
const translateController = require('../controllers/translateController');
const validator = require('../validators/validator');
const userValidator = require('../validators/userValidator');
const loginValidator = require('../validators/loginValidator');
const nameUpdateValidator = require('../validators/nameUpdateValidator');
const emailUpdateValidator = require('../validators/emailUpdateValidator');
const passwordUpdateValidator = require('../validators/passwordUpdateValidator');
const forgotValidator = require('../validators/forgotValidator');
const passwordForgotUpdateValidator = require('../validators/passwordForgotUpdateValidator');
const wordListValidator = require('../validators/wordListValidator');
const listValidator = require('../validators/listValidator');
const { catchErrors } = require('../handlers/errorHandlers');

const DEV_ENV = process.env.NODE_ENV === 'development';
const { BACKEND_URL, FRONTEND_DEV_URL } = process.env;

router.post(
  '/signup',
  catchErrors(rateLimitController.rateLimitByIP),
  userValidator.userValidationRules(),
  validator.validate,
  catchErrors(userController.signup),
  catchErrors(authController.sendEmailConfirm)
);

// __________________________________ Email confirm  __________________________________

router.get(
  '/api/emailconfirm/:token',
  catchErrors(authController.emailConfirmCheck)
);

router.post(
  '/login',
  loginValidator.loginValidationRules(),
  validator.validate,
  catchErrors(rateLimitController.rateLimitLoginRoute)
);
router.post('/logout', authController.logout);

router.get('/getuser', authController.getUser);

// __________________________________ Account info change  __________________________________

router.put(
  '/account/name',
  authController.isLoggedIn,
  authController.isLocalAuth,
  nameUpdateValidator.nameUpdateValidationRules(),
  validator.validate,
  catchErrors(authController.updateName)
);

router.put(
  '/account/email',
  catchErrors(rateLimitController.rateLimitByIP),
  authController.isLoggedIn,
  authController.isLocalAuth,
  emailUpdateValidator.emailUpdateValidationRules(),
  validator.validate,
  catchErrors(authController.updateEmail)
);

router.put(
  '/account/password',
  catchErrors(rateLimitController.rateLimitByIP),
  authController.isLoggedIn,
  authController.isLocalAuth,
  passwordUpdateValidator.passwordUpdateValidationRules(),
  validator.validate,
  catchErrors(authController.updatePassword)
);

router.delete(
  '/account/delete',
  authController.isLoggedIn,
  catchErrors(userController.deleteAccount)
);

// __________________________________ pw reset  __________________________________

router.post(
  '/account/forgot',
  catchErrors(rateLimitController.rateLimitByIP),
  forgotValidator.forgotValidationRules(),
  validator.validate,
  catchErrors(authController.forgot)
);

router.get(
  '/api/account/reset/:token',
  catchErrors(rateLimitController.rateLimitByIP),
  catchErrors(authController.reset)
);
router.post(
  '/account/reset/:token',
  catchErrors(rateLimitController.rateLimitByIP),
  passwordForgotUpdateValidator.passwordForgotUpdateValidationRules(),
  validator.validate,
  catchErrors(authController.updateForgotPassword)
);

// __________________________________ Admin  __________________________________

router.get(
  '/getusers/page/:page',
  authController.isLoggedIn,
  authController.isAdmin,
  catchErrors(userController.getUsers)
);

router.delete(
  '/deleteusers',
  authController.isLoggedIn,
  authController.isAdmin,
  catchErrors(userController.deleteUsers)
);

// ________________________________ Admin book and list add  ________________________________
router.post(
  '/add-book',
  authController.isLoggedIn,
  authController.isAdmin,
  listController.upload,
  listValidator.addBookValidationRules(),
  validator.validate,
  catchErrors(listController.cloudinaryUpload),
  catchErrors(listController.addBook)
);

router.post(
  '/add-list-korea-textbook',
  authController.isLoggedIn,
  authController.isAdmin,
  listValidator.addListKoreaTextBookValidationRules(),
  validator.validate,
  catchErrors(listController.addListKoreaTextBook)
);

router.post(
  '/add-list-other',
  authController.isLoggedIn,
  authController.isAdmin,
  listValidator.addListOtherValidationRules(),
  validator.validate,
  catchErrors(listController.addListOther)
);

// ___________________________________ Admin added lists  ___________________________________

router.get(
  '/getbooks/:levelAndGrade',
  authController.isLoggedIn,
  catchErrors(listController.getBooks)
);

router.get(
  '/getlists/:pageKey',
  authController.isLoggedIn,
  catchErrors(listController.getLists)
);

// ____________________________________ user word lists  ____________________________________

router.get(
  '/user/wordlists/get',
  authController.isLoggedIn,
  catchErrors(wordListController.getWordLists)
);
router.post(
  '/user/wordlists/change',
  authController.isLoggedIn,
  wordListValidator.addOrEditValidationRules(),
  validator.validate,
  catchErrors(wordListController.wordListAddorEdit)
);

router.delete(
  '/user/wordlists/delete',
  authController.isLoggedIn,
  wordListValidator.deleteValidationRules(),
  validator.validate,
  catchErrors(wordListController.wordListDelete)
);

router.delete(
  '/user/wordlists/delete-all',
  authController.isLoggedIn,
  catchErrors(wordListController.wordListsDeleteAll)
);

router.put(
  '/user/wordlists/reorder',
  authController.isLoggedIn,
  wordListValidator.reorderValidationRules(),
  validator.validate,
  catchErrors(wordListController.wordListsReorder)
);

// __________________________________ Google OAuth 2.0  __________________________________

router.get(
  '/auth/google',
  // scope - info from user -> profile is minimal
  passport.authenticate('google', {
    scope: ['profile'],
    prompt: 'select_account',
  })
);

router.get(
  '/auth/google/callback',
  passport.authenticate('google', {
    failureRedirect: `${!DEV_ENV ? BACKEND_URL : FRONTEND_DEV_URL}/login`,
    session: true,
  }),
  function (req, res) {
    // Successful authentication, redirect to create page.
    res.redirect(`${!DEV_ENV ? BACKEND_URL : FRONTEND_DEV_URL}/create`);
  }
);

// _______________________________________ APIS  ________________________________________

router.get(
  '/api/search/photos',
  authController.isLoggedIn,
  catchErrors(rateLimitController.rateLimitUnsplashAPI),
  catchErrors(searchController.imageSearch)
);
router.get(
  '/api/photos/track-download',
  authController.isLoggedIn,
  catchErrors(rateLimitController.rateLimitUnsplashAPI),
  catchErrors(searchController.trackDownload)
);

router.get(
  '/api/translate',
  authController.isLoggedIn,
  catchErrors(rateLimitController.rateLimitGoogleTranslate),
  catchErrors(translateController.googleTranslate)
);

module.exports = router;
