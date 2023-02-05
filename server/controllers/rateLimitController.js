const redis = require('redis');
const { RateLimiterRedis } = require('rate-limiter-flexible');
const passport = require('passport');

const redisClient = redis.createClient(process.env.REDIS_URL, {
  enable_offline_queue: false,
});

redisClient.on('error', () => new Error());

// ____________________________________ For login route ____________________________________

const maxWrongAttemptsByIPperDay = 20;
const maxConsecutiveFailsByEmailAndIP = 10;

const limiterSlowBruteByIP = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: 'login_fail_ip_per_day',
  points: maxWrongAttemptsByIPperDay,
  duration: 60 * 60 * 24, // Store key-value for 1 day
  blockDuration: 60 * 60 * 24, // Block for 1 day, if 50 wrong attempts per day
});

const limiterConsecutiveFailsByEmailAndIP = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: 'login_fail_consecutive_email_and_ip',
  points: maxConsecutiveFailsByEmailAndIP,
  duration: 60 * 60, // Store key-value for 1 hour
  blockDuration: 60 * 60, // Block for 1 hour
});

const getEmailIPkey = (email, ip) => `${email}_${ip}`;

// ________________________________ For Unsplash API routes _______________________________

const maxAttemptsByUserPerDay = 50;

const limiterByUser = new RateLimiterRedis({
  storeClient: redisClient,
  points: maxAttemptsByUserPerDay,
  duration: 60 * 60 * 24, // Store key-value for 1 day
  blockDuration: 60 * 60 * 24, // Block for 1 day, if 3 wrong attempts per day
});

// ______________________________ For Google Translate API route ______________________________
// google translate limits by number of characters

const maxCharsByUserPerDay = 500;

const limiterGoogleTranslateCharsByUser = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: 'translate_chars_user_per_day',
  points: maxCharsByUserPerDay,
  duration: 60 * 60 * 24, // Store key-value for 1 day
  blockDuration: 60 * 60 * 24, // Block for 1 day, if 3 wrong attempts per day
});

// ________________________ For routes limited by IP only (not Login) _____________________

const maxAttemptsByIPperDay = 10;

const limiterByIP = new RateLimiterRedis({
  storeClient: redisClient,
  points: maxAttemptsByIPperDay,
  duration: 60 * 60 * 24, // Store key-value for 1 day
  blockDuration: 60 * 60 * 24, // Block for 1 day, if 3 wrong attempts per day
});

// ______________________________ Login rate limiter middleware ___________________________

exports.rateLimitLoginRoute = async (req, res, next) => {
  const ipAddr = req.ip;
  const emailIPkey = getEmailIPkey(req.body.email, ipAddr);

  // get keys for attempted login
  const [resEmailAndIP, resSlowByIP] = await Promise.all([
    limiterConsecutiveFailsByEmailAndIP.get(emailIPkey),
    limiterSlowBruteByIP.get(ipAddr),
  ]);

  let retrySecs = 0;
  // Check if IP or Email + IP is already blocked
  if (
    resSlowByIP !== null &&
    resSlowByIP.consumedPoints > maxWrongAttemptsByIPperDay
  ) {
    // msBeforeNext = Number of milliseconds before next action can be done
    retrySecs = Math.round(resSlowByIP.msBeforeNext / 1000) || 1;
  } else if (
    resEmailAndIP !== null &&
    resEmailAndIP.consumedPoints > maxConsecutiveFailsByEmailAndIP
  ) {
    retrySecs = Math.round(resEmailAndIP.msBeforeNext / 1000) || 1;
  }

  if (retrySecs > 0) {
    // convert seconds to hours
    const retryHours = (retrySecs / 3600).toFixed(1);
    res.set('Retry-After', String(retryHours));
    res.status(429).send(`Too Many Requests. Retry after ${retryHours} hours.`);
  } else {
    passport.authenticate('local', async function (err, user, info) {
      if (err) {
        res.status(401).json('There was an authentication error.');
      }
      if (!user) {
        // Consume 1 point from limiters on wrong attempt and block if limits reached
        try {
          const promises = [limiterSlowBruteByIP.consume(ipAddr)];
          // check user exists and authentication failed because of an incorrect password
          if (info.message === 'IncorrectPasswordError') {
            // Count failed attempts by Email + IP only for registered users
            promises.push(
              limiterConsecutiveFailsByEmailAndIP.consume(emailIPkey)
            );
          }
          // if user does not exist
          // if (info.message === 'IncorrectUsernameError') {
          //   console.log('failed login: user does not exist');
          // }

          await Promise.all(promises);
          res.status(401).json('Email or password incorrect');
        } catch (rlRejected) {
          if (rlRejected instanceof Error) {
            throw rlRejected;
          } else {
            const timeOut = Math.round(rlRejected.msBeforeNext / 1000) || 1;
            // convert seconds to hours
            const retryHours = (timeOut / 3600).toFixed(1);
            res.set('Retry-After', String(retryHours));
            res
              .status(429)
              .json(`Too Many Requests. Retry after ${retryHours} hours`);
          }
        }
      }
      // If passport authentication successful
      if (user) {
        // Check if user email confirmed
        if (!user.isEmailConfirmed) {
          res
            .status(401)
            .json(
              'You must confirm your email address. Check your email inbox.'
            );
        }
        if (resEmailAndIP !== null && resEmailAndIP.consumedPoints > 0) {
          // Reset on successful authorisation - if points consumed
          await limiterConsecutiveFailsByEmailAndIP.delete(emailIPkey);
        }
        if (user.isEmailConfirmed) {
          // login
          req.logIn(user, function (err) {
            if (err) {
              return next(err);
            }
            res.json('You are now logged in.');
          });
        }
      }
    })(req, res, next);
  }
};

// _____________________________ rate limiter for Usplash API routes __________________________

exports.rateLimitUnsplashAPI = async (req, res, next) => {
  const userId = req.user.id;

  if (req.path.indexOf('/api/search/photos') >= 0) {
    limiterByUser.keyPrefix = `image_search_user_per_day`;
  }

  if (req.path.indexOf('/api/photos/track-download') >= 0) {
    limiterByUser.keyPrefix = `image_download_user_per_day`;
  }

  // get key for attempted request
  const resUser = await limiterByUser.get(userId);
  let retrySecs = 0;
  // Check if user is already blocked
  if (resUser !== null && resUser.consumedPoints > maxAttemptsByUserPerDay) {
    // msBeforeNext = Number of milliseconds before next action can be done
    retrySecs = Math.round(resUser.msBeforeNext / 1000) || 1;
  }
  // if route is currently rate limited
  if (retrySecs > 0) {
    // convert seconds to hours
    const retryHours = (retrySecs / 3600).toFixed(1);
    res.set('Retry-After', String(retryHours));
    res.status(429).send(`Too Many Requests. Retry after ${retryHours} hours.`);
  } else {
    limiterByUser
      .consume(userId)
      .then(() => {
        next();
      })
      .catch((rlRejected) => {
        if (rlRejected instanceof Error) {
          throw rlRejected;
        } else {
          const timeOut = Math.round(rlRejected.msBeforeNext / 1000) || 1;
          // convert seconds to hours
          const retryHours = (timeOut / 3600).toFixed(1);
          res.set('Retry-After', String(retryHours));
          res
            .status(429)
            .json(`Too Many Requests. Retry after ${retryHours} hours`);
        }
      });
  }
};

// _____________________________ rate limiter for Google Translate API  __________________________

exports.rateLimitGoogleTranslate = async (req, res, next) => {
  const userId = req.user.id;
  const { charCount } = req.query;
  // get key for attempted request
  const resUser = await limiterGoogleTranslateCharsByUser.get(userId);
  let retrySecs = 0;
  // Check if user is already blocked
  if (resUser !== null && resUser.consumedPoints > maxCharsByUserPerDay) {
    // msBeforeNext = Number of milliseconds before next action can be done
    retrySecs = Math.round(resUser.msBeforeNext / 1000) || 1;
  }
  // if route is currently rate limited
  if (retrySecs > 0) {
    // convert seconds to hours
    const retryHours = (retrySecs / 3600).toFixed(1);
    res.set('Retry-After', String(retryHours));
    res.status(429).send(`Too Many Requests. Retry after ${retryHours} hours.`);
  } else {
    limiterGoogleTranslateCharsByUser
      .consume(userId, charCount)
      .then(() => {
        next();
      })
      .catch((rlRejected) => {
        if (rlRejected instanceof Error) {
          throw rlRejected;
        } else {
          const timeOut = Math.round(rlRejected.msBeforeNext / 1000) || 1;
          // convert seconds to hours
          const retryHours = (timeOut / 3600).toFixed(1);
          res.set('Retry-After', String(retryHours));
          res
            .status(429)
            .json(`Too Many Requests. Retry after ${retryHours} hours`);
        }
      });
  }
};

// ___________________________ rate limiter middleware for other routes ________________________

exports.rateLimitByIP = async (req, res, next) => {
  // determine key to use by checking url
  if (req.path.indexOf('/signup') >= 0) {
    limiterByIP.keyPrefix = `signup_ip_per_day`;
  }
  if (req.path.indexOf('/account/email') >= 0) {
    limiterByIP.keyPrefix = `change_email_ip_per_day`;
  }
  if (req.path.indexOf('/account/password') >= 0) {
    limiterByIP.keyPrefix = `change_password_ip_per_day`;
  }
  if (req.path.indexOf('/account/forgot') >= 0) {
    limiterByIP.keyPrefix = `forgot_password_ip_per_day`;
  }
  if (req.path.indexOf('/account/reset') >= 0) {
    limiterByIP.keyPrefix = `reset_password_ip_per_day`;
  }

  const ipAddr = req.ip;

  // get key for attempted request
  const resSlowByIP = await limiterByIP.get(ipAddr);
  let retrySecs = 0;
  // Check if IP is already blocked
  if (
    resSlowByIP !== null &&
    resSlowByIP.consumedPoints > maxWrongAttemptsByIPperDay
  ) {
    // msBeforeNext = Number of milliseconds before next action can be done
    retrySecs = Math.round(resSlowByIP.msBeforeNext / 1000) || 1;
  }
  // if route is currently rate limited
  if (retrySecs > 0) {
    // convert seconds to hours
    const retryHours = (retrySecs / 3600).toFixed(1);
    res.set('Retry-After', String(retryHours));
    res.status(429).send(`Too Many Requests. Retry after ${retryHours} hours.`);
  } else {
    limiterByIP
      .consume(ipAddr)
      .then(() => {
        next();
      })
      .catch((rlRejected) => {
        if (rlRejected instanceof Error) {
          throw rlRejected;
        } else {
          const timeOut = Math.round(rlRejected.msBeforeNext / 1000) || 1;
          // convert seconds to hours
          const retryHours = (timeOut / 3600).toFixed(1);
          res.set('Retry-After', String(retryHours));
          res
            .status(429)
            .json(`Too Many Requests. Retry after ${retryHours} hours`);
        }
      });
  }
};
