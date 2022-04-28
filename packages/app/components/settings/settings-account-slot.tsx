import { Linking } from "react-native";

import { Link } from "app/navigation/link";
import { useRouter } from "app/navigation/use-router";

import { Button, ButtonLabel, Pressable, Text, View } from "design-system";
import { useAlert } from "design-system/alert";
import ChevronRight from "design-system/icon/ChevronRight";
import { tw } from "design-system/tailwind";

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
        <Text tw="mt-1 mb-2 text-base text-gray-500 dark:text-white">
          This action cannot be undone.
        </Text>
        <View tw="flex flex-row">
          <Link href="mailto:support@tryshowtime.com">
            <Button variant="danger" size="small" onPress={handleDeleteAccount}>
              <ButtonLabel>Delete Account</ButtonLabel>
            </Button>
          </Link>
        </View>
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
  const router = useRouter();

  const handleOnPressItem = (route: string) => {
    router.push(`/settings/${route}`);
  };

  return (
    <Pressable
      tw="w-full flex-1 flex-row items-center justify-between p-4"
      onPress={() => handleOnPressItem(props.subRoute)}
    >
      <View tw="flex flex-col">
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
