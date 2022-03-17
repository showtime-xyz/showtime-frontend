import handler, { middleware } from "@/lib/api-handler";
import backend from "@/lib/backend";
import CookieService from "@/lib/cookie";
import Iron from "@hapi/iron";
import { captureException } from "@sentry/nextjs";

export default handler()
  .use(middleware.guest)
  .use(async ({ body: { email }, headers: { authorization } }, res) => {
    if (!email || !authorization)
      return res.status(400).json({ error: "Email or DID not specified." });

    try {
      const did = authorization.split("Bearer").pop().trim();
      const loginResponse = await backend.post(
        "/v1/login_magic",
        {
          email,
        },
        {
          headers: {
            Authorization: did,
          },
        }
      );

      const accessToken = loginResponse?.data?.access;
      const refreshToken = loginResponse?.data?.refresh;
      const validResponse = accessToken && refreshToken;

      if (validResponse) {
        const sealedRefreshToken = await Iron.seal(
          { refreshToken },
          process.env.ENCRYPTION_SECRET_V2,
          Iron.defaults
        );
        CookieService.setTokenCookie({
          res,
          sealedRefreshToken,
        });
      } else {
        throw "Response did not return access and refresh token";
      }

      res.status(200).json({ access: accessToken });
    } catch (error) {
      console.error(error);

      captureException(error, {
        tags: {
          login_magic_flow: "magic.js",
        },
      });
    }
    res.end();
  });
