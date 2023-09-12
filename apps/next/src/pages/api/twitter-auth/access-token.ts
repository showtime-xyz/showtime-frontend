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
  const options = {
    oauth_token: req.query.oauth_token,
    oauth_token_secret: req.query.oauth_token_secret,
    oauth_verifier: req.query.oauth_verifier,
  };

  twitter
    .getAccessToken(options)
    .then((response) => {
      res.json(response);
    })
    .catch((error) => {
      res.status(500).json({ message: error.message });
    });
}
