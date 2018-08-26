// implements http://community.topcoder.com/longcontest/?module=Static&d1=support&d2=ratings
import _ from 'lodash';

export default (roundData, userData) => {
  const getUserData = username => {
    const row = userData.find(row => row.username === username);
    if (!row) {
      return { rating: -1, volatility: -1, matchCount: -1 };
    }
    return {
      rating: row.rating,
      volitility: row.volatility,
      matchCount: row.matchCount,
    }
  };

  const users = roundData.map(row => ({
    points: row.totalPoints,
    username: row.userName,
    ...getUserData(row.userName),
  }));
  // user should be keyed by username

   _.sortBy(users, user => user.totalPoints);

  const ranks = _.map(users, ({ points }) => _.filter(users, user => user.points > points).length);
  const predictions = _.map(users, (({ rating }, i) => {
    const rank = ranks[i];
    return rating + 10; // STUB
  }));

  return users.map((user, i) => ({
    newRating: predictions[i],
    oldRating: user.rating,
    deltaRating: predictions[i] - user.rating,
    name: user.username,
  }));
};
