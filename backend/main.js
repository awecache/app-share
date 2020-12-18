require('dotenv').config();
const path = require('path');
const morgan = require('morgan');
const express = require('express');

const { startApp } = require('./utils');
const { loginRoutes, s3Routes } = require('./routes');
const { s3, mysqlPool, mongoClient } = require('./database');

const app = express();

app.use(morgan('combined'));

app.use(loginRoutes);
app.use(s3Routes);

const mainDir = path.join(__dirname, 'public', 'dist', 'frontend');
app.use(express.static(mainDir));

const mysqlConnection = (async () => {
  const conn = await mysqlPool.getConnection();
  await conn.ping();
  conn.release();
  return true;
})();

const mongoConnection = (async () => {
  await mongoClient.connect();
  return true;
})();

const s3Connection = new Promise((resolve, reject) => {
  if (!!process.env.AWS_S3_ACCESS_KEY && !!process.env.AWS_S3_SECRET) resolve();
  else reject('S3 keys not found');
});

startApp(app, [mysqlConnection, mongoConnection, s3Connection]);
