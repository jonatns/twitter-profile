require("now-env");
const Twitter = require("twitter-node-client").Twitter;

module.exports = (req, res) => {
  const twitterConfig = {
    consumerKey: process.env.TWITTER_CONSUMER_KEY,
    consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
    accessToken: process.env.TWITTER_ACCESS_TOKEN,
    accessTokenSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET
  };

  const twitter = new Twitter(twitterConfig);

  return new Promise((resolve, reject) => {
    twitter.getCustomApiCall(
      "/users/show.json",
      { screen_name: "jonat_ns" },
      err => resolve(err),
      data => resolve(JSON.parse(data))
    );
  });
};
