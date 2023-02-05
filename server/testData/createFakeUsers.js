const faker = require('faker');

// To make a hash and salt for a fake user password, create a salt and hash from a test password using
// the genPassword() function in passwordUtils.js
const hash = '<add-a-hash>';
const salt = '<add-a-pw>';
const isAdmin = false;
const isEmailConfirmed = true;
const auth = 'local';

function createUsers(numUsers) {
  const allUsers = [];
  for (let i = 0; i < numUsers; i += 1) {
    const name = faker.unique(faker.name.firstName);
    const email = faker.unique(faker.internet.email);
    allUsers.push({ auth, salt, hash, email, name, isAdmin, isEmailConfirmed });
  }
  return allUsers;
}

exports.createUsers = createUsers;
