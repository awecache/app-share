const sha1 = require('sha1');
const { mysqlPool } = require('../database');
const { getPasswordByUserId } = require('../queries');
const { makeQuery } = require('../utils');

const getPassword = makeQuery(getPasswordByUserId, mysqlPool);

const auth = async (req, res, next) => {
  const { username, password } = req.body;
  const hashedPassword = sha1(password);

  try {
    const result = (await getPassword([username]))[0];
    if (!result) {
      return res.status(401).json({ errorMessage: 'Invalid Credentials' });
    }
    if (
      result.password &&
      hashedPassword.localeCompare(result.password) === 0
    ) {
      return next();
    }
  } catch (error) {
    return res.status(500).json({ errorMessage: 'Try again' });
  }

  res.status(401).json({ errorMessage: 'Invalid Credentials' });
};

module.exports = auth;
