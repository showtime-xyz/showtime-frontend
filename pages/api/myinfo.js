import Iron from "@hapi/iron";
import CookieService from "../../lib/cookie";

export default async (req, res) => {
  let user = null;
  let data_myinfo = { data: [] };

  try {
    user = await Iron.unseal(
      CookieService.getAuthToken(req.cookies),
      process.env.ENCRYPTION_SECRET,
      Iron.defaults
    );

    const res_myinfo = await fetch(`${process.env.BACKEND_URL}/v2/myinfo`, {
      headers: {
        UserAddress: user.publicAddress,
      },
    });
    data_myinfo = await res_myinfo.json();
  } catch {}

  res.statusCode = 200;
  res.json(data_myinfo);
};
