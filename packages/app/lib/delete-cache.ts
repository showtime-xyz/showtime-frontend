import { Image } from "expo-image";
import { MMKV } from "react-native-mmkv";

export async function deleteAppCache() {
  const storage = new MMKV();
  storage.delete("app-cache");
  await Image.clearDiskCache();
  await Image.clearMemoryCache();
}
