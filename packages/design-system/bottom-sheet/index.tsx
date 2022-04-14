import {
  useRef,
  useMemo,
  useCallback,
  useEffect,
  ComponentProps,
  MutableRefObject,
  ComponentType,
} from "react";

import {
  BottomSheetModal,
  BottomSheetBackdrop,
  BottomSheetHandleProps,
  BottomSheetTextInput as BottomSheetInput,
} from "@gorhom/bottom-sheet";

import { useSafeAreaInsets } from "app/lib/safe-area";

import { tw as tailwind } from "design-system/tailwind";
import type { TW } from "design-system/tailwind/types";
import { View } from "design-system/view";

type BottomSheetProps = {
  children?: React.ReactElement;
  handleComponent?: React.FC<BottomSheetHandleProps>;
  visible?: boolean;
  onDismiss?: () => void;
  snapPoints?: string[];
  bodyContentTW?: TW;
};

export const BottomSheet = (props: BottomSheetProps) => {
  const {
    children,
    visible,
    handleComponent,
    onDismiss,
    snapPoints,
    bodyContentTW = "",
  } = props;
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const { bottom: safeAreaBottom } = useSafeAreaInsets();

  useEffect(() => {
    if (visible) {
      bottomSheetModalRef.current?.present();
    } else {
      bottomSheetModalRef.current?.dismiss();
    }
  }, [visible]);

  const defaultSnapPoints = useMemo(() => ["50%", "75%"], []);

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
      handleIndicatorStyle={tailwind.style(
        `bg-gray-300 dark:bg-gray-700 w-12 h-1`
      )}
      backgroundStyle={tailwind.style(
        `bg-white dark:bg-black rounded-t-[32px]`
      )}
      snapPoints={snapPoints ?? defaultSnapPoints}
    >
      <View tw={[`flex-1 pt-6 px-4 mb-[${safeAreaBottom}px]`, bodyContentTW]}>
        {children}
      </View>
    </BottomSheetModal>
  );
};

export type TextInputProps = {
  tw?: TW;
  componentRef?: MutableRefObject<ComponentType | undefined>;
} & ComponentProps<typeof BottomSheetInput>;

export const BottomSheetTextInput = (props: TextInputProps) => {
  const { tw, style, componentRef, ...textInputProps } = props;
  const styles = { ...tailwind.style(tw), ...(style as {}) };
  return (
    <BottomSheetInput
      style={styles}
      //@ts-ignore
      ref={componentRef}
      {...textInputProps}
    />
  );
};
