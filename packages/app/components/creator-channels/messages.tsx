import { Avatar } from "@showtime-xyz/universal.avatar";
import { useIsDarkMode } from "@showtime-xyz/universal.hooks";
import { ArrowLeft } from "@showtime-xyz/universal.icon";
import { InfiniteScrollList } from "@showtime-xyz/universal.infinite-scroll-list";
import { Pressable } from "@showtime-xyz/universal.pressable";
import { useRouter } from "@showtime-xyz/universal.router";
import { useSafeAreaInsets } from "@showtime-xyz/universal.safe-area";
import Spinner from "@showtime-xyz/universal.spinner";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import { InputAccessoryView } from "app/components/input-accessory-view";
import { MessageBox } from "app/components/messages";
import { formatDateRelativeWithIntl } from "app/utilities";

import { useChannelMessages } from "./hooks/use-channel-messages";

type HeaderProps = {
  username: string;
  members: number;
};

const Header = (props: HeaderProps) => {
  const router = useRouter();
  const isDark = useIsDarkMode();
  return (
    <View tw="flex-row p-4" style={{ columnGap: 8 }}>
      <View tw="flex-row items-center" style={{ columnGap: 8 }}>
        <Pressable
          onPress={() => {
            router.back();
          }}
        >
          <ArrowLeft
            height={24}
            width={24}
            color={isDark ? "white" : "black"}
          />
        </Pressable>
        <Avatar size={34} />
      </View>
      <View tw="flex-1" style={{ rowGap: 8 }}>
        <Text tw="text-sm font-bold text-gray-900 dark:text-gray-100">
          {props.username}
        </Text>
        <Text tw="text-xs text-gray-900 dark:text-gray-100">
          {props.members} members
        </Text>
      </View>
    </View>
  );
};

export const Messages = () => {
  const insets = useSafeAreaInsets();
  const { data, isLoading, fetchMore, isLoadingMore } = useChannelMessages();

  const onLoadMore = () => {
    fetchMore();
  };

  if (isLoading) {
    return (
      <View tw="flex-1 items-center justify-center">
        <Spinner />
      </View>
    );
  }

  return (
    <View
      tw="w-full flex-1"
      style={{
        paddingTop: insets.top,
        paddingBottom: insets.bottom + 32,
      }}
    >
      <Header username="nishan" members={29} />
      <InfiniteScrollList
        data={data}
        onEndReached={onLoadMore}
        inverted
        useWindowScroll={false}
        estimatedItemSize={20}
        keyboardDismissMode="interactive"
        renderItem={MessageItem}
        contentContainerStyle={{ paddingTop: insets.bottom }}
        ListFooterComponent={
          isLoadingMore
            ? () => (
                <View tw="w-full items-center py-4">
                  <Spinner size="small" />
                </View>
              )
            : () => null
        }
      />
      <InputAccessoryView>
        <View tw="bg-white dark:bg-black">
          <MessageBox
            placeholder="Send an update..."
            onSubmit={(text: string) => {
              return Promise.resolve();
            }}
            submitting={false}
          />
        </View>
      </InputAccessoryView>
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
            <Text tw="text-sm font-bold text-gray-900 dark:text-gray-100">
              {username}
            </Text>
            <Text tw="text-xs text-gray-700 dark:text-gray-200">
              {formatDateRelativeWithIntl(new Date().toISOString())}
            </Text>
          </View>

          <Text tw="text-sm text-gray-900 dark:text-gray-100">{text}</Text>
        </View>
      </View>
    </View>
  );
};
