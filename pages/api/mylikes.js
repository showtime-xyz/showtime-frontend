import Iron from "@hapi/iron";
import CookieService from "../../lib/cookie";

export default async (req, res) => {
  let user = null;
  let data_mylikes = { data: [] };

  try {
    user = await Iron.unseal(
      CookieService.getAuthToken(req.cookies),
      process.env.ENCRYPTION_SECRET,
      Iron.defaults
    );

    const res_mylikes = await fetch(
      `${process.env.BACKEND_URL}/v1/mylikes?address=${user.publicAddress}`
    );
    data_mylikes = await res_mylikes.json();
  } catch {}

  res.statusCode = 200;
  res.json(data_mylikes);
};
