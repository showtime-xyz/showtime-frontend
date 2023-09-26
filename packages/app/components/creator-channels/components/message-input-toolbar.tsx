import { memo } from "react";
import { useCallback } from "react";

import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";
import { Audio, clearCache } from "react-native-compressor";

import { Pressable } from "@showtime-xyz/universal.pressable";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import { getAccessToken } from "app/lib/access-token";

const accessToken = getAccessToken();
const headers = {
  Authorization: `Bearer ${accessToken}`,
};

export const MessageInputToolbar = memo(
  ({ channelId }: { channelId: string | number }) => {
    const selectDocument = useCallback(async () => {
      const file = await DocumentPicker.getDocumentAsync({
        type: ["audio/*"],
        copyToCacheDirectory: true,
        multiple: false,
      });

      console.log(file);

      if (file.canceled === false) {
        const result = await Audio.compress(file.assets[0].uri, {
          quality: "high",
        });

        try {
          const uploadResult = await FileSystem.uploadAsync(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/channels/${channelId}/attachment/upload`,
            result,
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
          console.log("Failed", error);
        }
      }
    }, [channelId]);

    return (
      <View tw="h-12 flex-row items-center justify-around">
        <Pressable
          tw="rounded-full bg-gray-100 px-5 py-2"
          onPress={selectDocument}
        >
          <Text>Music</Text>
        </Pressable>
        <Pressable tw="rounded-full bg-gray-100 px-5 py-2">
          <Text>Photo</Text>
        </Pressable>
        <Pressable tw="rounded-full bg-gray-100 px-5 py-2">
          <Text>Camera</Text>
        </Pressable>
      </View>
    );
  }
);

MessageInputToolbar.displayName = "MessageInputToolbar";
