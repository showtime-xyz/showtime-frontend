import handler from "@/lib/api-handler";
import backend from "@/lib/backend";

export default handler().post(
  async ({ user, body: { nft_id, description, activity_id } }, res) => {
    await backend.post(
      "/v2/reportitem",
      { nft_id, description, activity_id },
      {
        headers: {
          "X-Authenticated-User": user?.publicAddress || "undefined", // Django is dumb ¯\_(ツ)_/¯
          "X-API-Key": process.env.SHOWTIME_FRONTEND_API_KEY_V2,
        },
      }
    );

    res.status(200).end();
  }
);
