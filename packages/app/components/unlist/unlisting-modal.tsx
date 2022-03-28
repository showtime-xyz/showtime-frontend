import { ReactNode, useMemo } from "react";
import { Platform } from "react-native";

import { useRouter } from "app/navigation/use-router";

import { View } from "design-system";
import { Modal, ModalSheet } from "design-system";

type Props = {
  children: ReactNode;
};

const NativeModal = Platform.OS === "android" ? ModalSheet : Modal;

const UnlistingModal = (props: Props) => {
  const children = props.children;
  const snapPoints = useMemo(() => ["90%"], []);
  const router = useRouter();
  return (
    <NativeModal
      title="Unlist"
      close={router.pop}
      snapPoints={snapPoints}
      height="h-[80vh]"
      bodyTW="bg-white dark:bg-black"
      bodyContentTW="p-0"
    >
      <View tw="flex-1">{children}</View>
    </NativeModal>
  );
};

export { UnlistingModal };
