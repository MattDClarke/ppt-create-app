const mongoose = require('mongoose');

const User = mongoose.model('User');
const WordList = mongoose.model('WordList');
// const { promisify } = require('util');
const { genPassword } = require('../lib/passwordUtils');

exports.signup = async (req, res, next) => {
  const saltHash = genPassword(req.body.password);
  const { salt } = saltHash;
  const { hash } = saltHash;

  await new User({
    auth: 'local',
    email: req.body.email,
    name: req.body.name,
    hash,
    salt,
    isAdmin: false,
    isEmailConfirmed: false,
  })
    .save()
    .catch((err) => next(err));

  next();
};

exports.getUsers = async (req, res, next) => {
  // dnt send hash and salt - only name, email and id (id sent by default)
  // paginate results
  const page = req.params.page || 1;
  const limit = 10;
  const skip = page * limit - limit;
  // exclude current user - admin. Only 1 admin in this case
  const usersPromise = User.find({ isAdmin: { $ne: true } }, 'name email')
    .skip(skip)
    .limit(limit)
    .sort({ name: 'asc' });
  // exclude admin from count
  const countPromise = User.countDocuments({ isAdmin: { $ne: true } });
  const [users, count] = await Promise.all([usersPromise, countPromise]);
  // round up - so that pages is always an integer that can fit all stores
  const pages = Math.ceil(count / limit);
  const hasMore = page < pages;
  // if user looks for page that does not exist, for example - edit url or old bookmark
  if (!users.length && skip) {
    return res.status(404).json('Page does not exist');
  }
  res.json({
    users,
    page,
    pages,
    hasMore,
    count,
  });
};

exports.deleteAccount = async (req, res) => {
  const userDeletePromise = User.findOneAndDelete(
    {
      _id: req.user.id,
    },
    {
      useFindAndModify: false,
    }
  );
  const wordListsDeletePromise = WordList.deleteMany({ user: req.user.id });
  await Promise.all([userDeletePromise, wordListsDeletePromise]);
  req.logOut();
  // redirect user to / -> on frontend
  res.json('Your account has been successfully deleted.');
};

// ___________________________________________ Admin ___________________________________________

exports.deleteUsers = async (req, res) => {
  const usersArray = req.body.ids;
  const usersDeletePromise = User.deleteMany(
    {
      _id: { $in: usersArray },
    },
    { useFindAndModify: false }
  );

  const wordListsDeletePromise = WordList.deleteMany(
    {
      user: { $in: usersArray },
    },
    { useFindAndModify: false }
  );

  // make each array item a regex: /id/
  const usersToDeleteRegexes = usersArray.map((id) => new RegExp(`${id}`));
  const sessionsDeletePromise = mongoose.connection
    .collection('sessions')
    .deleteMany(
      { session: { $in: usersToDeleteRegexes } },
      { useFindAndModify: false }
    );

  await Promise.all([
    usersDeletePromise,
    wordListsDeletePromise,
    sessionsDeletePromise,
  ]);
  res.json('Users deleted successfully');
};
