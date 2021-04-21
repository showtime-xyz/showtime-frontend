import Iron from "@hapi/iron";
import CookieService from "../../lib/cookie";

export default async (req, res) => {
  let user = null;
  let data_activity = { data: [] };
  const body = JSON.parse(req.body);
  const page = body.page || 1;
  const activityTypeId = body.activityTypeId || 0;
  const limit = body.limit || 5;

  try {
    let publicAddress;
    try {
      user = await Iron.unseal(
        CookieService.getAuthToken(req.cookies),
        process.env.ENCRYPTION_SECRET_V2,
        Iron.defaults
      );
      publicAddress = user.publicAddress;
    } catch (err) {
      if (page > 3) {
        res.statusCode = 200;
        res.json(data_activity);
      }
    }

    const res_activity = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/activity?page=${page}&type_id=${activityTypeId}&limit=${limit}`,
      {
        headers: {
          "X-Authenticated-User": publicAddress,
          "X-API-Key": process.env.SHOWTIME_FRONTEND_API_KEY_V2,
        },
      }
    );
    data_activity = await res_activity.json();
  } catch {}

  res.statusCode = 200;
  res.json(data_activity);
};
