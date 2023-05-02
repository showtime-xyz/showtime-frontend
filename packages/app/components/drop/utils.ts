import { MMKV } from "react-native-mmkv";

import { FileStorage } from "app/lib/file-storage/file-storage";

export const DROP_FORM_DATA_KEY = "drop_form_local_data_free";
export const MUSIC_DROP_FORM_DATA_KEY = "drop_form_local_data_music-v2";

export const clearPersistedForms = () => {
  const store = new MMKV();
  store.delete(DROP_FORM_DATA_KEY);
  new FileStorage(DROP_FORM_DATA_KEY).clearStorage();

  store.delete(MUSIC_DROP_FORM_DATA_KEY);
  new FileStorage(MUSIC_DROP_FORM_DATA_KEY).clearStorage();
};
