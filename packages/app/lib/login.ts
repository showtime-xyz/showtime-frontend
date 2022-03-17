import { MMKV } from "react-native-mmkv";

const loginStorage = new MMKV();
const LOGIN_STORAGE_KEY = "login";

export function setLogin(login: string) {
  loginStorage.set(LOGIN_STORAGE_KEY, login);
}

export function getLogin() {
  return loginStorage.getString(LOGIN_STORAGE_KEY);
}

export function deleteLogin() {
  loginStorage.delete(LOGIN_STORAGE_KEY);
}
