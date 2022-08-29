import { Platform, Pressable, StyleSheet } from "react-native";

import { Muted, Unmuted } from "@showtime-xyz/universal.icon";

import { useMuted } from "app/providers/mute-provider";

import { colors } from "design-system/tailwind";

const hitSlop = { top: 10, bottom: 10, left: 10, right: 10 };
export const MuteButton = () => {
  const [muted, setMuted] = useMuted();

  return (
    <Pressable
      style={muteButtonStyle.style}
      hitSlop={hitSlop}
      onPress={(e) => {
        if (Platform.OS === "web") {
          e.preventDefault();
        }
        setMuted(!muted);
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
