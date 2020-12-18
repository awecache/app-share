const express = require('express');
const auth = require('../middlewares/auth');

const router = express.Router();

router.post('/login', express.json(), auth, (req, res) => {
  res.status(200).json({ success: true });
});

module.exports = router;
