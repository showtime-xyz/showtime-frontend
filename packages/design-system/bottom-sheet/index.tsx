import {
  ComponentProps,
  ComponentType,
  MutableRefObject,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from "react";
import { StyleProp, ViewStyle } from "react-native";

import {
  BottomSheetBackdrop,
  BottomSheetHandleProps,
  BottomSheetModal,
  BottomSheetTextInput as BottomSheetInput,
  BottomSheetBackdropProps,
} from "@gorhom/bottom-sheet";
import { useTailwind } from "tailwindcss-react-native";

import { useSafeAreaInsets } from "app/lib/safe-area";

import type { TW } from "design-system/tailwind/types";
import { View } from "design-system/view";

type BottomSheetProps = {
  children?: React.ReactElement;
  handleComponent?: React.FC<BottomSheetHandleProps>;
  visible?: boolean;
  onDismiss?: () => void;
  snapPoints?: string[];
  bodyStyle?: StyleProp<ViewStyle>;
};

export const BottomSheet = (props: BottomSheetProps) => {
  const {
    children,
    visible,
    handleComponent,
    onDismiss,
    snapPoints,
    bodyStyle,
  } = props;
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const { bottom: safeAreaBottom } = useSafeAreaInsets();
  const tailwind = useTailwind();

  useEffect(() => {
    if (visible) {
      bottomSheetModalRef.current?.present();
    } else {
      bottomSheetModalRef.current?.dismiss();
    }
  }, [visible]);

  const defaultSnapPoints = useMemo(() => ["90%", "100%"], []);

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
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
      handleIndicatorStyle={tailwind(`bg-gray-300 dark:bg-gray-700 w-12 h-1`)}
      backgroundStyle={tailwind(`bg-white dark:bg-black rounded-t-[32px]`)}
      snapPoints={snapPoints ?? defaultSnapPoints}
    >
      <View
        style={[
          tailwind(`flex-1 px-4 pt-6 mb-[${safeAreaBottom}px]`),
          bodyStyle,
        ]}
      >
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
  const tailwind = useTailwind();
  const { tw, style, componentRef, ...textInputProps } = props;

  return (
    <BottomSheetInput
      style={[tailwind.style(tw), style]}
      //@ts-ignore
      ref={componentRef}
      {...textInputProps}
    />
  );
};
