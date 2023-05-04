import { Avatar } from "@showtime-xyz/universal.avatar";
import { InfiniteScrollList } from "@showtime-xyz/universal.infinite-scroll-list";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

export const Messages = () => {
  return (
    <View tw="flex-1">
      <InfiniteScrollList
        data={new Array(100).fill(100)}
        estimatedItemSize={20}
        renderItem={MessageItem}
      />
    </View>
  );
};

const MessageItem = () => {
  return (
    <View tw="mb-5 px-4">
      <View tw="flex-row" style={{ columnGap: 8 }}>
        <Avatar size={24} />
        <View style={{ rowGap: 8 }}>
          <Text tw="text-sm font-bold">Username</Text>
          <Text tw="text-sm">This is the text message. It can be long too</Text>
        </View>
      </View>
    </View>
  );
};
