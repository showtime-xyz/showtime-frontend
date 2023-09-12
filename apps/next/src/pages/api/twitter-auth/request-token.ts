import { NextApiRequest, NextApiResponse } from "next";

const Twitter = require("twitter-lite");

const twitter = new Twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  twitter
    .getRequestToken(req.query.callback_url)
    .then((response) => {
      res.json(response);
    })
    .catch((error) => {
      res.status(500).json({ message: error.message });
    });
}
