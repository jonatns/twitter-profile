require('now-env');
const fetch = require('isomorphic-unfetch');

module.exports = async (req, res) => {
  const { parse } = require('url');
  const { query } = parse(req.url, true);
  const { url } = query;

  if (process.env.NODE_ENV === 'development') {
    res.setHeader('Access-Control-Allow-Origin', `*`);
  }

  try {
    const resp = await fetch(
      `https://page.rest/fetch?token=${process.env.PAGE_REST_TOKEN}&url=${url}`
    );
    const data = await resp.json();
    const dataString = JSON.stringify(data);

    res.statusCode = 200;
    res.end(dataString);
  } catch (err) {
    console.log(err);
    res.statusCode = 404;
    res.end(`Failed to fetch url preview for ${url}`);
  }
};
