import { memo } from "react";
import { useCallback } from "react";

import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";

import { Gallery, MusicBadge, Photo } from "@showtime-xyz/universal.icon";
import { Pressable } from "@showtime-xyz/universal.pressable";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import { Logger } from "app/lib/logger";

import { toast } from "design-system/toast";

import { useSendChannelMessage } from "../hooks/use-send-channel-message";
import { LeanText } from "./lean-text";

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
      async ({
        file,
        mimeType,
        width,
        height,
      }: {
        file: string;
        mimeType?: string;
        width?: number;
        height?: number;
      }) => {
        try {
          await sendMessage.trigger({
            channelId,
            isUserAdmin,
            message: "",
            attachment: file,
            mimeType,
            width,
            height,
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
          type: [
            "audio/mp3",
            "audio/x-m4a",
            "audio/wav",
            "audio/m4a",
            "audio/mpeg",
          ],
          copyToCacheDirectory: true,
          multiple: false,
        });

        if (file.canceled === false) {
          uploadFile({
            file: file.assets[0].uri,
            mimeType: file.assets[0].mimeType,
          });
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
        base64: false,
      });

      if (!file.canceled) {
        uploadFile({
          file: file.assets[0].uri,
          // expo-image-picker doesn't return mimeType but fake it as jpeg
          // we detect it on web though, this is only used for native
          mimeType: "image/jpeg",
          width: file.assets[0].width,
          height: file.assets[0].height,
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
          base64: false,
        });

        if (!file.canceled) {
          uploadFile({
            file: file.assets[0].uri,
            mimeType: "image/jpeg",
            width: file.assets[0].width,
            height: file.assets[0].height,
          });
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
      <View tw="web:justify-start web:gap-4 flex-row items-center justify-around px-8 pt-2">
        <Pressable
          tw="web:py-1 flex-row items-center justify-center rounded-full bg-gray-100 px-4 py-2"
          onPress={pickAudio}
        >
          <MusicBadge height={20} width={20} color={"black"} />
          <LeanText tw="pl-1">Music</LeanText>
        </Pressable>
        <Pressable
          tw="web:py-1 flex-row items-center justify-center rounded-full bg-gray-100 px-4 py-2 "
          onPress={pickImage}
        >
          <Gallery height={20} width={20} color={"black"} />
          <LeanText tw="pl-1">Photo</LeanText>
        </Pressable>
        <Pressable
          tw="web:hidden web:py-1 flex-row items-center justify-center rounded-full bg-gray-100 px-4 py-2 "
          onPress={takePicture}
        >
          <Photo height={20} width={20} color={"black"} />
          <LeanText tw="pl-1">Camera</LeanText>
        </Pressable>
      </View>
    );
  }
);

MessageInputToolbar.displayName = "MessageInputToolbar";
