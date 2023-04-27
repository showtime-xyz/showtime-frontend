import { memo, useMemo } from "react";
import { Platform, Pressable, StyleSheet } from "react-native";

import { Muted, Unmuted } from "@showtime-xyz/universal.icon";

import { useMuted } from "app/providers/mute-provider";

const hitSlop = { top: 10, bottom: 10, left: 10, right: 10 };
type MuteButtonProps = {
  onPress?: (state: boolean) => void;
  variant?: "default" | "mobile-web";
};
export const MuteButton = memo(function MuteButton({
  onPress,
  variant,
}: MuteButtonProps) {
  const [muted, setMuted] = useMuted();
  const size = useMemo(() => (variant === "mobile-web" ? 22 : 18), [variant]);

  if (Platform.OS !== "web" || (Platform.OS !== "web" && !muted)) return null;

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
        <Muted id="12344" color="#fff" width={size} height={size} />
      ) : (
        <Unmuted id="12344" color="#fff" width={size} height={size} />
      )}
    </Pressable>
  );
});

const muteButtonStyle = StyleSheet.create({
  style: {
    zIndex: 5,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    padding: 6,
  },
});
