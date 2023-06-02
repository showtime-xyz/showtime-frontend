import { MMKV } from "react-native-mmkv";

export function deleteAppCache() {
  const storage = new MMKV();
  localStorage.removeItem("app-cache");
  localStorage.removeItem("showExplanationv2");
  // TODO: showClaimExplanation is not used anymore, remove soon
  localStorage.removeItem("showClaimExplanation");
  storage.delete("showCreatorChannelTip");
  storage.delete("showCreatorChannelIntro");
}
