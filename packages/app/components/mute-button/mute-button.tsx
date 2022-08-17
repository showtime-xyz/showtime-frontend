import { createContext, useContext } from "react";
import { Platform, Pressable, StyleSheet } from "react-native";

import { Muted, Unmuted } from "@showtime-xyz/universal.icon";

import { colors } from "design-system/tailwind";

const hitSlop = { top: 10, bottom: 10, left: 10, right: 10 };
export const MuteButton = ({
  muted,
  onPress,
}: {
  muted: boolean;
  onPress: () => void;
}) => {
  return (
    <Pressable
      style={muteButtonStyle.style}
      hitSlop={hitSlop}
      onPress={(e) => {
        if (Platform.OS === "web") {
          e.preventDefault();
        }
        onPress();
      }}
    >
      {muted ? (
        <Muted nativeID="12344" color="#fff" width={16} height={16} />
      ) : (
        <Unmuted nativeID="12344" color="#fff" width={16} height={16} />
      )}
    </Pressable>
  );
};

const muteButtonStyle = StyleSheet.create({
  style: {
    zIndex: 5,
    backgroundColor: colors.gray[700],
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    padding: 4,
  },
});

const MuteButtonOffsetContext = createContext({
  bottomOffset: 10,
});

export const MuteButtonOffsetProvider = ({
  bottomOffset,
  children,
}: {
  bottomOffset: number;
  children: any;
}) => {
  return (
    <MuteButtonOffsetContext.Provider value={{ bottomOffset }}>
      {children}
    </MuteButtonOffsetContext.Provider>
  );
};

export const useMuteButtonBottomOffset = () => {
  return useContext(MuteButtonOffsetContext).bottomOffset;
};
