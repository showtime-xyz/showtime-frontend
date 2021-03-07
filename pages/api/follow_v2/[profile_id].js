import Iron from "@hapi/iron";
import CookieService from "../../../lib/cookie";

export default async (req, res) => {
  const profile_id = req.query.profile_id;

  try {
    const user = await Iron.unseal(
      CookieService.getAuthToken(req.cookies),
      process.env.ENCRYPTION_SECRET,
      Iron.defaults
    );

    await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/v2/follow/${profile_id}`,
      {
        method: "POST",
        headers: {
          "X-Authenticated-User": user.publicAddress,
          "X-API-Key": process.env.SHOWTIME_FRONTEND_API_KEY,
        },
      }
    );
  } catch (error) {
    console.log(error);
  }

  res.statusCode = 200;
  res.end();
};
