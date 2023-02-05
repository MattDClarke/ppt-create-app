require('dotenv').config({ path: `${__dirname}/../variables.env` });

const mongoose = require('mongoose');

// Connect to our Database and handle any bad connections
await mongoose.connect(process.env.DATABASE);

// import all of our models - they need to be imported only once
const User = require('../models/User');

// create fake users
const createFakeUsers = require('./createFakeUsers');

const numberOfFakeUsers = 100;
const users = createFakeUsers.createUsers(numberOfFakeUsers);

async function deleteData() {
  console.log('😢😢 Goodbye Data...');
  await User.deleteMany({});
  // also delete sessions
  await mongoose.connection.collection('sessions').deleteMany({});

  console.log(
    'User Data Deleted. To load sample data, run\n\n\t npm run sample\n\n'
  );
  process.exit();
}

async function loadData() {
  try {
    await User.insertMany(users);
    console.log('👍👍👍👍👍👍👍👍 Done!');
    process.exit();
  } catch (e) {
    console.log(
      '\n👎👎👎👎👎👎👎👎 Error! The Error info is below but if you are importing sample data make sure to drop the existing database first with.\n\n\t npm run blowitallaway\n\n\n'
    );
    console.log(e);
    process.exit();
  }
}

// see package.json scripts
if (process.argv.includes('--delete')) {
  deleteData();
} else {
  loadData();
}
