import Iron from "@hapi/iron";
import CookieService from "../../lib/cookie";

export default async (req, res) => {
  let user = null;
  let data_activity = { data: [] };
  const body = JSON.parse(req.body);
  const page = body.page || 1;

  try {
    user = await Iron.unseal(
      CookieService.getAuthToken(req.cookies),
      process.env.ENCRYPTION_SECRET_V2,
      Iron.defaults
    );

    //console.log(user);
    let email = null;
    if (user.email) {
      email = user.email;
    }

    const res_activity = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/activity?page=${page}`,
      {
        headers: {
          "X-Authenticated-User": user.publicAddress,
          "X-Authenticated-Email": email,
          "X-API-Key": process.env.SHOWTIME_FRONTEND_API_KEY_V2,
        },
      }
    );
    data_activity = await res_activity.json();
  } catch {}

  res.statusCode = 200;
  res.json(data_activity);
};
