import { memo } from "react";
import { Platform, Pressable, StyleSheet } from "react-native";

import { Muted, Unmuted } from "@showtime-xyz/universal.icon";
import { colors } from "@showtime-xyz/universal.tailwind";

import { useMuted } from "app/providers/mute-provider";

const hitSlop = { top: 10, bottom: 10, left: 10, right: 10 };
type MuteButtonProps = {
  onPress?: (state: boolean) => void;
};
export const MuteButton = memo(function MuteButton({
  onPress,
}: MuteButtonProps) {
  const [muted, setMuted] = useMuted();

  if (Platform.OS !== "web" || !muted) return null;

  return (
    <Pressable
      style={muteButtonStyle.style}
      hitSlop={hitSlop}
      onPress={(e) => {
        if (Platform.OS === "web") {
          e.preventDefault();
        }
        onPress?.(!muted);
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
});

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
