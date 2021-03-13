import Iron from "@hapi/iron";
import CookieService from "../../lib/cookie";

export default async (req, res) => {
  try {
    const user = await Iron.unseal(
      CookieService.getAuthToken(req.cookies),
      process.env.ENCRYPTION_SECRET,
      Iron.defaults
    );

    const body = JSON.parse(req.body);
    const nftId = body.nftId;
    const message = body.message;

    await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/newcomment/${nftId}`,
      {
        method: "POST",
        headers: {
          "X-Authenticated-User": user.publicAddress,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message }),
      }
    );
  } catch (error) {
    console.log(error);
  }

  res.statusCode = 200;
  res.end();
};
