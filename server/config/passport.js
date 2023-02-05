const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const User = mongoose.model('User');
const { validatePassword } = require('../lib/passwordUtils');

const customFields = {
  usernameField: 'email',
  passwordField: 'password',
};

// done is a function that u will pass the results of your auth to
// passport gets email and password from POST request and passes them to the callback as arguments
const verifyCallback = (email, password, done) => {
  User.findOne({ email })
    .then((user) => {
      if (!user) {
        // no error and no user
        // Passport will return 401 HTTP status
        // pass info message to indicate reason for failure - http://www.passportjs.org/docs/configure/
        return done(null, false, { message: 'IncorrectUsernameError' });
      }
      // check pw
      const isValid = validatePassword(password, user.hash, user.salt);

      if (isValid) {
        // need to pass in whole user. In rateLimitController -> passport.authenticate('local'...)
        // need user.isEmailConfirmed
        return done(null, user);
      }
      return done(null, false, { message: 'IncorrectPasswordError' });
    })
    .catch((err) => {
      done(err);
    });
};

const strategy = new LocalStrategy(customFields, verifyCallback);

passport.use(strategy);

// has to do with express-session
// put userId into session. In session object it adds a property: session: {user: 'asefdfdlk32234sdfd'}
// done when passport.authenticate is successful. Passport gets user id from db and inserts it into session
// only user id saved to session store
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// grab user from the session (check if user is authorized).
// Populates req.user
// on every req, deserialize cookie (check for session)
passport.deserializeUser((req, userId, done) => {
  // search db for user using user id in session object.
  User.findById(userId)
    .then((user) => {
      // prevents password being stored
      //  need to adjust userInfo for Google and FB auth... less info
      if (user.auth === 'local') {
        // will be seen and used on frontend
        const userInformation = {
          id: user._id,
          auth: 'local',
          name: user.name,
          email: user.email,
          isAdmin: user.isAdmin,
          isEmailConfirmed: user.isEmailConfirmed,
        };
        done(null, userInformation);
      }
      if (user.auth === 'Google') {
        const userInformation = {
          id: user._id,
          auth: 'provider',
          name: user.name,
          isAdmin: user.isAdmin,
        };
        done(null, userInformation);
      }
    })
    .catch((err) => {
      // users may have been deleted by admin. Remove session from store and logout
      if (err.message === "Cannot read property '_id' of null") {
        // logout of session - incase user deleted on server but session still exists
        req.logout();
      }
      done(err);
    });
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_OAUTH20_CLIENT_ID,
      clientSecret: process.env.GOOGLE_OAUTH20_CLIENT_SECRET,
      callbackURL: '/auth/google/callback',
    },
    // gets called on successful auth
    // add user to DB
    function (accessToken, refreshToken, profile, cb) {
      User.findOne({ googleId: profile.id }, async (err, doc) => {
        if (err) {
          return cb(err, null);
        }
        if (!doc) {
          // create one
          const newUser = new User({
            auth: 'Google',
            googleId: profile.id,
            name: profile.displayName,
            isAdmin: false,
          });
          await newUser.save();
          return cb(null, newUser);
        }
        return cb(null, doc);
      });
    }
  )
);
