import { MMKV } from "react-native-mmkv";

export const store = new MMKV();

export const SHOWN_CREATOR_CHANNEL_INTRO = "showCreatorChannelIntro";

export const getIsShowCreatorChannelIntro = () => {
  return !store.getBoolean(SHOWN_CREATOR_CHANNEL_INTRO);
};

export const setHideCreatorChannelIntro = (value = true) => {
  return store.set(SHOWN_CREATOR_CHANNEL_INTRO, value);
};

export const SHOWN_INTRO_BANNER = "showIntroBanner";

export const getIsShowIntroBanner = () => {
  return !store.getBoolean(SHOWN_INTRO_BANNER);
};
export const setHideShowIntroBanner = (value = true) => {
  return store.set(SHOWN_INTRO_BANNER, value);
};
