import { useState } from "react";

import { Modal } from "@showtime-xyz/universal.modal";
import { Pressable } from "@showtime-xyz/universal.pressable";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import { reactionEmojis } from "./constants";

export const MessageReactions = () => {
  const [showUserList, setShowUserList] = useState(false);
  return (
    <View tw="max-w-[300px] flex-[5] flex-row justify-between">
      {reactionEmojis.map((emoji) => {
        return (
          <Pressable key={emoji} onPress={() => setShowUserList(!showUserList)}>
            <Text tw="text-xs text-gray-700 dark:text-gray-200">
              {emoji} 1.2k
            </Text>
          </Pressable>
        );
      })}
      {showUserList && <MessageReactionModal />}
    </View>
  );
};

const MessageReactionModal = () => {
  return (
    <Modal title="Reactions">
      <Text>Hello</Text>
    </Modal>
  );
};
