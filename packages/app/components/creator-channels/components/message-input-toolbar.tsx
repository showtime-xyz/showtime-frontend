import { memo } from "react";
import { useCallback } from "react";

import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";
import { Audio, Image } from "react-native-compressor";

import { Gallery, MusicBadge, Photo } from "@showtime-xyz/universal.icon";
import { Pressable } from "@showtime-xyz/universal.pressable";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import { Logger } from "app/lib/logger";

import { toast } from "design-system/toast";

import { useSendChannelMessage } from "../hooks/use-send-channel-message";

export const MessageInputToolbar = memo(
  ({
    channelId,
    isUserAdmin,
  }: {
    channelId: string;
    isUserAdmin?: boolean;
  }) => {
    const sendMessage = useSendChannelMessage(channelId, true);

    const uploadFile = useCallback(
      async ({ file, mimeType }: { file: string; mimeType?: string }) => {
        try {
          await sendMessage.trigger({
            channelId,
            isUserAdmin,
            message: "",
            attachment: file,
            mimeType,
          });
        } catch (error) {
          toast.error("Failed to send media file");
          Logger.error("Failed upload", error);
        }
      },
      [channelId, isUserAdmin, sendMessage]
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

          uploadFile({ file: result, mimeType: file.assets[0].mimeType });
        }
      } catch (error) {
        toast.error("Failed to upload audio file");
        Logger.error(error);
      }
    }, [uploadFile]);

    const pickImage = useCallback(async () => {
      // No permissions request is necessary for launching the image library
      const file = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        allowsMultipleSelection: false,
        quality: 1,
      });

      if (!file.canceled) {
        const compressedImage = await Image.compress(file.assets[0].uri, {
          quality: 0.8,
        });
        uploadFile({
          file: compressedImage,
          // expo-image-picker doesn't return mimeType but fake it as jpeg
          mimeType: "image/jpeg",
        });
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
        const file = await ImagePicker.launchCameraAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: false,
          allowsMultipleSelection: false,
          quality: 1,
        });

        if (!file.canceled) {
          const compressedImage = await Image.compress(file.assets[0].uri, {
            quality: 0.8,
          });
          uploadFile({ file: compressedImage, mimeType: "image/jpeg" });
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
