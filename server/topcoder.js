const socketio = require('socket.io-client');
const fetch = require('node-fetch');
const Promise = require('bluebird');
const _ = require('lodash');

class Topcoder {
  constructor(sso) {
    this.sso = sso;
  }

  initializeSocket() {
    console.log('connecting');
    this.socket = socketio.connect('https://arenaws.topcoder.com');

    console.log('SOCKETIOVERSION=', socketio.version);
    this.socket.on('connect', () => {
      console.log('connected!', this.sso);
      this.socket.emit('SSOLoginRequest', {
        sso: this.sso,
      });
    });
    this.socket.on('LoginResponse', (...args) => {
      console.log('LoginResponse', ...args);
    });
    this.socket.on('disconnect', () => {
      console.log('disconnected!');
    });
  }

  getUser(username) {
    return fetch(`https://api.topcoder.com/v3/members/${username}/stats/`)
      .then(r => r.json())
      .then(body => body.result.content.DATA_SCIENCE.SRM)
      .then(({ rank: { rating, volatility, competitions } }) => ({
        username,
        rating,
        volatility,
        competitions,
      }))
      .catch(() => ({
        username,
        rating: 1200,
        volatility: 500,
        competitions: 0,
      }));
  }

  getRound(roundID=17265, divisionID=1) {
    console.log('emitting');
    this.socket.emit('DivSummaryRequest', {
      roundID,
      divisionID,
    });
    return new Promise((resolve, reject) => {
      const numRooms = 9;
      let roomsReceived = 0;
      const roomData = {};
      this.socket.on('CreateChallengeTableResponse', message => {
        roomsReceived += 1;
        const { roomID: roomId, coders } = message;
        console.log('received', roomId);
        roomData[roomId] = {
          coders,
        };
        if (roomsReceived === numRooms) {
          resolve(roomData);
        }
      });
    }).then(roomData => {
      this.socket.removeAllListeners('CreateChallengeTableResponse');
      const allCoders = _.flatten(_.values(roomData).map(({ coders }) => coders));
      return allCoders;
    });
  }
}

module.exports = Topcoder;
