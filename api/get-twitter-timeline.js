require('now-env');
const fetch = require('isomorphic-unfetch');
const { parse } = require('url');
const twitterAPI = require('./utils/twitter-api')();

module.exports = async (req, res) => {
  const { query } = parse(req.url, true);
  const { max_id, screen_name } = query;
  const params = { screen_name };

  if (process.env.NODE_ENV === 'development') {
    res.setHeader('Access-Control-Allow-Origin', `*`);
  }

  if (
    max_id &&
    typeof max_id !== 'undefined' &&
    max_id !== 'null' &&
    isFinite(max_id)
  ) {
    params.max_id = max_id;
  }

  twitterAPI.getUserTimeline(
    params,
    err => {
      console.log(err);
      res.statusCode = 404;
      res.end(`Failed to fetch twitter timeline for user ${screen_name}`);
    },
    async resp => {
      const data = JSON.parse(resp);

      for (let item of data) {
        if (
          item.entities.urls.length > 0 &&
          item.entities.urls[0].expanded_url
        ) {
          item.entities.urls[0].hasPreview = true;
        }
      }

      const dataString = JSON.stringify(data);

      res.statusCode = 200;
      res.end(dataString);
    }
  );
};
