import { Magic } from "@magic-sdk/admin";
import Iron from "@hapi/iron";
import CookieService from "../../lib/cookie";

export default async (req, res) => {
  if (req.method !== "POST") return res.status(405).end();

  try {
    const user = await Iron.unseal(
      CookieService.getAuthToken(req.cookies),
      process.env.ENCRYPTION_SECRET_V2,
      Iron.defaults
    );

    // exchange the did from Magic for some user data
    const did = req.headers.authorization.split("Bearer").pop().trim();
    const new_user = await new Magic(
      process.env.MAGIC_SECRET_KEY
    ).users.getMetadataByToken(did);

    await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/addwallet`, {
      method: "POST",
      headers: {
        "X-Authenticated-User": user.publicAddress,
        "X-API-Key": process.env.SHOWTIME_FRONTEND_API_KEY_V2,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        address: new_user.publicAddress,
        email: new_user.email,
      }),
    });
  } catch (error) {
    console.log(error);
  }

  res.end();
};
