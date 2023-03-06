import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const redirectURI = req.query.state as string;
  const authCode = req.query.code as string;
  if (redirectURI && authCode) {
    const decodedRedirectURI = decodeURIComponent(redirectURI);
    res.redirect(302, decodedRedirectURI + "?code=" + authCode);
    return;
  }

  res.status(401).send("Unauthorized");
}
