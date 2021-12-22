import CookieService from "@/lib/cookie";
import handler, { middleware } from "@/lib/api-handler";

export default handler()
  .use(middleware.auth)
  .post(async (req, res) => {
    CookieService.expireTokenCookie(res);

    res.end();
  });
