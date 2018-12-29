const { parse } = require('url');
const twitterAPI = require('./utils/twitter-api')();

module.exports = async (req, res) => {
  const { query } = parse(req.url, true);
  const { max_id, screen_name } = query;
  const params = { screen_name };

  if (max_id && typeof max_id !== 'undefined' && max_id !== 'null' && isFinite(max_id)) {
    params.max_id = max_id;
  }

  twitterAPI.getUserTimeline(
    params,
    err =>
      res.end(
        JSON.stringify({
          status: 'fail'
        })
      ),
    data => res.end(JSON.stringify({ data, status: 'success' }))
  );
};
