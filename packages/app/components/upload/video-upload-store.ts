import * as tus from "tus-js-client";
import { proxy, ref } from "valtio";

import {
  chooseVideo,
  pickVideo,
  signUpload,
  takeVideo,
  abortUpload,
} from "./action";
import { VideoUploadStoreState } from "./types";

export const videoUploadStore = proxy<VideoUploadStoreState>({
  videoPath: null,
  uploadProgress: 0,
  isUploading: false,
  uploadInstance: ref(new tus.Upload(new Blob(), {})),
  takeVideo,
  pickVideo,
  chooseVideo,
  signUpload,
  abortUpload,
});
