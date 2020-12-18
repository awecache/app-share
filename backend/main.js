const morgan = require('morgan');
const express = require('express');

const PORT = parseInt(process.argv[2]) || parseInt(process.env.PORT) || 3000;

const app = express();

app.use(morgan('combined'));

//auth middleware
const auth = (username, password) => {};

app.post('/login', express.json(), (req, res) => {
  const { username, password } = req.body;
  //   console.log('name', username);
  //   console.log('pass', password);

  res.status(200).json({ success: true });
  //   res.status(401).json({errorMessage:'Invalid Credentials'})
});

app.listen(PORT, () => {
  console.info(`Application started on port ${PORT} at ${new Date()}`);
});
