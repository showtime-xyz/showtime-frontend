import { useState } from "react";

import * as Clipboard from "expo-clipboard";

import { Button } from "@showtime-xyz/universal.button";
import { Text } from "@showtime-xyz/universal.text";
import { TextInput } from "@showtime-xyz/universal.text-input";
import { View } from "@showtime-xyz/universal.view";

export const EnterInviteCodeModal = () => {
  const [inviteCode, setInviteCode] = useState("");
  return (
    <View tw="px-4">
      <Text tw="text-xl font-bold text-gray-900 dark:text-white">
        Enter invite code to launch your creator token
      </Text>
      <View tw="flex-row items-center justify-between py-6">
        <View tw="mr-4 flex-1 rounded-md bg-gray-200 p-4 dark:bg-gray-700">
          <TextInput value={inviteCode} onChangeText={setInviteCode} />
        </View>
        <Text
          onPress={async () => {
            const code = await Clipboard.getStringAsync();
            setInviteCode(code);
          }}
          tw="text-sm text-indigo-700"
        >
          Paste
        </Text>
      </View>
      <Button size="regular" onPress={() => {}}>
        Review token
      </Button>
    </View>
  );
};
