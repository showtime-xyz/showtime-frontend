import { Platform } from "react-native";

import Constants from "expo-constants";

import { Route, TabBarSingle } from "@showtime-xyz/universal.tab-view";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import { useHeaderHeight } from "app/lib/react-navigation/elements";

import { Hidden } from "design-system/hidden";

import packageJson from "../../../../package.json";

export const SettingHeaderSection = ({ title = "" }) => {
  return (
    <View tw="dark:shadow-dark shadow-light items-center bg-white dark:bg-black md:mb-8">
      <View tw="w-full max-w-screen-2xl flex-row justify-between bg-white py-4 px-4 dark:bg-black">
        <Text tw="font-space-bold text-2xl font-extrabold text-gray-900 dark:text-white">
          {title}
        </Text>
      </View>
    </View>
  );
};
type SettingsHeaderProps = {
  index: number;
  setIndex: (index: number) => void;
  routers: Route[];
};
export const SettingsHeader = ({
  index,
  setIndex,
  routers,
}: SettingsHeaderProps) => {
  const headerHeight = useHeaderHeight();
  const isWeb = Platform.OS === "web";
  return (
    <>
      {Platform.OS !== "android" && <View style={{ height: headerHeight }} />}
      <View tw="dark:shadow-dark shadow-light items-center bg-white dark:bg-black md:mb-4">
        <View tw="w-full max-w-screen-2xl">
          <View tw="w-full flex-row justify-between self-center px-4 py-4 md:py-0">
            <Text tw="font-space-bold self-center text-2xl font-extrabold text-gray-900 dark:text-white">
              Settings
            </Text>
            {!isWeb ? (
              <Text tw="font-space-bold text-2xl font-extrabold text-gray-100 dark:text-gray-900">
                v{Constants?.manifest?.version ?? packageJson?.version}
              </Text>
            ) : (
              <Hidden until="md">
                <TabBarSingle
                  onPress={(i) => {
                    setIndex(i);
                  }}
                  routes={routers}
                  index={index}
                />
              </Hidden>
            )}
          </View>
          {isWeb && (
            <Hidden from="md">
              <TabBarSingle
                onPress={(i) => {
                  setIndex(i);
                }}
                routes={routers}
                index={index}
              />
            </Hidden>
          )}
        </View>
      </View>
    </>
  );
};
