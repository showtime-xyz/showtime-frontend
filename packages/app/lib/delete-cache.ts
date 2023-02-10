import FastImage from "react-native-fast-image";
import { MMKV } from "react-native-mmkv";

export async function deleteAppCache() {
  const storage = new MMKV();
  storage.delete("app-cache");
  await FastImage.clearDiskCache();
  await FastImage.clearMemoryCache();
}
