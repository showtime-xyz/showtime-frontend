import handler, { middleware } from "@/lib/api-handler";
import CookieService from "@/lib/cookie";

export default handler()
  .use(middleware.auth)
  .post(async (req, res) => {
    CookieService.expireTokenCookie(res);

    res.end();
  });
