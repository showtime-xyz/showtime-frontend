import { useCallback } from "react";
import { FlatList, Platform } from "react-native";

import { useHeaderHeight } from "app/lib/react-navigation/elements";
import { useRouter } from "app/navigation/use-router";

import { View, Text, Pressable } from "design-system";
import ChevronRight from "design-system/icon/ChevronRight";
import { tw } from "design-system/tailwind";

import { SettingSubTitle } from "./settings-subtitle";

export const SettingAccountSlotHeader = () => {
  return (
    <View>
      <SettingSubTitle>
        <Text tw="text-gray-900 dark:text-white font-bold text-xl">
          Privacy & Security
        </Text>
      </SettingSubTitle>
    </View>
  );
};

export type SettingItemProps = {
  id: number | string;
  title: string;
  description?: string;
  route: string;
};

const list = [
  {
    id: 1,
    title: "Blocked Accounts",
    icon: "lock",
    route: "blocked-list",
  },
];

export const AccountSettingItem = (props: SettingItemProps) => {
  const router = useRouter();

  return (
    <Pressable
      tw="flex-1 flex-row justify-between w-full p-4 items-cente"
      onPress={() => router.push(`/settings/${props.route}`)}
    >
      <View tw="flex flex-col items-start justify-center">
        <Text tw="text-gray-900 dark:text-white pb-3">{props.title}</Text>
      </View>
      <View tw="w-8 h-8">
        <ChevronRight
          width={24}
          height={24}
          color={tw.style("dark:bg-gray-700 bg-gray-300").backgroundColor}
        />
      </View>
    </Pressable>
  );
};

export const PrivacyAndSecuritySettings = () => {
  const headerHeight = useHeaderHeight();

  const renderSetting = useCallback(({ item }) => {
    return <AccountSettingItem {...item} />;
  }, []);

  return (
    <View tw="bg-white dark:bg-black h-[100vh]">
      {Platform.OS !== "android" && <View tw={`h-[${headerHeight}px]`} />}
      <View tw="bg-white dark:bg-black pt-4 px-4 pb-[3px] flex-row justify-between mb-4">
        <Text
          variant="text-2xl"
          tw="text-gray-900 dark:text-white font-extrabold"
        >
          Privacy & Security
        </Text>
      </View>
      <FlatList data={list} renderItem={renderSetting} />
    </View>
  );
};
