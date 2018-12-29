require("now-env");
const Twitter = require("twitter-node-client").Twitter;

module.exports = (req, res) => {
  const { query } = parse(req.url, true);
  const { max_id, screen_name } = query;
  const params = { screen_name };

  if (
    max_id &&
    typeof max_id !== "undefined" &&
    max_id !== "null" &&
    isFinite(max_id)
  ) {
    params.max_id = max_id;
  }

  const twitterConfig = {
    consumerKey: process.env.TWITTER_CONSUMER_KEY,
    consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
    accessToken: process.env.TWITTER_ACCESS_TOKEN,
    accessTokenSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET
  };

  const twitter = new Twitter(twitterConfig);

  return new Promise((resolve, reject) => {
    twitter.getUserTimeline(
      params,
      err => {
        reject(err);
      },
      data => {
        resolve(JSON.parse(data));
      }
    );
  });
};
