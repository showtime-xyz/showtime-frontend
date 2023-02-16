import { useEffect } from "react";
import { Platform, useWindowDimensions } from "react-native";

import { useRouter } from "@showtime-xyz/universal.router";
import { Spinner } from "@showtime-xyz/universal.spinner";
import { View } from "@showtime-xyz/universal.view";

import { withColorScheme } from "app/components/memo-with-theme";
import { Search } from "app/components/search";
import { useTrackPageViewed } from "app/lib/analytics";

import { breakpoints } from "design-system/theme";

const SearchScreen = withColorScheme(() => {
  useTrackPageViewed({ name: "Search" });
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isMdWidth = width >= breakpoints["md"];
  const isUnavailable = isMdWidth && Platform.OS === "web";

  useEffect(() => {
    if (isUnavailable) {
      router.replace("/");
    }
  }, [isUnavailable, isMdWidth, router]);

  if (isUnavailable) {
    return (
      <View tw="flex-1 items-center justify-center">
        <Spinner />
      </View>
    );
  }
  return (
    <View tw="w-full flex-1">
      <Search />
    </View>
  );
});

export { SearchScreen };
