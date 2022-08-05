import type { NextApiRequest, NextApiResponse } from "next";

const BUNDLE_ID = "io.showtime";
const TEAM_ID = "88TKHB268W";

const association = {
  applinks: {
    apps: [],
    details: [
      {
        appID: `${TEAM_ID}.${BUNDLE_ID}`,
        paths: ["/nft/*", "/t/*", "/@*", "/profile/*", "/"],
      },
    ],
  },
};

export default (_: NextApiRequest, response: NextApiResponse) => {
  return response.status(200).send(association);
};
