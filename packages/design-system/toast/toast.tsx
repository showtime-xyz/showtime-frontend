import { useState } from "react";
import { Platform, LayoutChangeEvent, StyleSheet } from "react-native";

import { MotiView } from "moti";

import { useIsDarkMode } from "@showtime-xyz/universal.hooks";
import { PanToClose } from "@showtime-xyz/universal.pan-to-close";
import { useSafeAreaInsets } from "@showtime-xyz/universal.safe-area";
import { Text } from "@showtime-xyz/universal.text";

type ToastProps = {
  render?: JSX.Element | null;
  message?: string;
  hide: () => void;
};

const SAFE_AREA_TOP = 20;

export const Toast = ({ render, message, hide }: ToastProps) => {
  const isDark = useIsDarkMode();
  const safeAreaInsets = useSafeAreaInsets();
  const [layout, setLayout] = useState<
    LayoutChangeEvent["nativeEvent"]["layout"] | undefined
  >();
  const { top: safeAreaTop } =
    Platform.OS === "web" ? { top: SAFE_AREA_TOP } : safeAreaInsets;

  const toastHeight = layout?.height ?? 0;

  return (
    <PanToClose panCloseDirection={"up"} onClose={hide}>
      <MotiView
        style={[
          styles.toastContainer,
          {
            opacity: layout ? 1 : 0,
            backgroundColor: isDark ? "#000" : "#FFF",
          },
        ]}
        accessibilityLiveRegion="polite"
        pointerEvents="box-none"
        from={{ translateY: -toastHeight }}
        animate={{
          translateY: safeAreaTop === 0 ? SAFE_AREA_TOP : safeAreaTop,
        }}
        exit={{ translateY: -toastHeight }}
        transition={{ type: "timing", duration: 350 }}
        onLayout={(e) => {
          setLayout(e.nativeEvent.layout);
        }}
      >
        {render ? (
          render
        ) : (
          <Text tw="p-4 text-center text-gray-900 dark:text-white">
            {message}
          </Text>
        )}
      </MotiView>
    </PanToClose>
  );
};

const styles = StyleSheet.create({
  toastContainer: {
    alignSelf: "center",
    borderRadius: 16,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 5,
    justifyContent: "center",
  },
});
