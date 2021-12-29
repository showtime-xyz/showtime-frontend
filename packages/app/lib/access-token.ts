import { MMKV } from "react-native-mmkv";

export function setAccessToken(token: string) {
  const storage = new MMKV();
  storage.set("access-token", token);
}

export function getAccessToken() {
  const storage = new MMKV();
  return storage.getString("access-token");
}

export function deleteAccessToken() {
  const storage = new MMKV();
  storage.delete("access-token");
}
