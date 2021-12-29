import { MMKV } from "react-native-mmkv";

export function deleteCache() {
  const storage = new MMKV();
  storage.delete("app-cache");
}
