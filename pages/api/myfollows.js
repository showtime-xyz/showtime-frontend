import Iron from "@hapi/iron";
import CookieService from "../../lib/cookie";

export default async (req, res) => {
  let user = null;
  let data_myfollows = { data: [] };

  try {
    user = await Iron.unseal(
      CookieService.getAuthToken(req.cookies),
      process.env.ENCRYPTION_SECRET,
      Iron.defaults
    );

    const res_myfollows = await fetch(
      `${process.env.BACKEND_URL}/v1/myfollows?address=${user.publicAddress}`,
      {
        headers: {
          "X-API-Key": process.env.SHOWTIME_FRONTEND_API_KEY,
        },
      }
    );
    data_myfollows = await res_myfollows.json();
  } catch {}

  res.statusCode = 200;
  res.json(data_myfollows);
};
