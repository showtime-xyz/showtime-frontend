import { flagDefs } from "@/hooks/useFlags";
import CookieService from "@/lib/cookie";
import Iron from "@hapi/iron";
import { withSentry, captureException } from "@sentry/nextjs";
import jwt_decode from "jwt-decode";
import nc from "next-connect";

import backend from "./backend";

export default () =>
  nc({
    onError: (err, req, res, next) => {
      // Due to how the Sentry integration works, successful requests throw the request as an exception. Weird, I know.
      if (err == req) return next();

      if (process.env.NODE_ENV === "development") {
        console.error(err);
        if (err.response.data.error.code === 429)
          return res.status(429).json(err.response.data.error);
        return res.status(500).json(err.response);
      }

      if (err.response?.data?.error?.code === 429)
        return res.status(429).send(err.response.data.error);
      res.status(500).send("Internal Server Error");
    },
  })
    .use((req, res, next) => withSentry(next)(req, res))
    .use(async (req, _, next) => {
      // TODO: This entire use-case will be deprecated once full JWT is implemented.
      try {
        const sealedRefreshTokenCookie = CookieService.getRefreshToken(
          req.cookies
        );
        if (sealedRefreshTokenCookie) {
          const { refreshToken } = await Iron.unseal(
            sealedRefreshTokenCookie,
            process.env.ENCRYPTION_SECRET_V2,
            Iron.defaults
          );
          const decodedRefreshToken = jwt_decode(refreshToken);
          const hasAddress = decodedRefreshToken?.address;
          // TODO: Will be swapped for client side access token
          req.user = hasAddress
            ? { publicAddress: decodedRefreshToken.address }
            : undefined;
        }
      } catch (error) {
        if (process.env.NODE_ENV === "development") {
          console.error(error);
        }
        //TODO: update this in notion
        captureException(error, {
          tags: {
            refresh_token: "api-handler.js",
          },
        });
      }

      next();
    });

export const middleware = {
  auth: async (req, res, next) => {
    // The line 74 code will continue to work because we patched the above middleware. This middleware will ago away alongside it.

    if (!req.user) return res.status(401).json({ error: "Unauthenticated." });

    next();
  },
  flags:
    (flags) =>
    async ({ user }, res, next) => {
      const profile = await backend
        .get("/v2/myinfo", {
          headers: {
            "X-Authenticated-User": user.publicAddress,
            "X-Authenticated-Email": user.email || null,
            "X-API-Key": process.env.SHOWTIME_FRONTEND_API_KEY_V2,
          },
        })
        .then(({ data: { data } }) => data.profile);

      if (
        flags.map((flagKey) => flagDefs[flagKey](profile)).filter((el) => !el)
          .length > 0
      ) {
        return res.status(403).json({ error: "Unauthorized." });
      }

      next();
    },
  guest: ({ user }, res, next) => {
    if (user)
      return res.status(401).json({ error: "User is already authenticated." });

    next();
  },
};
