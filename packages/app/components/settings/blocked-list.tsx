import { Platform } from "react-native";

import { Button } from "@showtime-xyz/universal.button";
import { Image } from "@showtime-xyz/universal.image";
import { ScrollView } from "@showtime-xyz/universal.scroll-view";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import { useHeaderHeight } from "app/lib/react-navigation/elements";

import { SettingBody } from "./setting-content";
import { SettingHeaderSection } from "./setting-header";

export type UserItemProps = {
  id: number | string;
  title: string;
  image_url?: string;
};

export const UserItem = (props: UserItemProps) => {
  return (
    <View tw="w-full flex-1 flex-row items-center px-4 py-2">
      <View tw="mr-2 h-6 w-6 rounded-xl bg-gray-200">
        <Image
          tw={"h-full w-full rounded-full"}
          width={24}
          height={24}
          source={{ uri: props.image_url }}
          alt={props.title}
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
        <Text>Unblock</Text>
      </Button>
    </View>
  );
};

export const BlockedList = () => {
  const headerHeight = useHeaderHeight();

  return (
    <ScrollView tw="w-full">
      {Platform.OS !== "android" && <View style={{ height: headerHeight }} />}
      <SettingHeaderSection title="Blocked List" />
      <SettingBody>
        <View tw="flex-1 px-4 pt-4">
          <Text tw="font-semibold text-gray-600 dark:text-gray-400">
            🚧 Coming soon
          </Text>
        </View>
      </SettingBody>

      {/* // TODO(enes): implement unblocking logics */}
    </ScrollView>
  );
};
