import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import {
  Alert as RNAlert,
  AlertButton,
  AlertStatic,
  Platform,
  StyleSheet,
} from "react-native";

import { AnimatePresence, MotiView } from "moti";

import { tw } from "design-system/tailwind";
import { Text } from "design-system/text";

import { Divider } from "../divider";
import { View } from "../view";
import { AlertOption } from "./alert-option";

type AlertContext = Pick<AlertStatic, "alert">;

// default alert function is to use Alert.alert instead of Alert?.alert
export const AlertContext = createContext<AlertContext>({ alert: () => false });

export const AlertProvider: React.FC = ({ children }) => {
  const [show, setShow] = useState(false);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [buttons, setButtons] = useState<AlertButton[]>([]);

  const closeAlert = useCallback(() => {
    setShow(false);
    setTitle("");
    setMessage("");
    setButtons([]);
  }, []);

  const value = useMemo(
    () => ({
      alert: (...params: Parameters<AlertStatic["alert"]>) => {
        setShow(true);
        setTitle(params[0]);
        params[1] && setMessage(params[1]);
        params[2] && setButtons(params[2]);
      },
    }),
    [show, setShow]
  );

  const renderBtns = useMemo(() => {
    if (buttons?.length === 0) {
      return <AlertOption hide={closeAlert} />;
    }
    if (buttons?.length === 1) {
      return <AlertOption {...buttons[0]} hide={closeAlert} />;
    }
    if (buttons?.length === 2) {
      return (
        <View tw="flex-row items-center">
          {buttons.map((btn, i) => (
            <View key={`alert-option-${btn.text ?? i}`} tw="flex-1">
              <AlertOption {...btn} hide={closeAlert} />
            </View>
          ))}
        </View>
      );
    }
    return buttons.map((btn, i) => (
      <View key={`alert-option-${btn.text ?? i}`} tw="flex-1 mb-4 last:mb-0">
        <AlertOption {...btn} hide={closeAlert} />
      </View>
    ));
  }, [buttons, closeAlert]);

  return (
    <AlertContext.Provider value={value}>
      {children}
      <AnimatePresence>
        {show ? (
          <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
            <MotiView
              style={[StyleSheet.absoluteFillObject, tw.style("bg-black")]}
              from={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
            />
            <View tw="items-center justify-center w-full h-full">
              <MotiView
                style={tw.style(
                  "max-w-xs w-3/5 blur-sm bg-white dark:bg-black rounded-2xl px-4 py-4"
                )}
                from={{ transform: [{ scale: 1.1 }], opacity: 0 }}
                animate={{ transform: [{ scale: 1 }], opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ type: "timing", duration: 300 }}
              >
                {/* Maybe used. */}
                {/* <BlurView
                  tint={isDark ? "dark" : "light"}
                  intensity={85}
                  style={tw.style("w-fll h-full rounded-2xl")}
                /> */}
                <Text
                  tw="text-gray-900 dark:text-white text-center font-bold"
                  variant="text-lg"
                >
                  {title}
                </Text>

                {Boolean(message) && (
                  <Text
                    tw="text-gray-900 dark:text-white text-xs mt-4 text-center"
                    variant="text-base"
                  >
                    {message}
                  </Text>
                )}
                <Divider tw="my-4" />
                {renderBtns}
              </MotiView>
            </View>
          </View>
        ) : null}
      </AnimatePresence>
    </AlertContext.Provider>
  );
};

export const useAlert = () => {
  if (Platform.OS === "web") {
    const Alert = useContext(AlertContext);
    if (Alert === null) {
      console.error("Trying to use useAlert without a AlertProvider");
    }
    return Alert;
  } else {
    return RNAlert;
  }
};
