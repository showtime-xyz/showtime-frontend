import { useState, useRef, createContext, useMemo, useContext } from "react";
import {
  Platform,
  View,
  AccessibilityInfo,
  LayoutChangeEvent,
  StyleSheet,
} from "react-native";

import { MotiView, AnimatePresence } from "moti";

import { useSafeAreaInsets } from "app/lib/safe-area";

import { tw } from "design-system/tailwind";
import { Text } from "design-system/text";

type ShowParams = {
  message?: string;
  hideAfter?: number;
  element?: React.ReactElement;
};

type ToastContext = {
  show: (params: ShowParams) => void;
  hide: () => void;
  isVisible: boolean;
};

const ToastContext = createContext<ToastContext | undefined>(undefined);

const SAFE_AREA_TOP = 20;

export const ToastProvider = ({ children }: any) => {
  const [show, setShow] = useState(false);
  const [message, setMessage] = useState<string | undefined>();
  const [render, setRender] = useState<React.ReactElement | null>();
  const [layout, setLayout] = useState<
    LayoutChangeEvent["nativeEvent"]["layout"] | undefined
  >();
  const hideTimeoutRef = useRef<any>(null);
  const { top: safeAreaTop } =
    Platform.OS === "web" ? { top: SAFE_AREA_TOP } : useSafeAreaInsets();

  const value = useMemo(
    () => ({
      show: ({ message, hideAfter, element }: ShowParams) => {
        if (!show) {
          setRender(element);
          setMessage(message);
          setShow(true);

          if (message) {
            AccessibilityInfo.announceForAccessibility(message);
          }

          if (hideAfter) {
            hideTimeoutRef.current = setTimeout(() => {
              setShow(false);
            }, hideAfter);
          }
        }
      },
      hide: () => {
        setShow(false);
        if (hideTimeoutRef.current) {
          clearTimeout(hideTimeoutRef.current);
        }
      },
      isVisible: show,
    }),
    [show, setShow]
  );

  const toastHeight = layout?.height ?? 0;

  return (
    <ToastContext.Provider value={value}>
      {children}
      <AnimatePresence>
        {show ? (
          <View
            style={[
              StyleSheet.absoluteFill,
              //@ts-ignore
              // TODO: improve toast to attach to react portal!
              Platform.OS === "web" ? { position: "fixed" } : {},
            ]}
            pointerEvents="box-none"
          >
            <MotiView
              style={[
                styles.toastContainer,
                { opacity: layout ? 1 : 0 },
                tw.style(
                  "bg-white dark:bg-black shadow-black dark:shadow-white"
                ),
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
          </View>
        ) : null}
      </AnimatePresence>
    </ToastContext.Provider>
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

export const useToast = () => {
  const toast = useContext(ToastContext);
  if (toast === null) {
    console.error("Trying to use useToast without a ToastProvider");
  }

  return toast;
};
