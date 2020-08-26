require('now-env');
import TwitterAPI from '../../utils/twitter-api';

const twitterClient = new TwitterAPI();

const handler = async (req, res) => {
  const { max_id, screen_name } = req.query;
  const params = { screen_name };

  if (
    max_id &&
    typeof max_id !== 'undefined' &&
    max_id !== 'null' &&
    isFinite(max_id)
  ) {
    params.max_id = max_id;
  }

  try {
    const rawData = await twitterClient.getUserTimeline(params);
    const data = JSON.parse(rawData);

    for (let item of data) {
      if (item.entities.urls.length > 0 && item.entities.urls[0].expanded_url) {
        item.entities.urls[0].hasPreview = true;
      }
    }

    res.status(200).json(data);
  } catch (err) {
    console.log(err);
    res.status(404);
    res.end(`Failed to fetch twitter timeline for user ${screen_name}`);
  }
};

export default handler;
