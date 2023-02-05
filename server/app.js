const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const path = require('path');
const cors = require('cors');
const csrf = require('csurf');
const fetch = require('node-fetch');
const cookieParser = require('cookie-parser');

const passport = require('passport');
const { promisify } = require('util');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const routes = require('./routes/index');
const errorHandlers = require('./handlers/errorHandlers');
const clientP = require('./start');

// create Express app
const app = express();

app.use(
  helmet({
    contentSecurityPolicy: {
      useDefaults: true,
      directives: {
        'script-src': ["'self'", "'unsafe-inline'"],
        'img-src': [
          "'self'",
          'data:',
          'https://images.unsplash.com/',
          'https://res.cloudinary.com/dorxifpci/image/upload/',
        ],
        'connect-src': [
          "'self'",
          'https://images.unsplash.com/',
          'https://formspree.io/p/1794143438845771544/f/contact',
        ],
      },
    },
  })
);

// view engine setup - for sending emails
app.set('views', path.join(__dirname, 'views')); // this is the folder where we keep our pug files
app.set('view engine', 'pug'); // we use the engine pug

// Takes the raw requests and turns them into usable properties on req.body
// middleware that checks the url for data BEFORE route hit (routes defined below). Puts all the data in the request so it can be easily accessed
// all data passed in is stored in the request variable
// when a user submits data via form tag - you will get data submitted on request.body
app.use(express.json());

// easily get access to nested data ... location.address ...
// only parses urlencoded bodies and only looks at requests where the Content-Type header matches the type option. Extended: true allows arrays and complex objects to be url encoded
app.use(express.urlencoded({ extended: true }));

// Sessions allow us to store data on visitors from request to request
// This keeps users logged in and allows us to send flash messages
// store data about users -> how long logged in...

// Needed for Heroku - else CSRF error: Form tampered with
if (process.env.NODE_ENV === 'production') {
  app.set('trust proxy', 1);
}

app.use(
  cors({
    origin: `${
      process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : ''
    }`, // location of React app
    credentials: true,
  })
);

app.use(
  session({
    secret: process.env.SECRET,
    key: process.env.KEY,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60 * 24 * 90, // 3 months
    },
    store: MongoStore.create({
      clientPromise: clientP,
    }),
  })
);

// // Passport JS is what we use to handle our logins
// Need to require the entire Passport config module so app.js knows about it
require('./config/passport');
// initialize passport middleware - refreshes middleware everytime route loaded
// checks req.session.passport.user - logged in or out?
app.use(passport.initialize());
app.use(passport.session());

// parse cookies
// we need this because "cookie" is true in csrfProtection
app.use(cookieParser());

app.use(
  csrf({
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? true : 'lax',
    },
  })
);

// make a second value for cSURF -> will get cookie on client side with JS.
app.use(function (req, res, next) {
  res.cookie('XSRF-TOKEN', req.csrfToken(), {
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? true : 'lax',
  });
  next();
});

// error handler for CSRF
app.use(function (err, req, res, next) {
  if (err.code !== 'EBADCSRFTOKEN') return next(err);
  // handle CSRF token errors
  res.status(403).send('Form tampered with');
});

// promisify some callback based APIs
app.use((req, res, next) => {
  req.login = promisify(req.login.bind(req));
  next();
});

// Allow use of Fetch API (used for Unsplash API) in Node
global.fetch = fetch;

app.use(mongoSanitize());

// http - https redirect for Heroku
if (process.env.NODE_ENV === 'production') {
  app.use((req, res, next) => {
    if (req.header('x-forwarded-proto') !== 'https')
      res.redirect(`https://${req.header('host')}${req.url}`);
    else next();
  });
}

//  Handle routes
app.use('/', routes);
// for adding React build folder
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '/client/build')));
  // needed for React router - for any unknown path serve index.html
  app.get('/*', function (req, res) {
    res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
  });
}

// If that above routes didnt work, we 404 them and forward to error handler
app.use(errorHandlers.notFound);

// One of our error handlers will see if these errors are just validation errors
app.use(errorHandlers.showValidationErrors);

// Otherwise this was a really bad error we didn't expect!
if (app.get('env') === 'development') {
  /* Development Error Handler - Prints stack trace */
  app.use(errorHandlers.developmentErrors);
}

// production error handler
app.use(errorHandlers.productionErrors);

// done! we export it so we can start the site in start.js
module.exports = app;
