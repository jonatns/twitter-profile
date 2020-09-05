import TwitterAPI from '../../utils/twitter-api';

const twitterClient = new TwitterAPI();

const handler = async (req, res) => {
  const { screen_name } = req.query;

  try {
    const data = await twitterClient.getCustomApiCall('/users/show.json', {
      screen_name,
    });

    res.status(200).json(data);
  } catch (err) {
    console.log(err);
    res.status(400);
    res.end(`Failed to fetch twitter profile for user ${screen_name}`);
  }
};

export default handler;
