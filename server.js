const express = require("express");
const next = require("next");
const Twitter = require("twitter-node-client").Twitter;
const {
  parsed: {
    TWITTER_CONSUMER_KEY,
    TWITTER_CONSUMER_SECRET,
    TWITTER_ACCESS_TOKEN,
    TWITTER_ACCESS_TOKEN_SECRET,
    TWITTER_CALLBACK_URL
  }
} = require("dotenv").config();

console.log(TWITTER_CONSUMER_KEY);

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

const twitterConfig = {
  consumerKey: TWITTER_CONSUMER_KEY,
  consumerSecret: TWITTER_CONSUMER_SECRET,
  accessToken: TWITTER_ACCESS_TOKEN,
  accessTokenSecret: TWITTER_ACCESS_TOKEN_SECRET,
  callBackUrl: TWITTER_CALLBACK_URL
};

const twitter = new Twitter(twitterConfig);

app
  .prepare()
  .then(() => {
    const server = express();

    server.get("/twitter/profile", (req, res) => {
      twitter.getCustomApiCall(
        "/users/show.json",
        { screen_name: req.query.screen_name },
        err => {
          console.log("ERROR [%s]", err);
        },
        data => {
          res.status(200).json(JSON.parse(data));
        }
      );
    });

    server.get("/twitter/timeline", (req, res) => {
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
          console.log("ERROR [%s]", err);
        },
        data => {
          res.status(200).json(JSON.parse(data));
        }
      );
    });

    server.get("*", (req, res) => {
      return handle(req, res);
    });

    server.listen(3000, err => {
      if (err) throw err;
      console.log("> Ready on http://localhost:3000");
    });
  })
  .catch(ex => {
    console.error(ex.stack);
    process.exit(1);
  });
