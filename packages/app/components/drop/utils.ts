import { MMKV } from "react-native-mmkv";

export const DROP_FORM_DATA_KEY = "drop_form_local_data_free";
export const MUSIC_DROP_FORM_DATA_KEY = "drop_form_local_data_music";

export const clearPersistedForms = () => {
  const store = new MMKV();
  store.delete(DROP_FORM_DATA_KEY);
  store.delete(MUSIC_DROP_FORM_DATA_KEY);
};
