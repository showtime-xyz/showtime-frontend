import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";
import { proxy } from "valtio";

interface VideoUploadStoreState {
  videoPath:
    | ImagePicker.ImagePickerAsset
    | DocumentPicker.DocumentPickerAsset
    | null;
  takeVideo: () => Promise<boolean>;
  pickVideo: () => Promise<boolean>;
  chooseVideo: () => Promise<boolean>;
}

export const videoUploadStore = proxy<VideoUploadStoreState>({
  videoPath: null,
  takeVideo: async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      alert("Sorry, we need camera permissions to make this work!");
      return false;
    }
    const video = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
    });
    if (video.canceled) {
      return false;
    }
    videoUploadStore.videoPath = video.assets[0];
    return true;
  },
  pickVideo: async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Sorry, we need media library permissions to make this work!");
      return false;
    }
    const video = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: true,
      aspect: [9, 16],
    });
    if (video.canceled) {
      return false;
    }
    videoUploadStore.videoPath = video.assets[0];
    return true;
  },
  chooseVideo: async () => {
    const video = await DocumentPicker.getDocumentAsync({
      type: ["video/mp4", "video/quicktime", "video/x-m4v"],
    });
    if (video.canceled) {
      return false;
    }
    console.log(video);

    videoUploadStore.videoPath = video.assets[0];
    return true;
  },
});
