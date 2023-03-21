import { Linking, Platform } from "react-native";

import { useHeaderHeight } from "app/lib/react-navigation/elements";

import { ScrollView } from "design-system/scroll-view";
import { Text } from "design-system/text";
import { View } from "design-system/view";

import { AccountSettingItem } from "./settings-account-item";

export const PrivacyAndSecuritySettings = () => {
  const headerHeight = useHeaderHeight();

  return (
    <ScrollView tw="w-full bg-white dark:bg-black md:bg-transparent">
      {Platform.OS !== "android" && <View style={{ height: headerHeight }} />}
      <View tw="mx-auto mt-4 w-full max-w-screen-lg px-4 md:mt-8">
        <Text tw="text-2xl font-extrabold text-gray-900 dark:text-white">
          Privacy & Security
        </Text>
        <View tw="h-8" />
        <View tw="rounded-2xl bg-white px-0 dark:bg-black md:px-4">
          {/* <AccountSettingItem
            title="Blocked Accounts"
            buttonText="View"
            onPress={() => {
              Alert.alert("🚧 Coming soon");
            }}
          /> */}
          <AccountSettingItem
            title="Code of Conduct"
            buttonText="View"
            onPress={() => {
              Linking.openURL(
                "https://showtime-xyz.notion.site/Code-of-Conduct-a149ecf1ee9946cdb13d6f4c54713482"
              );
            }}
          />
          <AccountSettingItem
            title="Privacy Policy"
            buttonText="View"
            onPress={() => {
              Linking.openURL(
                "https://showtime-xyz.notion.site/Privacy-Policy-71312edbe17341f1bd46051928587e93"
              );
            }}
          />
          <AccountSettingItem
            title="Terms of Service"
            buttonText="View"
            onPress={() => {
              Linking.openURL(
                "https://showtime-xyz.notion.site/Terms-of-Service-bf0c49cbdf3e4db9aa291b8d6dc2c919"
              );
            }}
          />
        </View>
      </View>
    </ScrollView>
  );
};
