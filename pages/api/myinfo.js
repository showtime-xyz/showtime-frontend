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

    //console.log(user);
    let email = null;
    if (user.email) {
      email = user.email;
    }

    //console.log(email);

    const res_myinfo = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/v2/myinfo`,
      {
        headers: {
          UserAddress: user.publicAddress,
          UserEmail: email,
        },
      }
    );
    data_myinfo = await res_myinfo.json();
  } catch {}

  res.statusCode = 200;
  res.json(data_myinfo);
};
