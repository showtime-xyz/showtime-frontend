import { Text } from "@showtime/universal-ui.text";
import React, {
  useState,
  useRef,
  createContext,
  useMemo,
  useContext,
} from "react";
import { MotiView, AnimatePresence } from "moti";
import { View } from "react-native";
import { AccessibilityInfo, LayoutChangeEvent, StyleSheet } from "react-native";
import { tw } from "@showtime/universal-ui.tailwind";

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
          <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
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
              animate={{ translateY: SAFE_AREA_TOP }}
              exit={{ translateY: -toastHeight }}
              transition={{ type: "timing", duration: 350 }}
              onLayout={(e) => {
                setLayout(e.nativeEvent.layout);
              }}
            >
              {render ? (
                render
              ) : (
                <Text tw="text-center p-4 dark:text-white text-gray-900">
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
