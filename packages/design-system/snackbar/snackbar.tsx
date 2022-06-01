import React, { createContext, useEffect, useMemo, useRef } from "react";
import { Platform, ViewStyle } from "react-native";

import { BlurView } from "expo-blur";
import {
  AnimatePresence,
  MotiView,
  MotiTransitionProp,
  StyleValueWithReplacedTransforms,
} from "moti";

import { useIsDarkMode, useIsMobileWeb } from "@showtime-xyz/universal.hooks";
import { Check } from "@showtime-xyz/universal.icon";
import { PressableScale } from "@showtime-xyz/universal.pressable-scale";
import { Spinner } from "@showtime-xyz/universal.spinner";
import { tw } from "@showtime-xyz/universal.tailwind";
import { colors } from "@showtime-xyz/universal.tailwind";
import { Text } from "@showtime-xyz/universal.text";

import { PRESET_TRANSITION_MAP, SnackbarTransitionType } from "./constants";

export type SnackbarStateType = "default" | "waiting" | "done";

export type SnackbarShowParams = {
  /** snackbar text */
  text: string;
  /** snackbar icon */
  icon?: React.ReactElement;
  /** snackbar icon state */
  iconStatus?: SnackbarStateType;
  /** snackbar action button params */
  action?: {
    text: string;
    onPress: () => void;
    element?: React.ReactElement;
  };
  /** snackbar transition effect, default 'fade' */
  transition?: SnackbarTransitionType;
  /** snackbar transition config effect, default {type: "timing",duration: 300} */
  transitionConfig?: MotiTransitionProp<
    StyleValueWithReplacedTransforms<ViewStyle>
  >;
  /** distance from bottom, default safe-area bottom */
  bottom?: number;
  /** hide snackbar after in milliseconds */
  hideAfter?: number;
  /** hide snackbar after in milliseconds */
  preset?: "default" | "explore";
};

type SnackbarContextType = {
  show: (params: SnackbarShowParams) => void;
  update: (params: SnackbarShowParams) => void;
  hide: () => void;
  isVisible: boolean;
  iconStatus?: SnackbarStateType;
};

const isWeb = Platform.OS === "web";

export const SnackbarContext = createContext<SnackbarContextType | undefined>(
  undefined
);

export const initSnakbarParams: SnackbarShowParams = {
  text: "",
  iconStatus: "default",
  bottom: 0,
  preset: "default",
};

export type SnackbarProps = {
  snackbar: SnackbarShowParams;
  show: boolean;
  hide?: () => void;
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

  const snackbarStyle = useMemo(
    () => ({
      position: isWeb ? ("fixed" as any) : "absolute",
      bottom: snackbar.bottom ?? 0,
      backgroundColor:
        snackbar.preset === "explore" ? colors.violet[600] : "transparent",
    }),
    [snackbar]
  );

  const transition = useMemo<SnackbarShowParams["transitionConfig"]>(
    () =>
      snackbar?.transitionConfig ?? {
        type: "timing",
        duration: 300,
      },
    [snackbar]
  );

  return (
    <AnimatePresence>
      {show && (
        <MotiView
          transition={transition}
          style={[tw.style(`w-full h-10`), snackbarStyle]}
          {...PRESET_TRANSITION_MAP.get(snackbar.transition ?? "fade")}
        >
          <BlurView
            intensity={snackbar.preset === "explore" ? 0 : 100}
            style={[
              tw.style(`w-full items-center h-full flex-row`),
              { paddingHorizontal: isWeb && !isMobileWeb ? 32 : 10 },
            ]}
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
      )}
    </AnimatePresence>
  );
};
