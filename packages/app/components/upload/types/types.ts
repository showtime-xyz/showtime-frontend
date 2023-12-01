import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";
import * as tus from "tus-js-client";

export type SignUploadPayload = {
  data?: {
    description?: string;
  };
  router: any;
};

export interface VideoUploadStoreState {
  videoPath:
    | ImagePicker.ImagePickerAsset
    | DocumentPicker.DocumentPickerAsset
    | null;
  uploadProgress: number;
  isUploading: boolean;
  takeVideo: () => Promise<boolean>;
  pickVideo: () => Promise<boolean>;
  chooseVideo: () => Promise<boolean>;
  signUpload: (payload?: SignUploadPayload) => Promise<void | boolean>;
  uploadInstance: tus.Upload;
  abortUpload: () => void;
}

export type PresignPayload = {
  direct_url: string;
  expiration: number;
  guid: string;
  id: string;
  library_id: string;
  signature: string;
};

export interface VideoThumbnailProps {
  videoUri?: string;
  timeFrame?: number;
}
