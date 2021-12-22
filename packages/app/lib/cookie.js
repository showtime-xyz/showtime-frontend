import { serialize } from "cookie";

const REFRESH_TOKEN_NAME = "r_t";
// TODO: Confirm this is a year
const MAX_AGE = 60 * 60 * 24 * 365; // 60 * 60 * 8;

function createCookie(name, data, options = {}) {
  return serialize(name, data, {
    maxAge: MAX_AGE,
    expires: new Date(Date.now() + MAX_AGE * 1000),
    secure: process.env.NODE_ENV === "production",
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    ...options,
  });
}

function setTokenCookie({ res, sealedRefreshToken }) {
  const cookieArray = [
    sealedRefreshToken
      ? createCookie(REFRESH_TOKEN_NAME, sealedRefreshToken)
      : null,
  ].filter(Boolean);
  res.setHeader("Set-Cookie", cookieArray);
}

function getRefreshToken(cookies) {
  return cookies[REFRESH_TOKEN_NAME];
}

function expireTokenCookie(res) {
  res.setHeader("Set-Cookie", [
    createCookie(REFRESH_TOKEN_NAME, null, {
      maxAge: 0,
      expires: new Date(Date.now() - 1000),
    }),
  ]);
}

export default { setTokenCookie, expireTokenCookie, getRefreshToken };
