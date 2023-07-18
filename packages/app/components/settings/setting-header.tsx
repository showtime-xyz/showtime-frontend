import { Platform } from "react-native";

import { Route, TabBarSingle } from "@showtime-xyz/universal.tab-view";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import { useHeaderHeight } from "app/lib/react-navigation/elements";

export const SettingHeaderSection = ({ title = "" }) => {
  return (
    <View tw="items-center bg-white dark:bg-black md:mb-8">
      <View tw="w-full max-w-screen-2xl flex-row justify-between bg-white px-4 py-4 dark:bg-black">
        <Text tw="text-2xl font-extrabold text-gray-900 dark:text-white">
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
  return (
    <>
      {Platform.OS === "ios" && <View style={{ height: headerHeight }} />}
      {Platform.OS === "web" && (
        <View tw="items-center bg-white dark:bg-black">
          <View tw="w-full max-w-screen-2xl">
            <TabBarSingle
              onPress={(i) => {
                setIndex(i);
              }}
              routes={routers}
              index={index}
            />
          </View>
        </View>
      )}
    </>
  );
};
