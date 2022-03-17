import { MMKV } from "react-native-mmkv";

const logoutStorage = new MMKV();
const LOGOUT_STORAGE_KEY = "logout";

export function setLogout(logout: string) {
  logoutStorage.set(LOGOUT_STORAGE_KEY, logout);
}

export function getLogout() {
  return logoutStorage.getString(LOGOUT_STORAGE_KEY);
}

export function deleteLogout() {
  logoutStorage.delete(LOGOUT_STORAGE_KEY);
}
