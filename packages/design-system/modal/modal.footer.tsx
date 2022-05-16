import { memo } from "react";

import {
  BottomSheetFooter,
  BottomSheetFooterContainer,
  useBottomSheetInternal,
} from "@gorhom/bottom-sheet";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import type { ModalFooterProps } from "./types";
import { useKeyboardOffset } from "./useKeyboardOffset";

function ModalFooterComponent({ children }: ModalFooterProps) {
  const bottomSheetContext = useBottomSheetInternal(true);
  const { bottom, top } = useSafeAreaInsets();
  const animatedContainerStyle = useKeyboardOffset(
    top,
    bottomSheetContext?.animatedKeyboardState
  );

  if (bottomSheetContext == null) {
    return children;
  }

  return (
    <BottomSheetFooterContainer
      footerComponent={(props) => (
        <BottomSheetFooter
          bottomInset={bottom}
          style={animatedContainerStyle}
          {...props}
        >
          {children}
        </BottomSheetFooter>
      )}
    />
  );
}

export const ModalFooter = memo(ModalFooterComponent);
