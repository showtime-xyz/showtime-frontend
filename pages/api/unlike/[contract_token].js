import Iron from "@hapi/iron";
import CookieService from "../../../lib/cookie";

export default async (req, res) => {
  const contract_token = req.query.contract_token;

  const [contract_address, token_id] = contract_token.split("_");

  try {
    const user = await Iron.unseal(
      CookieService.getAuthToken(req.cookies),
      process.env.ENCRYPTION_SECRET,
      Iron.defaults
    );

    await fetch(
      `${process.env.BACKEND_URL}/v1/token/${contract_address}/${token_id}`,
      {
        method: "POST",
        headers: {
          UserAddress: user.publicAddress,
          "Content-Type": "application/json",
          "X-API-Key": process.env.SHOWTIME_FRONTEND_API_KEY,
        },
        body: JSON.stringify({
          action: "unlike",
        }),
      }
    );
  } catch (error) {
    console.log(error);
  }

  res.statusCode = 200;
  res.end();
};
