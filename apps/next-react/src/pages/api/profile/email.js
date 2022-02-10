import handler, { middleware } from "@/lib/api-handler";
import backend from "@/lib/backend";
import { Magic } from "@magic-sdk/admin";

export default handler()
  .use(middleware.auth)
  .post(async ({ user, headers: { authorization } }, res) => {
    // exchange the did from Magic for some user data
    const new_user = await new Magic(
      process.env.MAGIC_SECRET_KEY
    ).users.getMetadataByToken(authorization.split("Bearer").pop().trim());

    await backend.post(
      "/v1/addwallet",
      {
        address: new_user.publicAddress,
        email: new_user.email,
      },
      {
        headers: {
          "X-Authenticated-User": user.publicAddress,
          "X-API-Key": process.env.SHOWTIME_FRONTEND_API_KEY_V2,
        },
      }
    );

    res.status(200).end();
  });
