import { ComponentType, memo } from "react";

import { useColorScheme } from "@showtime-xyz/universal.hooks";

export const withMemoAndColorScheme = <T extends ComponentType<any>>(Comp: T) =>
  memo(withColorScheme(Comp));

export const withColorScheme =
  <T extends ComponentType<any>>(Comp: T) =>
  // eslint-disable-next-line react/display-name
  (props: any) => {
    const color = useColorScheme();
    return <Comp {...props} colorScheme={color} />;
  };
