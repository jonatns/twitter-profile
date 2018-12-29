const { parse } = require('url');
const twitterAPI = require('./utils/twitter-api')();

module.exports = async (req, res) => {
  const { query } = parse(req.url, true);

  twitterAPI.getCustomApiCall(
    '/users/show.json',
    { screen_name: query.screen_name },
    err =>
      res.end(
        JSON.stringify({
          status: 'fail'
        })
      ),
    data => res.end(JSON.stringify({ data, status: 'success' }))
  );
};
