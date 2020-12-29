const express = require('express');
const { json } = require('body-parser');
const cookieSession = require('cookie-session');
const path = require('path');

const app = express();
app.set('trust proxy', true);
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: false,
  })
);

const start = async () => {
  app.use(express.static(path.join(__dirname, '../build')));

  app.use(express.static(path.resolve(__dirname, '../build')));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../build', 'index.html'));
  });

  app.listen(3000, () => {
    console.log('Listening on port 3000!!!!');
  });
};

start();
