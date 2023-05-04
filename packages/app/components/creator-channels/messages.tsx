import { Avatar } from "@showtime-xyz/universal.avatar";
import { InfiniteScrollList } from "@showtime-xyz/universal.infinite-scroll-list";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

export const Messages = () => {
  return (
    <View tw="flex-1">
      <InfiniteScrollList
        data={new Array(100).fill(0).map(() => ({
          username: "username",
          text: "this is a text broadcasted by username. This can really long long long",
        }))}
        estimatedItemSize={20}
        renderItem={MessageItem}
      />
    </View>
  );
};

type MessageItemProps = {
  item: {
    username: string;
    text: string;
  };
};

const MessageItem = (props: MessageItemProps) => {
  const { username, text } = props.item;
  return (
    <View tw="mb-5 px-4">
      <View tw="flex-row" style={{ columnGap: 8 }}>
        <Avatar size={24} />
        <View tw="flex-1" style={{ rowGap: 8 }}>
          <Text tw="text-sm font-bold">{username}</Text>
          <Text tw="text-sm">{text}</Text>
        </View>
      </View>
    </View>
  );
};
