import express from 'express';
import path from 'path';
import bluebird from 'bluebird';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';

import auth from './routes/auth';

dotenv.config();
const app = express();
app.use(bodyParser.json());

// Use bluebird as default promise library @see: https://github.com/Automattic/mongoose/issues/4951
mongoose.Promise = bluebird;
mongoose.connect(process.env.MONGODB_URL, {useMongoClient: true});


app.use('/api/auth', auth);

// Default routes redirect to a page saying you're on an API.
app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(8080, () => console.log('Running on localhost:8080'));
