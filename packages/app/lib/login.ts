import { MMKV } from "react-native-mmkv";

export function setLogin(login: string) {
  const storage = new MMKV();
  storage.set("login", login);
}

export function getLogin() {
  const storage = new MMKV();
  return storage.getString("login");
}

export function deleteLogin() {
  const storage = new MMKV();
  storage.delete("login");
}
