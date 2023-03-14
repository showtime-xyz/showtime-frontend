import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const redirectURI = req.query.state as string;
  const authCode = req.query.code as string;
  const error = req.query.error as string;
  const error_reason = req.query.error_reason as string;
  const error_description = req.query.error_description as string;
  if (redirectURI && authCode) {
    const decodedRedirectURI = decodeURIComponent(redirectURI);
    let redirectPath = decodedRedirectURI + "?code=" + authCode;

    if (error) redirectPath += `&error=${error}`;

    if (error_reason) redirectPath += `&error_reason=${error_reason}`;

    if (error_description)
      redirectPath += `&error_description=${error_description}`;

    res.redirect(302, redirectPath);
    return;
  }

  res.status(401).send("Unauthorized");
}
