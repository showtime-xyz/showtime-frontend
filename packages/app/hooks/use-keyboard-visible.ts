import { useEffect, useState } from "react";
import { Keyboard, Platform } from "react-native";

const isIOS = Platform.OS === "ios";
export const useKeyboardVisible = () => {
  const [visible, setVisible] = useState(false);
  const showEvent = isIOS ? "keyboardWillShow" : "keyboardDidShow";
  const hideEvent = isIOS ? "keyboardWillHide" : "keyboardDidHide";

  const dismiss = () => {
    Keyboard.dismiss();
    setVisible(false);
  };

  useEffect(() => {
    const onKeyboardShow = () => {
      setVisible(true);
    };

    const onKeyboardHide = () => {
      setVisible(false);
    };

    const showSubscription = Keyboard.addListener(showEvent, onKeyboardShow);
    const hideSubscription = Keyboard.addListener(hideEvent, onKeyboardHide);

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { visible, dismiss };
};
