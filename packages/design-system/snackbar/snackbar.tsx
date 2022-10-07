import React, { useEffect, useMemo, useRef } from "react";
import { Platform } from "react-native";

import { BlurView } from "expo-blur";
import { MotiView } from "moti";

import { useIsDarkMode, useIsMobileWeb } from "@showtime-xyz/universal.hooks";
import { Check } from "@showtime-xyz/universal.icon";
import { PanToClose } from "@showtime-xyz/universal.pan-to-close";
import { PressableScale } from "@showtime-xyz/universal.pressable-scale";
import { Spinner } from "@showtime-xyz/universal.spinner";
import { colors } from "@showtime-xyz/universal.tailwind";
import { Text } from "@showtime-xyz/universal.text";

import { PRESET_TRANSITION_MAP } from "./constants";
import { SnackbarShowParams } from "./index";

export type SnackbarStateType = "default" | "waiting" | "done";
export const SNACKBAR_HEIGHT = 40;

const isWeb = Platform.OS === "web";

export type SnackbarProps = {
  snackbar: SnackbarShowParams;
  show: boolean;
  hide: () => void;
};

export const Snackbar: React.FC<SnackbarProps> = ({ snackbar, show, hide }) => {
  const isDark = useIsDarkMode();
  const { isMobileWeb } = useIsMobileWeb();
  const isExplore = useMemo(() => snackbar.preset === "explore", [snackbar]);
  const hideTimeoutRef = useRef<NodeJS.Timeout | null>();
  const textColor = useMemo(
    () => (isExplore ? colors.white : isDark ? colors.gray[900] : colors.white),
    [isExplore, isDark]
  );

  useEffect(() => {
    if (snackbar.hideAfter) {
      hideTimeoutRef.current && clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = setTimeout(() => {
        hide?.();
      }, snackbar.hideAfter);
    }
  }, [hide, snackbar]);

  const renderIcon = useMemo(() => {
    switch (snackbar.iconStatus) {
      case "waiting":
        return (
          <Spinner
            size="small"
            secondaryColor={
              isExplore
                ? colors.gray[900]
                : isDark
                ? colors.gray[100]
                : colors.gray[600]
            }
            color={isExplore ? colors.white : colors.violet[500]}
          />
        );
      case "done":
        return <Check width={24} height={24} color={textColor} />;
      default:
        return snackbar?.icon;
    }
  }, [snackbar, isDark, isExplore, textColor]);

  const transition = useMemo<SnackbarShowParams["transitionConfig"]>(
    () =>
      snackbar?.transitionConfig ?? {
        type: "timing",
        duration: 300,
      },
    [snackbar]
  );

  if (!show) return null;

  return (
    <PanToClose
      panCloseDirection="down"
      onClose={hide}
      disable={snackbar.disableGestureToClose}
    >
      <MotiView
        transition={transition}
        style={[
          {
            width: "100%",
            height: SNACKBAR_HEIGHT,
            backgroundColor:
              snackbar.preset === "explore"
                ? colors.violet[600]
                : "transparent",
          },
        ]}
        {...PRESET_TRANSITION_MAP.get(snackbar.transition ?? "fade")}
      >
        <BlurView
          intensity={snackbar.preset === "explore" ? 0 : 100}
          style={{
            width: "100%",
            alignItems: "center",
            height: "100%",
            flexDirection: "row",
            paddingHorizontal: isWeb && !isMobileWeb ? 32 : 10,
          }}
          tint={isDark ? "light" : "dark"}
        >
          <MotiView
            animate={{
              width: snackbar.iconStatus !== "default" ? 32 : 0,
              opacity: snackbar.iconStatus !== "default" ? 1 : 0,
            }}
            transition={{ type: "timing", duration: 250 }}
          >
            {renderIcon}
          </MotiView>
          <Text
            tw="text-xs font-medium"
            numberOfLines={1}
            style={{ color: textColor }}
            accessibilityRole="text"
          >
            {snackbar.text}
          </Text>
          {Boolean(snackbar?.action) && (
            <MotiView
              from={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ type: "timing", duration: 250 }}
              style={{ marginLeft: "auto" }}
            >
              <PressableScale
                accessibilityLabel="View"
                accessibilityRole="button"
                onPress={snackbar.action?.onPress}
              >
                {snackbar.action?.element ? (
                  snackbar.action?.element
                ) : (
                  <Text
                    tw="text-xs font-bold"
                    numberOfLines={1}
                    style={{ color: textColor }}
                  >
                    {snackbar.action?.text}
                  </Text>
                )}
              </PressableScale>
            </MotiView>
          )}
        </BlurView>
      </MotiView>
    </PanToClose>
  );
};
