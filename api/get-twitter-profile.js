require('now-env');
const { parse } = require('url');
const twitterAPI = require('./utils/twitter-api')();

module.exports = async (req, res) => {
  const { query } = parse(req.url, true);
  const { screen_name } = query;

  if (process.env.NODE_ENV === 'development') {
    res.setHeader('Access-Control-Allow-Origin', `*`);
  }

  twitterAPI.getCustomApiCall(
    '/users/show.json',
    { screen_name },
    err => {
      console.log(err);
      res.statusCode = 400;
      res.end(`Failed to fetch twitter profile for user ${screen_name}`);
    },
    data => {
      res.statusCode = 200;
      res.end(data);
    }
  );
};
