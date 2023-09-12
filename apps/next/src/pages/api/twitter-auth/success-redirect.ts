import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { state, ...otherParams } = req.query;
  const redirectUri = decodeURIComponent(state as string);
  //@ts-ignore
  const queryString = new URLSearchParams(otherParams).toString();
  res.redirect(`${redirectUri}?${queryString}`);
}
