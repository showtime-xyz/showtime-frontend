import { useState, useRef, useMemo } from "react";
import { Platform } from "react-native";

import { useIsDarkMode } from "@showtime-xyz/universal.hooks";

import {
  NavigationContainer,
  LinkingOptions,
} from "app/lib/react-navigation/native";
import { linking } from "app/navigation/linking";
import { NavigationElementsProvider } from "app/navigation/navigation-elements-context";

function useLinkingConfig(
  trackedLinking: React.MutableRefObject<
    LinkingOptions<ReactNavigation.RootParamList>
  >
) {
  return {
    linking: trackedLinking.current,
    onReady: useMemo(
      () =>
        Platform.select({
          web: () => {
            trackedLinking.current.enabled = false;
          },
        }),
      [trackedLinking]
    ),
  };
}

export function NavigationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const trackedLinking = useRef(linking);
  const linkingConfig = useLinkingConfig(trackedLinking);
  const isDark = useIsDarkMode();
  const [isHeaderHidden, setIsHeaderHidden] = useState(false);
  const [isTabBarHidden, setIsTabBarHidden] = useState(false);

  return (
    <NavigationContainer
      linking={
        process.env.NODE_ENV !== "test" ? linkingConfig.linking : undefined
      }
      onReady={linkingConfig.onReady}
      theme={{
        dark: isDark,
        colors: {
          primary: "#fff",
          background: isDark ? "#000" : "#fff",
          card: "#000",
          text: isDark ? "#fff" : "#000",
          border: "rgb(39, 39, 41)",
          notification: "#8B5CF6",
        },
      }}
      documentTitle={{
        enabled: true,
        formatter: (options) =>
          options?.title ? `${options.title} | Showtime` : "Showtime",
      }}
    >
      <NavigationElementsProvider
        value={{
          isHeaderHidden,
          setIsHeaderHidden,
          isTabBarHidden,
          setIsTabBarHidden,
        }}
      >
        {children}
      </NavigationElementsProvider>
    </NavigationContainer>
  );
}
