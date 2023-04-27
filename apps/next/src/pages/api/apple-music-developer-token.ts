import type { NextApiRequest, NextApiResponse } from "next";

import { axios } from "app/lib/axios";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const token = await axios({
    url: "/v1/apple_music/get-dev-token",
    method: "GET",
  });
  const developerToken = token.developer_token;
  res.json({ developer_token: developerToken });
}
