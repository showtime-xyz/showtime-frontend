import { MMKV } from "react-native-mmkv";

const refreshTokenStorage = new MMKV();
const REFRESH_TOKEN_KEY = "refresh-token";

export function setRefreshToken(token: string) {
  return refreshTokenStorage.set(REFRESH_TOKEN_KEY, token);
}

export function getRefreshToken() {
  return refreshTokenStorage.getString(REFRESH_TOKEN_KEY);
}

export function deleteRefreshToken() {
  return refreshTokenStorage.delete(REFRESH_TOKEN_KEY);
}
