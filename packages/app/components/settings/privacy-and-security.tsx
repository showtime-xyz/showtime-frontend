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
    <View tw="bg-white dark:bg-black pt-4 px-4 pb-[3px] flex-row justify-between mb-4">
      <Text
        variant="text-2xl"
        tw="text-gray-900 dark:text-white font-extrabold"
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
