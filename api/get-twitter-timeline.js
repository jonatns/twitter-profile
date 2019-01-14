const fetch = require('isomorphic-unfetch');
const { parse } = require('url');
const twitterAPI = require('./utils/twitter-api')();

const fetchLinkPreview = url => {
  return fetch(
    `https://page.rest/fetch?token=${process.env.PAGE_REST_TOKEN}&url=${url}`
  ).then(response => response.json());
};

module.exports = async (req, res) => {
  console.time('get-twitter-timeline');

  const { query } = parse(req.url, true);
  const { max_id, screen_name } = query;
  const params = { screen_name };

  if (
    max_id &&
    typeof max_id !== 'undefined' &&
    max_id !== 'null' &&
    isFinite(max_id)
  ) {
    params.max_id = max_id;
  }

  res.setHeader('Content-Type', `application/json`);

  twitterAPI.getUserTimeline(
    params,
    err => {
      console.log(err);
      res.statusCode = 404;
      res.end(`Failed to fetch twitter timeline for user ${screen_name}`);
    },
    async resp => {
      const data = JSON.parse(resp);
      const promises = [];
      const indexes = [];

      for (let index = 0; index < data.length; index++) {
        if (
          data[index].entities.urls.length > 0 &&
          data[index].entities.urls[0].expanded_url
        ) {
          promises.push(
            fetchLinkPreview(data[index].entities.urls[0].expanded_url)
          );
          indexes.push(index);
        }
      }

      const previews = await Promise.all(promises);

      for (let index = 0; index < indexes.length; index++) {
        data[indexes[index]].entities.urls[0].preview = previews[index];
      }

      const dataString = JSON.stringify(data);

      console.timeEnd('get-twitter-timeline');

      res.statusCode = 200;
      res.end(dataString);
    }
  );
};
