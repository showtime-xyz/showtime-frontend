import { ComponentType, memo } from "react";

import { useColorScheme } from "@showtime-xyz/universal.color-scheme";

export const withMemoAndColorScheme = <T extends ComponentType<any>>(Comp: T) =>
  memo(withColorScheme(Comp));

export const withColorScheme =
  <T extends ComponentType<any>>(Comp: T) =>
  // eslint-disable-next-line react/display-name
  (props: any) => {
    const { colorScheme } = useColorScheme();
    return <Comp {...props} colorScheme={colorScheme} />;
  };
