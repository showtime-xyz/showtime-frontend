import { GestureResponderEvent } from "react-native";

import { BottomTabBarButtonProps } from "@react-navigation/bottom-tabs";

import { View } from "@showtime-xyz/universal.view";

import { Pressable } from "design-system";

import { Haptics } from "../lib/haptics";

export const TabBarButton = ({
  onPress,
  children,
}: BottomTabBarButtonProps) => {
  return (
    <View tw="flex flex-1 items-center justify-center ">
      <Pressable
        onPress={(
          e:
            | React.MouseEvent<HTMLAnchorElement, MouseEvent>
            | GestureResponderEvent
        ) => {
          Haptics.impactAsync();
          onPress?.(e);
        }}
        tw="flex-1"
      >
        {children}
      </Pressable>
    </View>
  );
};
