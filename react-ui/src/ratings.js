// implements http://community.topcoder.com/longcontest/?module=Static&d1=support&d2=ratings
import _ from 'lodash';
import jStat from 'jStat';

function square(x) {
  return x * x;
}

function getWinProbability(rating, oRating, volatility, oVolatility) {
  const par = (oRating - rating) / (Math.sqrt (2 * (square(volatility) + square(oVolatility))));
  return 0.5 * (jStat.erf (par) + 1);
}

function getPerfFromRank(rank, totalPlayers) {
  const result = -jStat.normal.inv((rank - 0.5) / totalPlayers, 0, 1)
  return result;
}

function getCompetitionFactor(volatilities, ratings) {
  const volMeanSquared = jStat.sumsqrd(volatilities) / ratings.length;
  const ratingVariance = jStat.variance(ratings) * ratings.length / (ratings.length - 1);
  return Math.sqrt(volMeanSquared + ratingVariance);
}

export default (roundData, userData) => {
  const getUserData = username => {
    const row = userData.find(row => row.username === username);
    if (!row.rating) { // for some reason, topcoder api returns 0 sometimes
      return { rating: 1200, volatility: 500, matchCount: 0 };
    }
    return {
      rating: row.rating,
      volatility: row.volatility,
      matchCount: row.competitions,
    }
  };

  const participantRoundData = _.filter(roundData,
    ({ components, totalPoints }) => _.some(components, ({ status }) => status !== 110) || totalPoints !== 0
  );
  let users = participantRoundData.map(row => ({
    points: row.totalPoints,
    username: row.userName,
    ...getUserData(row.userName),
  }));
  // user should be keyed by username

  users = _.sortBy(users, user => -user.points);

  console.log("Registered users:", roundData.length)
  console.log("Participating users:", users.length)

  const ratedUsers = users.filter(({ matchCount }) => matchCount > 0);

  console.log("Previously rated users:", ratedUsers.length)

  const CF = getCompetitionFactor(
    _.map(ratedUsers, ({ volatility }) => volatility),
    _.map(ratedUsers, ({ rating }) => rating));

  console.log("Competition Factor:", CF)

  const toPerf = rank => getPerfFromRank(rank, ratedUsers.length);
  _.forEach(users, ((user) => {
    const { rating, volatility, matchCount, points } = user;
    // if (matchCount === 0) return; // no prediction for unrated users
    const expectedRank = 0.5 + _.sum(_.map(ratedUsers, ({ rating: oRating, volatility: oVolatility }) => (
      getWinProbability(rating, oRating, volatility, oVolatility)
    )));

    const numLoss = _.filter(ratedUsers, user => user.points > points).length;
    const numTies = _.filter(ratedUsers, user => user.points === points).length;
    const displayRank = 1 + numLoss;
    const actualRank = 0.5 + numLoss + 0.5 * numTies;

    user.expectedRank = expectedRank;
    user.displayRank = displayRank;
    user.actualRank = actualRank;

    const perfAs = rating + CF * (toPerf(actualRank) - toPerf(expectedRank));
    let weight = 1 / (1 - (0.42 / (matchCount + 1) + 0.18)) - 1;
    if (rating >= 2500) {
      weight *= 0.8;
    } else if (rating >= 2000) {
      weight *= 0.9;
    }
    const cap = Math.round(150 + 1500 / (matchCount + 2));
    const newRating = (rating + weight * perfAs) / (1 + weight);
    const prediction = _.clamp(Math.round(newRating - rating), -cap, cap);

    user.deltaRating = prediction;
    user.newRating = rating + prediction;

    user.newVolatility = Math.round(Math.sqrt(square(prediction) / weight + square(user.volatility) / (weight + 1)));
  }));

  return users.map((user) => ({
    name: user.username,
    oldRating: user.rating,
    newRating: user.newRating,
    deltaRating: user.deltaRating,
    oldVolatility: user.volatility,
    newVolatility: user.newVolatility,
    rank: user.displayRank,
    trueRank: user.actualRank,
    seed: user.expectedRank,
  }));
};
