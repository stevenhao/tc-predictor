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

  let users = roundData.map(row => ({
    points: row.totalPoints,
    username: row.userName,
    ...getUserData(row.userName),
  }));
  // user should be keyed by username

  users = _.sortBy(users, user => -user.points);

  const ratedUsers = users.filter(({ matchCount }) => matchCount > 0);

  const winProbabilities = _.map(users, ({ rating, volatility }) => (
    _.map(ratedUsers, ({ rating: oRating, volatility: oVolatility }) => (
      getWinProbability(rating, oRating, volatility, oVolatility)
    ))
  ));

  const CF = getCompetitionFactor(
    _.map(ratedUsers, ({ volatility }) => volatility),
    _.map(ratedUsers, ({ rating }) => rating));


  const toPerf = rank => getPerfFromRank(rank, ratedUsers.length);
  const predictions = _.map(users, (({ rating, matchCount, points }, i) => {
    // if (matchCount === 0) return 0; // no prediction for unrated users
    const expectedRank = 0.5 + _.sum(winProbabilities[i]);
    const actualRank = 1 + _.filter(ratedUsers, user => user.points > points).length;

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
    return prediction;
  }));

  return users.map((user, i) => ({
    name: user.username,
    deltaRating: predictions[i],
    oldRating: user.rating,
    newRating: user.rating + predictions[i],
    oldVolatility: user.volatility,
    newVolatility: user.volatility,
  }));
};
