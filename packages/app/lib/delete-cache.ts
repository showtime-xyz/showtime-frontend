import { Image } from "expo-image";
import ImageColors from "react-native-image-colors";
import { MMKV } from "react-native-mmkv";

export async function deleteAppCache() {
  const storage = new MMKV();
  storage.delete("app-cache");
  // Todo: move those keys to constans file
  storage.delete("showExplanationv2");
  storage.delete("showClaimExplanation");
  await Image.clearDiskCache();
  await Image.clearMemoryCache();
  ImageColors.cache.clear();
}
