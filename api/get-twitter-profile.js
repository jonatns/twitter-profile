require("now-env");
const { parse } = require("url");
const Twitter = require("twitter-node-client").Twitter;

module.exports = (req, res) => {
  const twitterConfig = {
    consumerKey: process.env.TWITTER_CONSUMER_KEY,
    consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
    accessToken: process.env.TWITTER_ACCESS_TOKEN,
    accessTokenSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET
  };

  const twitter = new Twitter(twitterConfig);
  const { query } = parse(req.url, true);

  return new Promise((resolve, reject) => {
    twitter.getCustomApiCall(
      "/users/show.json",
      { screen_name: query.screen_name },
      err => {
        reject(err);
      },
      data => {
        resolve(JSON.parse(data));
      }
    );
  });
};
