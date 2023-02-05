const mongoose = require('mongoose');
const crypto = require('crypto');
const mail = require('../handlers/mail');
const { genPassword } = require('../lib/passwordUtils');

const User = mongoose.model('User');

const DEV_ENV = process.env.NODE_ENV === 'development';
const { BACKEND_URL, FRONTEND_DEV_URL } = process.env;

exports.getUser = async (req, res) => {
  res.json(req.user);
};

// check if user logged in
exports.isLoggedIn = (req, res, next) => {
  // 1st check if user authenticated (done by passport.js)
  if (req.isAuthenticated()) {
    next(); // continue - the are logged in
    return;
  }
  res.status(403).json('You must be logged in to do that!');
};

exports.isLocalAuth = (req, res, next) => {
  // 1st check if user authenticated (done by previous middleware)
  if (req.user.auth === 'local') {
    next(); // continue - the are logged in
    return;
  }
  res.status(403).json("Can't change for Google authentication.");
};

exports.logout = (req, res) => {
  // delete req.session.passport.user
  req.logout();
  res.json('success');
};

exports.isAdmin = (req, res, next) => {
  const { user } = req;
  if (user) {
    User.findOne({ name: user.name }, (err, doc) => {
      if (err) {
        res.status(err.status || 500).json('There was a database error');
      }
      if (doc.isAdmin) {
        next();
      } else {
        res.status(403).json('Access denied');
      }
    });
  } else {
    res.status(403).json('Access denied');
  }
};

// email confirmation
exports.sendEmailConfirm = async (req, res) => {
  const user = await User.findOne({ email: req.body.email });

  // 1. if newly registered user exists: set email confirm tokens and expiry
  // crypto module is built into Node
  user.emailConfirmToken = crypto.randomBytes(28).toString('hex');
  user.emailConfirmExpires = Date.now() + 3600000; // 1h from now
  // token and expire added to db
  await user.save();
  // 2. send them an email with the token
  const userEmail = user.email;
  const websiteURL = `${!DEV_ENV ? BACKEND_URL : FRONTEND_DEV_URL}`;
  const resetURL = `${!DEV_ENV ? BACKEND_URL : FRONTEND_DEV_URL}/emailconfirm/${
    user.emailConfirmToken
  }`;
  await mail.send({
    userEmail,
    subject: 'Confirm your email address',
    websiteURL,
    resetURL,
    // needed for rendering password-reset.pug
    filename: 'email-confirm',
  });

  // redirect user to /login -> on frontend
  res.json('You have been emailed a link to confirm your email address.');
};

exports.emailConfirmCheck = async (req, res) => {
  const user = await User.findOne({
    // look for person who is registering and wants to confirm their email
    // someone needs to know the token - emailed to them - check
    emailConfirmToken: req.params.token,
    // gt = greater than. Check if expire date (set 1 h into the future) is greater than now
    emailConfirmExpires: { $gt: Date.now() },
  });
  if (!user) {
    res.status(401).json('Email confirmation is invalid or has expired');
  }
  // email confirmed
  if (user) {
    user.isEmailConfirmed = true;
    // remove confirm token and expires - not needed anymore
    user.emailConfirmToken = undefined;
    user.emailConfirmExpires = undefined;
    await user.save();
    res.json('Your email has been confirmed! You can now login');
  }
};

// __________________________________ pw forgot  __________________________________

exports.forgot = async (req, res) => {
  // 1. check if user exists
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    // can choose to notify that email does not exist
    // It could be abused, depending on the site
    // However, in this app - in register route - if email used, then they can't register so someone can figure out if email in use from there. It is easier to check if an email is in use from this middleware, if u show message that states email is in use.
    return res.json('You have been emailed a password reset link.');
  }

  // 2. if user exists: set reset tokens and expiry on their account
  // crypto module is built into Node
  user.resetPasswordToken = crypto.randomBytes(28).toString('hex');
  user.resetPasswordExpires = Date.now() + 3600000; // 1h from now
  // token and expire added to db
  await user.save();

  // 3. send them an email with the token
  const userEmail = user.email;
  const websiteURL = `${!DEV_ENV ? BACKEND_URL : FRONTEND_DEV_URL}`;
  const resetURL = `${
    !DEV_ENV ? BACKEND_URL : FRONTEND_DEV_URL
  }/account/reset/${user.resetPasswordToken}`;
  await mail.send({
    userEmail,
    subject: 'Password Reset',
    websiteURL,
    resetURL,
    // needed for rendering password-reset.pug
    filename: 'password-reset',
  });
  res.json(`You have been emailed a password reset link.`);
};

exports.reset = async (req, res) => {
  const user = await User.findOne({
    // look for person who requested pw reset
    // someone needs to know the token - emailed to them - check
    resetPasswordToken: req.params.token,
    // gt = greater than. Check if expire date (set 1 h into the future) is greater than now
    resetPasswordExpires: { $gt: Date.now() },
  });
  // res.json(req.params);
  if (!user) {
    return res.status(401).json('Password reset is invalid or has expired.');
  }
  // if there is a user, show the reset password form
  res.json('Reset your password.');
};

exports.updateForgotPassword = async (req, res) => {
  // check if token not expired - someone might open the reset link and leave the page open for more than 1h, so check if token is expired again
  const user = await User.findOne({
    // look for person who requested pw reset
    // someone needs to know the token - emailed to them - check
    resetPasswordToken: req.params.token,
    // gt = greater than. Check if expire date (set 1 h into the future) is greater than now
    resetPasswordExpires: { $gt: Date.now() },
  });

  if (!user) {
    return res.status(401).json('Password reset is invalid or has expired.');
  }

  // new pw - make hash and salt
  const saltHash = genPassword(req.body.password);
  const { salt } = saltHash;
  const { hash } = saltHash;

  // change users hash and salt. Setting field values to undefined - will be deleted from db
  user.salt = salt;
  user.hash = hash;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  // save changes to db
  const updatedUser = await user.save();

  await req.login(updatedUser);
  res.json('🕺 your password has been reset. You are now logged in.');
};

// __________________________________ User Account info change __________________________________

exports.updateName = async (req, res) => {
  await User.findOneAndUpdate(
    { _id: req.user.id },
    { $set: { name: req.body.name } },
    {
      // context option lets u set the value of 'this' in update validators - use query not old name?
      new: true,
      runValidators: true,
      context: 'query',
      useFindAndModify: false,
    }
  );
  res.json('Your name has been changed.');
};

exports.updateEmail = async (req, res) => {
  const currentEmail = req.user.email;
  const newEmail = req.body.email;

  if (currentEmail === newEmail) {
    res.status(409).json("You can't change your email to your current email.");
  }
  if (currentEmail !== newEmail) {
    const updates = {
      email: newEmail,
      isEmailConfirmed: false,
      emailConfirmToken: crypto.randomBytes(28).toString('hex'),
      emailConfirmExpires: Date.now() + 3600000, // 1h from now
    };

    const user = await User.findOneAndUpdate(
      { _id: req.user.id },
      { $set: updates },
      {
        new: true,
        runValidators: true,
        context: 'query',
        useFindAndModify: false,
      }
    );

    const userEmail = user.email;
    const websiteURL = `${!DEV_ENV ? BACKEND_URL : FRONTEND_DEV_URL}`;
    const resetURL = `${
      !DEV_ENV ? BACKEND_URL : FRONTEND_DEV_URL
    }/emailconfirm/${user.emailConfirmToken}`;
    await mail.send({
      userEmail,
      subject: 'Confirm your new email address',
      websiteURL,
      resetURL,
      // needed for rendering password-reset.pug
      filename: 'email-confirm',
    });

    // logout current session
    req.logOut();
    // redirect user to /login -> on frontend
    res.json('You have been emailed a link to confirm your new email address.');
  }
};

exports.updatePassword = async (req, res) => {
  // check if old pw is correct (already done in validator middleware)

  // new pw - make hash and salt
  const saltHash = genPassword(req.body.newPassword);
  const { salt } = saltHash;
  const { hash } = saltHash;

  // change users hash and salt
  const updates = {
    salt,
    hash,
  };

  await User.findOneAndUpdate(
    { _id: req.user.id },
    { $set: updates },
    {
      new: true,
      runValidators: true,
      context: 'query',
      useFindAndModify: false,
    }
  );
  // logout and redirect (on frontend) to /login - send json message for user
  req.logOut();
  // redirect user to /login -> on frontend
  res.json('Your password has been changed. Login with your new password');
};
