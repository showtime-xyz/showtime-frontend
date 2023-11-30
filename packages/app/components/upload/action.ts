import { Platform } from "react-native";

import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";
import * as tus from "tus-js-client";
import { proxy, ref } from "valtio";

import { axios } from "app/lib/axios";

import { toast } from "design-system/toast";

import TusFileReader from "./FileReader";
import { PresignPayload, SignUploadPayload } from "./types";
import { videoUploadStore } from "./video-upload-store";

export const takeVideo = async () => {
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
};

export const pickVideo = async () => {
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
};

export const chooseVideo = async () => {
  const video = await DocumentPicker.getDocumentAsync({
    type: ["video/mp4"],
  });
  if (video.canceled) {
    return false;
  }

  videoUploadStore.videoPath = video.assets[0];
  return true;
};

export const signUpload = async (payload?: SignUploadPayload) => {
  if (videoUploadStore.videoPath === null) {
    return false;
  }

  videoUploadStore.isUploading = true;
  try {
    const result: PresignPayload = await axios({
      method: "POST",
      url: "/v1/posts/create",
      data: {
        ...payload?.data,
      },
    });

    const fileObject = videoUploadStore.videoPath;
    let file = new Blob();

    if (Platform.OS === "web") {
      const base64Data = fileObject.uri.split(",")[1];
      const buffer = Buffer.from(base64Data, "base64");
      file = new Blob([buffer], { type: "video/mp4" });
    }

    const size =
      (videoUploadStore.videoPath as ImagePicker.ImagePickerAsset).fileSize ||
      (videoUploadStore.videoPath as DocumentPicker.DocumentPickerAsset).size ||
      file.size;

    const options: tus.UploadOptions = {
      endpoint: "https://video.bunnycdn.com/tusupload",
      retryDelays: [0, 3000],
      chunkSize: 5 * 1024 * 1024,
      uploadLengthDeferred: !size || size === 0,
      headers: {
        AuthorizationSignature: result.signature, // SHA256 signature (library_id + api_key + expiration_time + video_id)
        AuthorizationExpire: String(result.expiration), // Expiration time as in the signature,
        VideoId: result.guid, // The guid of a previously created video object through the Create Video API call
        LibraryId: result.library_id,
      },
      ...(Platform.OS !== "web"
        ? {
            fileReader: new TusFileReader(),
            uploadSize: size,
          }
        : {
            parallelUploads: 5,
          }),

      onError: function () {
        toast.error("Upload failed. Please retry.");
        const as = "/upload/composer";
        payload?.router.push(
          Platform.select({
            native: as,
            web: {
              pathname: payload?.router.pathname,
              query: {
                ...payload?.router.query,
                uploadComposerModal: true,
              },
            } as any,
          }),
          Platform.select({ native: as, web: payload?.router.asPath }),
          {
            shallow: true,
          }
        );

        videoUploadStore.uploadProgress = 0;
        videoUploadStore.isUploading = false;
        globalThis?.gc?.();
      },
      onProgress: function (bytesUploaded, bytesTotal) {
        const percentage = ((bytesUploaded / bytesTotal) * 100).toFixed(2);
        console.log(bytesUploaded, bytesTotal, percentage + "%");

        videoUploadStore.uploadProgress = Number(percentage);
        globalThis?.gc?.();
      },
      onSuccess: function () {
        console.log("Upload finished");
        toast.success("Upload finished");

        videoUploadStore.uploadProgress = 0;
        videoUploadStore.isUploading = false;
        globalThis?.gc?.();
      },
      onShouldRetry: function (err) {
        const status = (err as tus.DetailedError).originalResponse
          ? (err as tus.DetailedError)?.originalResponse?.getStatus()
          : 0;
        // If the status is a 403 or 404, we dont want to retry
        if (status === 403 || status === 404) {
          return false;
        }

        // For any other status code, tus-js-client should retry.
        return true;
      },
    };

    videoUploadStore.uploadInstance = ref(
      new tus.Upload(
        Platform.OS === "web" ? file : (fileObject as unknown as File),
        options
      )
    );

    videoUploadStore.uploadInstance
      .findPreviousUploads()
      .then(function (previousUploads) {
        // Found previous uploads so we select the first one.
        if (previousUploads.length) {
          videoUploadStore.uploadInstance.resumeFromPreviousUpload(
            previousUploads[0]
          );
        }
        // Start the upload
        videoUploadStore.uploadInstance.start();
      });
  } catch (e) {
    toast.error("Something went wrong");
    videoUploadStore.uploadProgress = 0;
    videoUploadStore.isUploading = false;
  }
};
