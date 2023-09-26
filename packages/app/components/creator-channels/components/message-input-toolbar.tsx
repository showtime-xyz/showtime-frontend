import { memo } from "react";
import { useCallback } from "react";

import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";
import * as ImagePicker from "expo-image-picker";
import { Audio, Image } from "react-native-compressor";

import { Gallery, MusicBadge, Photo } from "@showtime-xyz/universal.icon";
import { Pressable } from "@showtime-xyz/universal.pressable";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import { getAccessToken } from "app/lib/access-token";
import { Logger } from "app/lib/logger";

import { toast } from "design-system/toast";

const accessToken = getAccessToken();
const headers = {
  Authorization: `Bearer ${accessToken}`,
};

export const MessageInputToolbar = memo(
  ({ channelId }: { channelId: string | number }) => {
    const uploadFile = useCallback(
      async (file: any) => {
        try {
          const uploadResult = await FileSystem.uploadAsync(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/channels/${channelId}/attachment/upload`,
            file,
            {
              uploadType: FileSystem.FileSystemUploadType.MULTIPART,
              sessionType: FileSystem.FileSystemSessionType.BACKGROUND,
              fieldName: "file",
              httpMethod: "POST",
              headers,
            }
          );

          console.log(uploadResult);
        } catch (error) {
          toast.error("Failed to send media file");
          Logger.error("Failed upload", error);
        }
      },
      [channelId]
    );

    const pickAudio = useCallback(async () => {
      try {
        const file = await DocumentPicker.getDocumentAsync({
          type: ["audio/*"],
          copyToCacheDirectory: true,
          multiple: false,
        });

        if (file.canceled === false) {
          const result = await Audio.compress(file.assets[0].uri, {
            quality: "high",
          });

          uploadFile(result);
        }
      } catch (error) {
        toast.error("Failed to upload audio file");
        Logger.error(error);
      }
    }, [uploadFile]);

    const pickImage = useCallback(async () => {
      // No permissions request is necessary for launching the image library
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        allowsMultipleSelection: false,
        quality: 1,
      });

      if (!result.canceled) {
        const compressedImage = await Image.compress(result.assets[0].uri, {
          quality: 0.8,
        });
        uploadFile(compressedImage);
      }
    }, [uploadFile]);

    const takePicture = useCallback(async () => {
      // No permissions request is necessary for launching the image library

      try {
        const permission = await ImagePicker.getCameraPermissionsAsync();
        if (!permission.granted) {
          const permissionResult =
            await ImagePicker.requestCameraPermissionsAsync();
          if (!permissionResult.granted) {
            toast.error("Failed to upload image file");
            return;
          }
        }
        let result = await ImagePicker.launchCameraAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: false,
          allowsMultipleSelection: false,
          quality: 1,
        });

        if (!result.canceled) {
          const compressedImage = await Image.compress(result.assets[0].uri, {
            quality: 0.8,
          });
          uploadFile(compressedImage);
        }
      } catch (error: any) {
        toast.error(
          error?.message ||
            "An error occurred. Check if you granted permission to access the camera"
        );
        Logger.error(error);
      }
    }, [uploadFile]);

    return (
      <View tw="h-12 flex-row items-center justify-around">
        <Pressable
          tw="flex-row items-center justify-center rounded-full bg-gray-100 px-4 py-2"
          onPress={pickAudio}
        >
          <MusicBadge height={20} width={20} color={"black"} />
          <Text tw="pl-1">Music</Text>
        </Pressable>
        <Pressable
          tw="flex-row items-center justify-center rounded-full bg-gray-100 px-4 py-2"
          onPress={pickImage}
        >
          <Gallery height={20} width={20} color={"black"} />
          <Text tw="pl-1">Photo</Text>
        </Pressable>
        <Pressable
          tw="flex-row items-center justify-center rounded-full bg-gray-100 px-4 py-2"
          onPress={takePicture}
        >
          <Photo height={20} width={20} color={"black"} />
          <Text tw="pl-1">Camera</Text>
        </Pressable>
      </View>
    );
  }
);

MessageInputToolbar.displayName = "MessageInputToolbar";
