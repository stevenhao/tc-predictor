const express = require('express');
const path = require('path');
const Topcoder = require('./topcoder');
const redis = require("redis");
const expressRedisCache = require('express-redis-cache');
require('dotenv').config()


process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0
console.log(process.env.tcsso);
const server = express();
const topcoder = new Topcoder(process.env.tcsso);
topcoder.initializeSocket();

// Priority serve any static files.
server.use(express.static(path.resolve(__dirname, '../react-ui/build')));

// cache things if enabled
if (process.env.ENABLE_CACHE) {
  const redisClient = redis.createClient(process.env.REDIS_URI || 'redis://127.0.0.1:6379');
  const cache = expressRedisCache({
    client: redisClient,
    expire: 60 * 60,
  });
  server.use(cache.route());
}

// Answer API requests.
server.get('/api/user/:user', function (req, res) {
  const user = req.params.user;
  res.set('Content-Type', 'application/json');
  topcoder.getUser(user)
    .then(user => {
      res.json(user);
    });
});

server.get('/api/round/:round', function (req, res) {
  const round = req.params.round;
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
