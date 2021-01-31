import Iron from "@hapi/iron";
import CookieService from "../../../lib/cookie";

export default async (req, res) => {
  const tid = req.query.tid;

  try {
    const user = await Iron.unseal(
      CookieService.getAuthToken(req.cookies),
      process.env.ENCRYPTION_SECRET,
      Iron.defaults
    );

    await fetch(`${process.env.BACKEND_URL}/v2/unlike/${tid}`, {
      method: "POST",
      headers: {
        UserAddress: user.publicAddress,
        "X-API-Key": process.env.SHOWTIME_FRONTEND_API_KEY,
      },
    });
  } catch (error) {
    console.log(error);
  }

  res.statusCode = 200;
  res.end();
};
