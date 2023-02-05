const crypto = require('crypto');

function genPassword(password) {
  const salt = crypto.randomBytes(32).toString('hex');
  // 10001 iterations, 65 chars long
  const hash = crypto
    .pbkdf2Sync(password, salt, 10001, 65, 'sha512')
    .toString('hex');

  return {
    salt,
    hash,
  };
}

function validatePassword(password, hash, salt) {
  const hashVerify = crypto
    .pbkdf2Sync(password, salt, 10001, 65, 'sha512')
    .toString('hex');

  return hash === hashVerify;
}

module.exports.validatePassword = validatePassword;
module.exports.genPassword = genPassword;
