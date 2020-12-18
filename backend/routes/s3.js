const fs = require('fs');
const path = require('path');
const express = require('express');
const router = express.Router();

const multer = require('multer');
const { s3, mongoClient, mysqlPool } = require('../database');
const { makeQuery, putObject, readFile } = require('../utils');
const { MONGO_COLLECTION, MONGO_DB } = require('../constants');
const { getPasswordByUserId } = require('../queries');

const { AWS_S3_BUCKETNAME } = process.env;

const destPath = path.join(__dirname, '..', 'uploads');
const upload = multer({
  dest: destPath
});

const getPassword = makeQuery(getPasswordByUserId, mysqlPool);

router.post('/upload', upload.single('image-file'), async (req, res) => {
  const { username, password } = req.body;

  const saveDocToMongo = async () => {
    const filename = req.file.filename;
    const body = req.body;
    const doc = {
      ...body,
      filename,
      ts: new Date()
    };

    // //save to mongo Promise
    const mongoResult = await mongoClient
      .db(MONGO_DB)
      .collection(MONGO_COLLECTION)
      .insertOne(doc);

    return mongoResult;
  };

  try {
    const result = (await getPassword([username]))[0];
    if (!result) {
      return res.status(401).json({ errorMessage: 'Invalid Credentials' });
    }
    if (result.password && password.localeCompare(result.password) === 0) {
      console.log('auth successful ');

      //read buffer
      const buffer = await readFile(req.file.path);

      try {
        //save image to S3
        await putObject(req.file, buffer, s3, AWS_S3_BUCKETNAME);

        //save doc to mongoDB
        const { insertedId } = await saveDocToMongo();

        console.log('insertedId>>>', insertedId);

        fs.unlink(req.file.path, () => {
          console.log('clean up after upload');
        });

        return res.status(200).json({ id: insertedId });
      } catch (error) {
        return res.status(500).json({ error });
      } finally {
        mongoClient.close();
      }
    }
  } catch (error) {
    return res.status(500).json({ errorMessage: 'Try again' });
  }
});

module.exports = router;
