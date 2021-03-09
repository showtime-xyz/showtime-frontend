import Iron from "@hapi/iron";
import CookieService from "../../../lib/cookie";

export default async (req, res) => {
  const { nft_list } = req.query;
  const nft_id = nft_list[0];
  const list_id = nft_list[1];

  try {
    const user = await Iron.unseal(
      CookieService.getAuthToken(req.cookies),
      process.env.ENCRYPTION_SECRET,
      Iron.defaults
    );

    await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/unhide_nft/${nft_id}/${list_id}`,
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
