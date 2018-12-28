require("now-env");
const Twitter = require("twitter-node-client").Twitter;

const twitterConfig = {
  consumerKey: process.env.TWITTER_CONSUMER_KEY,
  consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
  accessToken: process.env.TWITTER_ACCESS_TOKEN,
  accessTokenSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET
};

const twitter = new Twitter(twitterConfig);

module.exports = (req, res) => {
  twitter.getCustomApiCall(
    "/users/show.json",
    { screen_name: req.query.screen_name },
    err => {
      res.status(400).send(err);
    },
    data => {
      res.status(200).send(JSON.parse(data));
    }
  );
};
