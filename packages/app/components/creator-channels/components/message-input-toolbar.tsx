import { memo } from "react";
import { useCallback } from "react";

import * as DocumentPicker from "expo-document-picker";

import { Pressable } from "@showtime-xyz/universal.pressable";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

export const MessageInputToolbar = memo(() => {
  const selectDocument = useCallback(async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: ["audio/mp3"],
      copyToCacheDirectory: true,
      multiple: false,
    });

    console.log(result);

    if (result.canceled === false) {
      console.log(result.assets[0].uri);
    }
  }, []);

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
});

MessageInputToolbar.displayName = "MessageInputToolbar";
