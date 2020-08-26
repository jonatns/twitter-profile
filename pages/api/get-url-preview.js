require('now-env');
import { getLinkPreview } from 'link-preview-js';

const handler = async (req, res) => {
  const { url } = req.query;

  try {
    const data = await getLinkPreview(url);
    res.status(200).json(data);
  } catch (err) {
    console.log('Err');

    console.log(err);
    res.status(404);
    res.end(`Failed to fetch url preview for ${url}`);
  }
};

export default handler;
