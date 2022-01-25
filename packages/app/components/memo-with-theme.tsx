import { useColorScheme } from "design-system/hooks";
import { ComponentType, memo } from "react";

export const withMemoAndColorScheme = <T extends ComponentType<any>>(Comp: T) =>
  memo(withColorScheme(Comp));

export const withColorScheme =
  <T extends ComponentType<any>>(Comp: T) =>
  (props: any) => {
    const color = useColorScheme();
    return <Comp {...props} colorScheme={color} />;
  };
