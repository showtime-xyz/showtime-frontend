import { serialize } from "cookie";

const TOKEN_NAME = "api_token";
const MAX_AGE = 60 * 60 * 24 * 365; //60 * 60 * 8;

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

function setTokenCookie(res, token) {
  res.setHeader("Set-Cookie", [
    createCookie(TOKEN_NAME, token),
    createCookie("authed", true, { httpOnly: false }),
  ]);
}

function getAuthToken(cookies) {
  return cookies[TOKEN_NAME];
}

export default { setTokenCookie, getAuthToken };
