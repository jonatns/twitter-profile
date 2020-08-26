import { Twitter } from 'twitter-node-client';

class TwitterAPI {
  constructor() {
    if (!this.client) {
      this.client = new Twitter({
        consumerKey: process.env.TWITTER_CONSUMER_KEY,
        consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
        accessToken: process.env.TWITTER_ACCESS_TOKEN,
        accessTokenSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
      });
    }
  }

  getUserTimeline(params = {}) {
    return new Promise((resolve, reject) => {
      this.client.getUserTimeline(params, reject, resolve);
    });
  }

  getCustomApiCall(url, params = {}) {
    return new Promise((resolve, reject) => {
      this.client.getCustomApiCall(url, params, reject, resolve);
    });
  }
}

export default TwitterAPI;
