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
  BottomSheetProps as BSProps,
} from "@gorhom/bottom-sheet";

import { useIsDarkMode } from "@showtime-xyz/universal.hooks";
import { useLockBodyScroll } from "@showtime-xyz/universal.hooks";
import { useSafeAreaInsets } from "@showtime-xyz/universal.safe-area";
import { styled, colors } from "@showtime-xyz/universal.tailwind";
import type { TW } from "@showtime-xyz/universal.tailwind";
import { View } from "@showtime-xyz/universal.view";

type BottomSheetProps = {
  children?: React.ReactElement;
  handleComponent?: React.FC<BottomSheetHandleProps>;
  visible?: boolean;
  onDismiss?: () => void;
  snapPoints?: BSProps["snapPoints"];
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

  useLockBodyScroll(visible);
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const { bottom: safeAreaBottom } = useSafeAreaInsets();
  const isDark = useIsDarkMode();

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
      handleIndicatorStyle={{
        backgroundColor: isDark ? colors.gray[700] : colors.gray[300],
        width: 48,
        height: 4,
      }}
      backgroundStyle={{
        backgroundColor: isDark ? "#000" : "#FFF",
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
      }}
      snapPoints={snapPoints ?? defaultSnapPoints}
    >
      <View
        tw="flex-1 px-4"
        style={[{ marginBottom: safeAreaBottom }, bodyStyle]}
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

const StyledBottomSheetInput = styled(BottomSheetInput);

export const BottomSheetTextInput = (props: TextInputProps) => {
  const { componentRef, ...textInputProps } = props;

  return (
    <StyledBottomSheetInput
      //@ts-ignore
      ref={componentRef}
      {...textInputProps}
    />
  );
};
