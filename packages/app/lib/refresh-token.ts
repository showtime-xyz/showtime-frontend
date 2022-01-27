import { MMKV } from "react-native-mmkv";

const storage = new MMKV();
const tokenKey = "refresh-token";

export function setRefreshToken(token: string) {
  storage.set(tokenKey, token);
}

export function getRefreshToken() {
  return storage.getString(tokenKey);
}

export function deleteRefreshToken() {
  storage.delete(tokenKey);
}
