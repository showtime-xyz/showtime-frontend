import { useState, useRef, createContext, useMemo, useContext } from "react";
import { AccessibilityInfo } from "react-native";

import { ToastContainer } from "./toast-container";

type ShowParams = {
  message?: string;
  hideAfter?: number;
  element?: React.ReactElement;
};

type ToastContextType = {
  show: (params: ShowParams) => void;
  hide: () => void;
  isVisible: boolean;
};

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider = ({ children }: any) => {
  const [show, setShow] = useState(false);
  const [message, setMessage] = useState<string | undefined>();
  const [render, setRender] = useState<JSX.Element | null>();
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

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastContainer
        show={show}
        hide={value.hide}
        message={message}
        render={render}
      />
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const toast = useContext(ToastContext);
  if (toast === null) {
    console.error("Trying to use useToast without a ToastProvider");
  }

  return toast;
};
