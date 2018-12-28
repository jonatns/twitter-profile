const app = require("express")();
const cors = require("cors");
const Twitter = require("twitter-node-client").Twitter;
require("now-env");

const dev = process.env.NODE_ENV !== "production";

const twitterConfig = {
  consumerKey: process.env.TWITTER_CONSUMER_KEY,
  consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
  accessToken: process.env.TWITTER_ACCESS_TOKEN,
  accessTokenSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET
};

const twitter = new Twitter(twitterConfig);

app.use(cors());

app.get("/twitter/profile", (req, res) => {
  twitter.getCustomApiCall(
    "/users/show.json",
    { screen_name: req.query.screen_name },
    err => {
      res.status(400).json();
      console.log("ERROR [%s]", err);
    },
    data => {
      res.status(200).json(JSON.parse(data));
    }
  );
});

app.get("/twitter/timeline", (req, res) => {
  const { max_id, screen_name } = req.query;

  const params = { screen_name };

  if (
    max_id &&
    typeof max_id !== "undefined" &&
    max_id !== "null" &&
    isFinite(max_id)
  ) {
    params.max_id = max_id;
  }

  twitter.getUserTimeline(
    params,
    err => {
      res.status(400).json([]);
      console.log("ERROR [%s]", err);
    },
    data => {
      res.status(200).json(JSON.parse(data));
    }
  );
});

app.listen(process.env.PORT || 8000, err => {
  if (err) throw err;
  console.log("> Ready on http://localhost:8000");
});
