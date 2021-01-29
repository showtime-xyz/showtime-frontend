import Iron from "@hapi/iron";
import CookieService from "../../lib/cookie";

export default async (req, res) => {
  try {
    const user = await Iron.unseal(
      CookieService.getAuthToken(req.cookies),
      process.env.ENCRYPTION_SECRET,
      Iron.defaults
    );

    await fetch(`${process.env.BACKEND_URL}/v1/editname`, {
      method: "POST",
      headers: {
        UserAddress: user.publicAddress,
        "Content-Type": "application/json",
        "X-API-Key": process.env.SHOWTIME_FRONTEND_API_KEY,
      },
      body: req.body,
    });
  } catch (error) {
    console.log(error);
  }

  res.statusCode = 200;
  res.end();
};
