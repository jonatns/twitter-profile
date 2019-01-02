const fetch = require('isomorphic-unfetch');
const { parse } = require('url');
const twitterAPI = require('./utils/twitter-api')();

const fetchLinkPreview = async url => {
  const resp = await fetch(`https://page.rest/fetch?token=${process.env.PAGE_REST_TOKEN}&url=${url}`);
  return resp.json();
};

module.exports = async (req, res) => {
  const { query } = parse(req.url, true);
  const { max_id, screen_name } = query;
  const params = { screen_name };

  if (max_id && typeof max_id !== 'undefined' && max_id !== 'null' && isFinite(max_id)) {
    params.max_id = max_id;
  }

  res.setHeader('Content-Type', `application/json`);

  twitterAPI.getUserTimeline(
    params,
    err => {
      res.statusCode = 404;
      res.end(`Failed to fetch twitter timeline for user ${screen_name}`);
    },
    async resp => {
      const data = JSON.parse(resp);
      for (let [index, value] of data.entries()) {
        if (value.entities.urls.length > 0 && value.entities.urls[0].expanded_url) {
          let preview = await fetchLinkPreview(value.entities.urls[0].expanded_url);
          data[index].entities.urls[0].preview = preview;
        }
      }

      res.statusCode = 200;
      res.end(JSON.stringify(data));
    }
  );
};
