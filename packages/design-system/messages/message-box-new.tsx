import { useState } from "react";
import { ViewStyle } from "react-native";

import { Button, TextInput, View } from "design-system";
import { Avatar } from "design-system/avatar";
import { Send } from "design-system/icon";
import { tw } from "design-system/tailwind";

interface MessageBoxProps {
  userAvatar?: string;
  style?: ViewStyle;
  onSubmit?: (text: string) => void;
}

export function MessageBox({ userAvatar, style, onSubmit }: MessageBoxProps) {
  const [value, setValue] = useState("");

  //#region callbacks
  const handleTextChange = (text: string) => setValue(text);
  const handleSubmit = () => onSubmit?.(value);
  //#endregion

  return (
    <View tw="flex-row py-4 items-center bg-white dark:bg-black" style={style}>
      <View tw="flex-1 mr-2">
        <TextInput
          value={value}
          placeholder="Add a comment..."
          placeholderTextColor={
            tw.style("text-gray-500 dark:text-gray-400").color as string
          }
          multiline={true}
          keyboardType="twitter"
          returnKeyType="send"
          tw="py-3 pr-3 pl-[44px] rounded-[32px] text-base text-black dark:text-white bg-gray-100 dark:bg-gray-900"
          onChangeText={handleTextChange}
          onSubmitEditing={handleSubmit}
        />
        <Avatar tw="absolute mt-3.5 ml-3" size={24} url={userAvatar} />
      </View>
      <Button size="regular" iconOnly={true} onPress={handleSubmit}>
        <Send />
      </Button>
    </View>
  );
}
