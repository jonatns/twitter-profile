const chromium = require('chrome-aws-lambda');
const puppeteer = require('puppeteer-core');
const { parse } = require('url');

module.exports = async (req, res) => {
  const { query } = parse(req.url, true);

  const browser = await puppeteer.launch({
    args: chromium.args,
    defaultViewport: chromium.defaultViewport,
    executablePath: await chromium.executablePath,
    headless: chromium.headless
  });
  const page = await browser.newPage();
  await page.goto(query.url);

  const meta = await page.evaluate(() => {
    const metas = document.getElementsByTagName('meta');
    let metaObj = { title: null, description: null, image: null };

    try {
      metaObj.title = (
        document.querySelector('meta[name="twitter:title"]') || document.querySelector('meta[property="twitter:title"]')
      ).getAttribute('content');
    } catch {
      metaObj.title = document.title;
    }

    for (let meta of metas) {
      if (
        meta.getAttribute('property') === 'twitter:description' ||
        meta.getAttribute('name') === 'twitter:description'
      ) {
        metaObj.description = meta.getAttribute('content');
      }
      if (meta.getAttribute('property') === 'twitter:image' || meta.getAttribute('name') === 'twitter:image:src') {
        metaObj.image = meta.getAttribute('content');
      }
    }

    return metaObj;
  });

  const faviconUrl = await page.evaluate(() => {
    const faviconElement = document.querySelector('link[rel*="icon"]');

    return faviconElement && faviconElement.getAttribute('href');
  });

  if (!meta.image) {
    try {
      meta.image = new URL(faviconUrl, query.url);
    } catch (e) {
      return new Error(`error creating URL ${e}`);
    }
  }

  await browser.close();

  res.end(JSON.stringify({ ...meta }));
};
