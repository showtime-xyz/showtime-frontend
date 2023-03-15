import FastImage from "react-native-fast-image";
import ImageColors from "react-native-image-colors";
import { MMKV } from "react-native-mmkv";

export async function deleteAppCache() {
  const storage = new MMKV();
  storage.delete("app-cache");
  // Todo: move those keys to constans file
  storage.delete("showExplanationv2");
  storage.delete("showClaimExplanation");
  await FastImage.clearDiskCache();
  await FastImage.clearMemoryCache();
  ImageColors.cache.clear();
}
