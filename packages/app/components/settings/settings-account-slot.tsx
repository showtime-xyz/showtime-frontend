import { Linking } from "react-native";

import { useAlert } from "@showtime-xyz/universal.alert";
import { Button } from "@showtime-xyz/universal.button";
import { useIsDarkMode } from "@showtime-xyz/universal.hooks";
import { ChevronRight } from "@showtime-xyz/universal.icon";
import { Pressable } from "@showtime-xyz/universal.pressable";
import { useRouter } from "@showtime-xyz/universal.router";
import { colors } from "@showtime-xyz/universal.tailwind";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import { Link } from "app/navigation/link";

import { ClearCacheBtn } from "./clear-cache-btn";
import { SettingSubTitle } from "./settings-subtitle";

export const SettingAccountSlotHeader = () => {
  return (
    <View>
      <SettingSubTitle>
        <Text tw="text-xl font-bold text-gray-900 dark:text-white">
          Account
        </Text>
      </SettingSubTitle>
    </View>
  );
};

export const SettingAccountSlotFooter = () => {
  const supportMailURL = "mailto:help@tryshowtime.com";
  const Alert = useAlert();

  const handleDeleteAccount = async () => {
    try {
      const canOpenUrl = await Linking.canOpenURL(supportMailURL);
      if (canOpenUrl) {
        Linking.openURL(supportMailURL);
      } else {
        Alert.alert("Error", "Could not find a mail client on your device.");
      }
    } catch (error) {
      Alert.alert("Error", "Something went wrong. Please try again later.");
    }
  };

  return (
    <View tw="mt-4 px-4">
      <View tw="flex flex-col items-start">
        <Text tw="text-base font-bold text-gray-900 dark:text-white">
          Delete Account
        </Text>
        <View tw="h-4" />
        <Text tw="text-xs text-gray-500 dark:text-white md:text-sm">
          This action cannot be undone.
        </Text>
        <View tw="h-4" />
        <View tw="flex flex-row">
          <Link href="mailto:support@tryshowtime.com">
            <Button variant="danger" size="small" onPress={handleDeleteAccount}>
              <Text>Delete Account</Text>
            </Button>
          </Link>
        </View>
        <View tw="h-4" />
        <ClearCacheBtn />
      </View>
    </View>
  );
};

export type AccountSettingItemProps = {
  id: number | string;
  title: string;
  subRoute: string;
};

export const AccountSettingItem = (props: AccountSettingItemProps) => {
  const isDark = useIsDarkMode();
  const router = useRouter();
  const handleOnPressItem = (route: string) => {
    router.push(`/settings/${route}`);
  };

  return (
    <Pressable
      onPress={() => handleOnPressItem(props.subRoute)}
      tw="mb-2 w-full flex-row items-center justify-between rounded-md px-4 py-2"
    >
      <View tw="flex flex-col">
        <Text tw="text-sm text-gray-900 dark:text-white">{props.title}</Text>
      </View>
      <View tw="h-8 w-8 items-center justify-center">
        <ChevronRight
          width={24}
          height={24}
          color={isDark ? colors.gray[200] : colors.gray[700]}
        />
      </View>
    </Pressable>
  );
};
