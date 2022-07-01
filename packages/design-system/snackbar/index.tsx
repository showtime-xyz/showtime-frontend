import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";
import { AccessibilityInfo, ViewStyle, Dimensions } from "react-native";

import { MotiTransitionProp, StyleValueWithReplacedTransforms } from "moti";

import { PanToClose } from "design-system/pan-to-close";

import { SnackbarTransitionType } from "./constants";
import { initSnakbarParams, Snackbar } from "./snackbar";

const { height } = Dimensions.get("window");
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

export const SnackbarContext = createContext<SnackbarContextType | undefined>(
  undefined
);
export type SnackbarState = { show: boolean; snackbar: SnackbarShowParams };
export const SnackbarProvider: React.FC<{ children: JSX.Element }> = ({
  children,
}) => {
  const [state, setState] = useState<SnackbarState>({
    show: false,
    snackbar: initSnakbarParams,
  });

  const hideTimeoutRef = useRef<NodeJS.Timeout | null>();
  const hide = () => {
    setState({
      show: false,
      snackbar: initSnakbarParams,
    });
  };
  const setHideAfter = useCallback((duration: number | undefined) => {
    if (!duration) return;
    hideTimeoutRef.current = setTimeout(() => {
      hide();
    }, duration);
  }, []);
  const value = useMemo(
    () => ({
      show: ({ hideAfter, ...rest }: SnackbarShowParams) => {
        if (state.show) return;
        setState({
          show: true,
          snackbar: {
            ...state.snackbar,
            ...rest,
          },
        });
        hideTimeoutRef.current && clearTimeout(hideTimeoutRef.current);
        setHideAfter(hideAfter);
        rest.text && AccessibilityInfo.announceForAccessibility(rest.text);
      },
      update: ({ hideAfter, ...rest }: SnackbarShowParams) => {
        rest.text && AccessibilityInfo.announceForAccessibility(rest.text);
        setState({
          ...state,
          snackbar: {
            ...state.snackbar,
            ...rest,
          },
        });
        setHideAfter(hideAfter);
      },
      hide: () => {
        hide();
        hideTimeoutRef.current && clearTimeout(hideTimeoutRef.current);
      },
      isVisible: state.show,
    }),
    [state, setHideAfter]
  );

  return (
    <SnackbarContext.Provider value={value}>
      {children}
      <PanToClose
        panCloseDirection={
          state.snackbar?.bottom
            ? state.snackbar?.bottom > height / 2
              ? "top"
              : "bottom"
            : "bottom"
        }
        onClose={hide}
      >
        <Snackbar {...state} />
      </PanToClose>
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
