import { useState, useRef } from "react";

import { Avatar } from "@showtime-xyz/universal.avatar";
import { ArrowLeft } from "@showtime-xyz/universal.icon";
import { InfiniteScrollList } from "@showtime-xyz/universal.infinite-scroll-list";
import { useSafeAreaInsets } from "@showtime-xyz/universal.safe-area";
import Spinner from "@showtime-xyz/universal.spinner";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

type HeaderProps = {
  username: string;
  members: number;
};

const Header = (props: HeaderProps) => {
  return (
    <View tw="flex-row p-4" style={{ columnGap: 8 }}>
      <View tw="flex-row items-center" style={{ columnGap: 8 }}>
        <ArrowLeft height={24} width={24} color={"black"} />
        <Avatar size={34} />
      </View>
      <View tw="flex-1" style={{ rowGap: 8 }}>
        <Text tw="text-sm font-bold">{props.username}</Text>
        <Text tw="text-xs">{props.members} members</Text>
      </View>
    </View>
  );
};

const total = new Array(1000).fill(0).map((_, i) => ({
  username: "nishan",
  id: i,
  text: i + 1 + ". " + randomSentenceGenerator(10, 50),
}));

export const Messages = () => {
  const insets = useSafeAreaInsets();
  const [v, setV] = useState<any>(total.slice(0, 20));
  const loading = useRef(false);
  const [isLoading, setIsLoading] = useState(false);

  const onLoadMore = () => {
    if (loading.current) return;
    setIsLoading(true);
    loading.current = true;

    setTimeout(() => {
      const newV = total.slice(v.length, v.length + 20);

      setV((prevV: any) => {
        return [...prevV, ...newV];
      });
      setIsLoading(false);
      loading.current = false;
    }, 2000);
  };

  return (
    <View
      tw="flex-1"
      style={{
        paddingTop: insets.top,
      }}
    >
      <Header username="nishan" members={29} />
      <InfiniteScrollList
        data={v}
        onEndReached={onLoadMore}
        inverted
        useWindowScroll={false}
        estimatedItemSize={20}
        renderItem={MessageItem}
        contentContainerStyle={{ paddingTop: insets.bottom }}
        ListFooterComponent={
          isLoading
            ? () => (
                <View tw="w-full items-center py-4">
                  <Spinner size="small" />
                </View>
              )
            : () => null
        }
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
          <View tw="flex-row items-baseline" style={{ columnGap: 8 }}>
            <Text tw="text-sm font-bold">{username}</Text>
            <Text tw="text-xs text-gray-700">12:00 PM</Text>
          </View>

          <Text tw="text-sm">{text}</Text>
        </View>
      </View>
    </View>
  );
};

function getRandomWord() {
  const words =
    "lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua".split(
      " "
    );
  return words[Math.floor(Math.random() * words.length)];
}

function randomSentenceGenerator(minWords: number, maxWords: number) {
  const sentenceLength =
    Math.floor(Math.random() * (maxWords - minWords + 1)) + minWords;
  let sentence = "";

  for (let i = 0; i < sentenceLength; i++) {
    sentence += getRandomWord() + " ";
  }

  // Capitalize the first letter and add a period at the end
  sentence = sentence.charAt(0).toUpperCase() + sentence.slice(1).trim() + ".";

  return sentence;
}
