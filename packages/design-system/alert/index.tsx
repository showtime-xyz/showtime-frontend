import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  useEffect,
} from "react";
import {
  Alert as RNAlert,
  AlertButton,
  AlertStatic,
  Platform,
} from "react-native";

import { View } from "@showtime-xyz/universal.view";

import { AlertContainer } from "./alert-container";
import { AlertOption } from "./alert-option";

type AlertContextType = {
  alert: (...params: Parameters<AlertStatic["alert"]>) => void;
  /**
   * check out AlertProvider is installed
   */
  isMounted?: boolean;
};

export const AlertContext = createContext<AlertContextType>({
  /**
   * use Alert.alert instead of Alert?.alert
   */
  alert: () => undefined,
  isMounted: false,
});
export let Alert: AlertContextType = Platform.select({
  web: {
    alert: (...params: Parameters<AlertStatic["alert"]>) => undefined,
  } as RNAlert,
  default: RNAlert,
});

export const AlertProvider: React.FC<{ children: JSX.Element }> = ({
  children,
}) => {
  const [show, setShow] = useState(false);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [buttons, setButtons] = useState<AlertButton[]>([]);

  const onModalDismiss = useCallback(() => {
    setTitle("");
    setMessage("");
    setButtons([]);
  }, []);

  const closeAlert = useCallback(() => {
    setShow(false);
    onModalDismiss();
  }, [onModalDismiss]);

  const value = useMemo(
    () => ({
      alert: (...params: Parameters<AlertStatic["alert"]>) => {
        setShow(true);
        setTitle(params[0]);
        params[1] && setMessage(params[1]);
        params[2] && setButtons(params[2]);
      },
      isMounted: true,
    }),
    []
  );
  useEffect(() => {
    if (Platform.OS === "web") {
      Alert = value;
    }
  }, [value]);
  const renderBtns = useMemo(() => {
    if (buttons?.length === 0) {
      return <AlertOption hide={closeAlert} />;
    }
    if (buttons?.length === 1) {
      return <AlertOption {...buttons[0]} hide={closeAlert} />;
    }
    if (buttons?.length === 2) {
      return (
        <View tw="flex-row items-center justify-between">
          {buttons.map((btn, i) => (
            <View key={`alert-option-${btn.text ?? i}`}>
              <AlertOption {...btn} hide={closeAlert} />
            </View>
          ))}
        </View>
      );
    }
    return buttons.map((btn, i) => (
      <View key={`alert-option-${btn.text ?? i}`} tw="mb-4 last:mb-0">
        <AlertOption {...btn} hide={closeAlert} />
      </View>
    ));
  }, [buttons, closeAlert]);

  return (
    <AlertContext.Provider value={value}>
      {children}
      <AlertContainer
        title={title}
        message={message}
        renderBtns={renderBtns}
        show={show}
        onModalDismiss={onModalDismiss}
      />
    </AlertContext.Provider>
  );
};

export const useAlert = () => {
  const Alert = useContext(AlertContext);

  if (Platform.OS === "web") {
    if (!Alert.isMounted) {
      console.error("Trying to use useAlert without a AlertProvider");
    }
    return Alert;
  } else {
    return RNAlert;
  }
};

// If we need to use the same Alert style on the cross-platform, use this hooks.
export const useCustomAlert = () => {
  const Alert = useContext(AlertContext);
  if (!Alert.isMounted) {
    console.error("Trying to use useAlert without a AlertProvider");
  }
  return Alert;
};
