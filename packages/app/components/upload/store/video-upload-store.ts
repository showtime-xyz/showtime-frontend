import { Platform } from "react-native";

import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";
import * as tus from "tus-js-client";
import { proxy, ref } from "valtio";

import { Alert } from "@showtime-xyz/universal.alert";

import { axios } from "app/lib/axios";

import { toast } from "design-system/toast";

import TusFileReader from "../classes/filereader";
import { PresignPayload, SignUploadPayload } from "../types/types";
import { VideoUploadStoreState } from "../types/types";

export const videoUploadStore = proxy<VideoUploadStoreState>({
  videoPath: null,
  uploadProgress: 0,
  isUploading: false,
  uploadInstance: ref(new tus.Upload(new Blob(), {})),
  takeVideo: async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      toast.error("No permissions granted");
      return false;
    }
    const video = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      videoMaxDuration: 600, // 10 minutes
      allowsEditing: true,
      selectionLimit: 1,
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
      toast.error("No permissions granted");
      return false;
    }
    const video = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: true,
      videoMaxDuration: 600, // 10 minutes
      selectionLimit: 1,
    });

    if (video.canceled) {
      return false;
    }
    videoUploadStore.videoPath = video.assets[0];
    return true;
  },
  chooseVideo: async () => {
    const video = await DocumentPicker.getDocumentAsync({
      type: ["video/mp4"],
    });
    if (video.canceled) {
      return false;
    }

    videoUploadStore.videoPath = video.assets[0];
    return true;
  },
  signUpload: async (payload?: SignUploadPayload) => {
    if (videoUploadStore.videoPath === null) {
      return false;
    }

    const unloadListener = (event: BeforeUnloadEvent) => {
      event.returnValue = `Are you sure you want to leave?`;
    };

    const cleanUp = () => {
      videoUploadStore.uploadProgress = 0;
      videoUploadStore.isUploading = false;
      globalThis?.gc?.();
      if (Platform.OS === "web" && typeof window !== "undefined") {
        window.removeEventListener("beforeunload", unloadListener);
      }
    };

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
        (videoUploadStore.videoPath as DocumentPicker.DocumentPickerAsset)
          .size ||
        file.size;

      const options: tus.UploadOptions = {
        endpoint: "https://video.bunnycdn.com/tusupload",
        retryDelays: [0, 3000, 5000, 10000, 20000],
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

          cleanUp();
        },
        onProgress: function (bytesUploaded, bytesTotal) {
          const percentage = ((bytesUploaded / bytesTotal) * 100).toFixed(2);
          //console.log(bytesUploaded, bytesTotal, percentage + "%");

          videoUploadStore.uploadProgress = Number(percentage);
          globalThis?.gc?.();
        },
        onSuccess: function () {
          //console.log("Upload finished");
          toast.success("Upload finished");

          cleanUp();
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
          if (Platform.OS === "web" && typeof window !== "undefined") {
            window.addEventListener("beforeunload", unloadListener);
          }
        });
    } catch (e) {
      toast.error("Something went wrong");
      cleanUp();
    }
  },
  abortUpload: () => {
    Alert.alert("Abort upload?", "Are you sure you want to abort the upload?", [
      {
        text: "Cancel",
      },
      {
        text: "Abort",
        style: "destructive",
        onPress: async () => {
          videoUploadStore.uploadInstance.abort();
          videoUploadStore.uploadProgress = 0;
          videoUploadStore.isUploading = false;
          globalThis?.gc?.();

          toast.error("Upload aborted");
        },
      },
    ]);
  },
});
