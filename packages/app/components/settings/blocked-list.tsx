import { useCallback } from "react";
import { FlatList, Platform } from "react-native";

import { useHeaderHeight } from "app/lib/react-navigation/elements";
import { useRouter } from "app/navigation/use-router";

import {
  View,
  Text,
  Button,
  ButtonLabel,
  Image,
  ScrollView,
} from "design-system";

export type UserItemProps = {
  id: number | string;
  title: string;
  image_url?: string;
};

const HeaderSection = () => {
  return (
    <View tw="bg-white dark:bg-black pt-4 px-4 pb-[3px] flex-row justify-between mb-4">
      <Text
        variant="text-2xl"
        tw="text-gray-900 dark:text-white font-extrabold"
      >
        Blocked List
      </Text>
    </View>
  );
};

export const UserItem = (props: UserItemProps) => {
  return (
    <View tw="flex-1 flex-row w-full px-4 py-2 items-center">
      <View tw="mr-2 rounded-xl w-6 h-6 bg-gray-200">
        <Image
          tw={"w-full h-full rounded-full"}
          source={{ uri: props.image_url }}
        />
      </View>
      <View tw="flex-1 flex flex-col items-start justify-center">
        <Text tw="text-gray-900 dark:text-white">{props.title}</Text>
      </View>
      <Button
        size="small"
        variant="danger"
        onPress={() => {
          // TODO(enes): implement unblocking logics
        }}
      >
        <ButtonLabel>Unblock</ButtonLabel>
      </Button>
    </View>
  );
};

export const BlockedList = () => {
  const headerHeight = useHeaderHeight();
  const shouldRenderHeaderGap =
    Platform.OS !== "web" && Platform.OS !== "android";

  return (
    <ScrollView>
      {shouldRenderHeaderGap && <View tw={`h-[${headerHeight}px]`} />}
      <HeaderSection />
      <View tw="flex-1 px-4">
        <Text tw="font-semibold text-gray-600 dark:text-gray-400">
          🚧 Coming soon
        </Text>
      </View>
      {/* // TODO(enes): implement unblocking logics */}
    </ScrollView>
  );
};
