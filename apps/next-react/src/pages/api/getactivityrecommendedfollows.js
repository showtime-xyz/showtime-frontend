import handler from "@/lib/api-handler";
import backend from "@/lib/backend";
import backendscripts from "@/lib/backend-scripts";

export default handler().post(async ({ body: { recache }, user }, res) => {
  const headers = {
    "X-Authenticated-User": user?.publicAddress || null,
    "X-API-Key": process.env.SHOWTIME_FRONTEND_API_KEY_V2,
  };

  await (recache
    ? backendscripts.post(
        "/api/v1/get_follow_suggestions?recache=1",
        {},
        { headers }
      )
    : backend.post("/v1/get_follow_suggestions", {}, { headers })
  ).then((resp) => res.json(resp.data));
});
