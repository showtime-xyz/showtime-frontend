import { Platform, Pressable, StyleSheet } from "react-native";

import { Muted, Unmuted } from "design-system/icon";
import { colors } from "design-system/tailwind";

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
    right: 10,
    position: "absolute",
    bottom: 10,
    backgroundColor: colors.gray[700],
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    padding: 4,
  },
});
