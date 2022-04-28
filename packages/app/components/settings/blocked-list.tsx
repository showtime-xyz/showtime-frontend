import { Platform } from "react-native";

import { useHeaderHeight } from "app/lib/react-navigation/elements";

import {
  Button,
  ButtonLabel,
  Image,
  ScrollView,
  Text,
  View,
} from "design-system";

export type UserItemProps = {
  id: number | string;
  title: string;
  image_url?: string;
};

const HeaderSection = () => {
  return (
    <View tw="mb-4 flex-row justify-between bg-white px-4 pt-4 pb-[3px] dark:bg-black">
      <Text
        variant="text-2xl"
        tw="font-extrabold text-gray-900 dark:text-white"
      >
        Blocked List
      </Text>
    </View>
  );
};

export const UserItem = (props: UserItemProps) => {
  return (
    <View tw="w-full flex-1 flex-row items-center px-4 py-2">
      <View tw="mr-2 h-6 w-6 rounded-xl bg-gray-200">
        <Image
          tw={"h-full w-full rounded-full"}
          source={{ uri: props.image_url }}
        />
      </View>
      <View tw="flex flex-1 flex-col items-start justify-center">
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
    <ScrollView tw="w-full max-w-screen-xl">
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
