require('now-env');
const Twitter = require('twitter-node-client').Twitter;

module.exports = function() {
  if (this.twitter) {
    return this.twitter;
  }

  const twitterConfig = {
    consumerKey: process.env.TWITTER_CONSUMER_KEY,
    consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
    accessToken: process.env.TWITTER_ACCESS_TOKEN,
    accessTokenSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET
  };

  const twitter = new Twitter(twitterConfig);
  this.twitter = twitter;
  return twitter;
};
