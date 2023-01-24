import FastImage from "react-native-fast-image";
import { MMKV } from "react-native-mmkv";

export function deleteCache() {
  const storage = new MMKV();
  storage.delete("app-cache");
}
export async function deleteAppCache() {
  deleteCache();
  await FastImage.clearDiskCache();
  await FastImage.clearMemoryCache();
}
