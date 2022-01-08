import { useRef, useMemo, useCallback, useEffect } from "react";
import {
  BottomSheetModal,
  BottomSheetBackdrop,
  BottomSheetHandleProps,
} from "@gorhom/bottom-sheet";

import { View } from "@showtime/universal-ui.view";
import { tw } from "@showtime/universal-ui.tailwind";

type BottomSheetProps = {
  children?: React.ReactElement;
  handleComponent?: React.FC<BottomSheetHandleProps>;
  visible?: boolean;
  onDismiss?: () => void;
};

export const BottomSheet = (props: BottomSheetProps) => {
  const { children, visible, handleComponent, onDismiss } = props;

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  useEffect(() => {
    if (visible) {
      bottomSheetModalRef.current?.present();
    } else {
      bottomSheetModalRef.current?.dismiss();
    }
  }, [visible]);

  const snapPoints = useMemo(() => ["50%", "75%"], []);

  const renderBackdrop = useCallback(
    (props) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
      />
    ),
    []
  );

  return (
    <BottomSheetModal
      backdropComponent={renderBackdrop}
      handleComponent={handleComponent}
      onDismiss={onDismiss}
      ref={bottomSheetModalRef}
      index={0}
      handleIndicatorStyle={tw.style(`bg-gray-300 dark:bg-gray-700 w-12 h-1`)}
      backgroundStyle={tw.style(`bg-white dark:bg-black rounded-t-[32px]`)}
      snapPoints={snapPoints}
    >
      <View tw="flex-1 pt-6 px-4">{children}</View>
    </BottomSheetModal>
  );
};
