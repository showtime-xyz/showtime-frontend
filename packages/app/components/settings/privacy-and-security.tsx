import { Platform } from "react-native";

import { useHeaderHeight } from "app/lib/react-navigation/elements";
import { useRouter } from "app/navigation/use-router";

import { Pressable, ScrollView, Text, View } from "design-system";
import ChevronRight from "design-system/icon/ChevronRight";
import { tw } from "design-system/tailwind";

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

export const HeaderSection = () => {
  return (
    <View tw="mb-4 flex-row justify-between bg-white px-4 pt-4 pb-[3px] dark:bg-black">
      <Text
        variant="text-2xl"
        tw="font-extrabold text-gray-900 dark:text-white"
      >
        Privacy & Security
      </Text>
    </View>
  );
};

export const AccountSettingItem = (props: SettingItemProps) => {
  const router = useRouter();

  return (
    <Pressable
      tw="items-cente w-full flex-1 flex-row justify-between p-4"
      onPress={() => router.push(`/settings/${props.route}`)}
    >
      <View tw="flex flex-col items-start justify-center">
        <Text tw="pb-3 text-gray-900 dark:text-white">{props.title}</Text>
      </View>
      <View tw="h-8 w-8">
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
  const shouldRenderHeaderGap =
    Platform.OS !== "web" && Platform.OS !== "android";

  const renderSetting = (item: SettingItemProps) => {
    return (
      <AccountSettingItem
        key={`privacy-and-security-setting-${item.id}`}
        {...item}
      />
    );
  };

  return (
    <ScrollView tw="w-full max-w-screen-xl">
      {shouldRenderHeaderGap && <View tw={`h-[${headerHeight}px]`} />}
      <HeaderSection />
      {list.map(renderSetting)}
    </ScrollView>
  );
};
