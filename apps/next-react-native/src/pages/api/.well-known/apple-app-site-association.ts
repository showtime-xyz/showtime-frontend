import type { NextApiRequest, NextApiResponse } from "next";

const BUNDLE_ID = "io.showtime";
const TEAM_ID = "88TKHB268W";

const association = {
  applinks: {
    apps: [],
    details: [
      {
        appID: `${TEAM_ID}.${BUNDLE_ID}`,
        paths: [
          // this makes every path open your app
          // this is often not desired
          // see the Apple docs to configure this with granularity
          "/nft/*",
          "/",
        ],
      },
    ],
  },
};

export default (_: NextApiRequest, response: NextApiResponse) => {
  return response.status(200).send(association);
};
