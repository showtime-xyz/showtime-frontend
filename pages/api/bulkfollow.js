import Iron from "@hapi/iron";
import CookieService from "../../lib/cookie";

export default async (req, res) => {
  try {
    const user = await Iron.unseal(
      CookieService.getAuthToken(req.cookies),
      process.env.ENCRYPTION_SECRET_V2,
      Iron.defaults
    );

    await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/bulkfollow`, {
      method: "POST",
      headers: {
        "X-Authenticated-User": user.publicAddress,
        "X-API-Key": process.env.SHOWTIME_FRONTEND_API_KEY_V2,
        "Content-Type": "application/json",
      },
      body: req.body,
    });
  } catch (error) {
    console.log(error);
  }

  res.statusCode = 200;
  res.end();
};
