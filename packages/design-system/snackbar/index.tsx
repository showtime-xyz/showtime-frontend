import React, {
  createContext,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";
import { Platform, ViewStyle, AccessibilityInfo } from "react-native";

import { BlurView } from "expo-blur";
import {
  AnimatePresence,
  MotiView,
  MotiTransitionProp,
  StyleValueWithReplacedTransforms,
} from "moti";

import { useIsMobileWeb } from "app/hooks/use-is-mobile-web";

import { tw } from "design-system/tailwind";
import { Text } from "design-system/text";

import { useIsDarkMode } from "../hooks";
import { Check } from "../icon";
import { Pressable } from "../pressable-scale";
import { Spinner } from "../spinner";
import { colors } from "../tailwind/colors";
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
// If you don't upgrade reanimated to above v2.5+, the slide effect needs to use this method to fixed animation.
// const useFadeInUp = () => {
//   return useAnimationState({
//     from: {
//       opacity: 0,
//       translateY: 60,
//     },
//     to: {
//       opacity: 1,
//       translateY: 0,
//     },
//   });
// };
const initSnakbar: SnackbarShowParams = {
  text: "",
  iconStatus: "default",
  bottom: 0,
  preset: "default",
};

export const SnackbarProvider: React.FC = ({ children }) => {
  const isDark = useIsDarkMode();
  const { isMobileWeb } = useIsMobileWeb();

  const [show, setShow] = useState(false);
  const [snackbar, setSnackbar] = useState<SnackbarShowParams>(initSnakbar);

  const hideTimeoutRef = useRef<NodeJS.Timeout | null>();

  const setHideAfter = (duration: number | undefined) => {
    if (!duration) return;
    hideTimeoutRef.current = setTimeout(() => {
      setShow(false);
    }, duration);
  };

  const value = useMemo(
    () => ({
      show: ({ hideAfter, ...rest }: SnackbarShowParams) => {
        if (show) return;
        setShow(true);
        setSnackbar({
          ...snackbar,
          ...rest,
        });
        setHideAfter(hideAfter);
        rest.text && AccessibilityInfo.announceForAccessibility(rest.text);
      },
      update: ({ hideAfter, ...rest }: SnackbarShowParams) => {
        rest.text && AccessibilityInfo.announceForAccessibility(rest.text);
        setSnackbar({
          ...snackbar,
          ...rest,
        });
        setHideAfter(hideAfter);
      },
      hide: () => {
        setShow(false);
        setSnackbar(initSnakbar);
        hideTimeoutRef.current && clearTimeout(hideTimeoutRef.current);
      },
      isVisible: show,
    }),
    [show, setShow]
  );

  const isExplore = useMemo(() => snackbar.preset === "explore", [snackbar]);

  const textColor = useMemo(
    () => (isExplore ? colors.white : isDark ? colors.gray[900] : colors.white),
    [isExplore, isDark]
  );

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
            сolor={isExplore ? colors.white : colors.violet[500]}
          />
        );
      case "done":
        return <Check width={24} height={24} color={textColor} />;
      default:
        return snackbar?.icon;
    }
  }, [snackbar, isDark, isExplore]);

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
    []
  );

  return (
    <SnackbarContext.Provider value={value}>
      {children}
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
                tw="font-medium"
                variant="text-xs"
                numberOfLines={1}
                sx={{ color: textColor }}
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
                  <Pressable
                    accessibilityLabel="View"
                    accessibilityRole="button"
                    onPress={snackbar.action?.onPress}
                  >
                    {snackbar.action?.element ? (
                      snackbar.action?.element
                    ) : (
                      <Text
                        tw="font-bold"
                        variant="text-xs"
                        numberOfLines={1}
                        sx={{ color: textColor }}
                      >
                        {snackbar.action?.text}
                      </Text>
                    )}
                  </Pressable>
                </MotiView>
              )}
            </BlurView>
          </MotiView>
        )}
      </AnimatePresence>
    </SnackbarContext.Provider>
  );
};

export const useSnackbar = () => {
  const snackbar = useContext(SnackbarContext);
  if (snackbar === null) {
    console.error("Trying to use useSnackbar without a SnackbarProvider");
  }
  return snackbar;
};
