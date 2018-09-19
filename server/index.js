const express = require('express');
const path = require('path');
const Topcoder = require('./topcoder');
const redis = require("redis");
const expressRedisCache = require('express-redis-cache');
const cors = require('cors');
const bodyParser = require('body-parser');
const Promise = require('bluebird');

require('dotenv').config()


process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0
if (!process.env.TCSSO) {
  throw new Error('missing TCSSO');
}

const server = express();
server.use(bodyParser.json());

// CORS allow localhost:3000, for dev purposes
// server.use(cors({ origin: 'http://localhost:3000' }))
server.use(cors({ origin: 'http://localhost:3001' }))

// Priority serve any static files.
server.use(express.static(path.resolve(__dirname, '../react-ui/build')));

// cache things if enabled
if (process.env.ENABLE_CACHE) {
  const redisClient = redis.createClient(process.env.REDIS_URL || 'redis://127.0.0.1:6379');
  const cache = expressRedisCache({
    client: redisClient,
    expire: 7 * 24 * 60 * 60,
  });
  server.use(cache.route());
}

const topcoder = new Topcoder(process.env.TCSSO);
topcoder.initializeSocket();

server.post('/api/users', function (req, res) {
  const users = req.body.users;
  Promise.map(users, user => (
    topcoder.getUser(user)
  ), {
    concurrency: 5,
  }).then(users => {
    console.log('returning', users)
    res.json(users);
  });
});

// Answer API requests.
server.get('/api/user/:user', function (req, res) {
  const user = req.params.user;
  console.log(`GRABBING user ${user}`);
  res.set('Content-Type', 'application/json');
  topcoder.getUser(user)
    .then(user => {
      res.json(user);
    });
});

server.get('/api/round/:round', function (req, res) {
  const round = req.params.round;
  console.log(`GRABBING round ${round}`);
  res.set('Content-Type', 'application/json');
  topcoder.getRound(round)
    .then(coders => {
      res.json(coders);
    });
});

// All remaining requests return the React app, so it can handle routing.
server.get('*', function(request, response) {
  response.sendFile(path.resolve(__dirname, '../react-ui/build', 'index.html'));
});

module.exports = server;
