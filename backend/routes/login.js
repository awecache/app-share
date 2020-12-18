const express = require('express');

const { mysqlPool } = require('../database');
const { getPasswordByUserId } = require('../queries');
const { makeQuery } = require('../utils');

const router = express.Router();

const getPassword = makeQuery(getPasswordByUserId, mysqlPool);

//implement auth middleware to reduce repeated code

router.post('/login', express.json(), async (req, res) => {
  const { username, password } = req.body;

  try {
    const result = (await getPassword([username]))[0];
    if (!result) {
      return res.status(401).json({ errorMessage: 'Invalid Credentials' });
    }
    if (result.password && password.localeCompare(result.password) === 0) {
      return res.status(200).json({ success: true });
    }
  } catch (error) {
    return res.status(500).json({ errorMessage: 'Try again' });
  }

  res.status(401).json({ errorMessage: 'Invalid Credentials' });
});

module.exports = router;
