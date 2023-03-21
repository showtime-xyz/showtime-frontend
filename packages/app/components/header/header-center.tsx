import { ShowtimeTabBarIcon } from "app/navigation/tab-bar-icons";

import { View } from "design-system/view";

import { SearchInHeader } from "./header";

export const HeaderCenter = ({
  isDark,
  isMdWidth,
}: {
  isDark?: boolean;
  isMdWidth?: boolean;
}) => {
  return (
    <View tw="flex flex-row">
      <ShowtimeTabBarIcon color={isDark ? "black" : "white"} tw="mr-4" />
      {isMdWidth ? <SearchInHeader /> : null}
    </View>
  );
};
