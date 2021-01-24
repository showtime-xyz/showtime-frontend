import Iron from "@hapi/iron";
import CookieService from "../../lib/cookie";

export default async (req, res) => {
  if (req.method !== "POST") return res.status(405).end();

  // exchange the did from Magic for some user data
  const publicAddress = req.headers.authorization.split("Bearer").pop().trim();
  const user = {
    publicAddress: publicAddress,
  };

  // Author a couple of cookies to persist a user's session
  const token = await Iron.seal(
    user,
    process.env.ENCRYPTION_SECRET,
    Iron.defaults
  );
  CookieService.setTokenCookie(res, token);

  res.end();
};
