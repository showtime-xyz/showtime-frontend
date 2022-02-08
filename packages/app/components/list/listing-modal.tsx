import { ReactNode } from "react";
import { Platform } from "react-native";
import { View } from "design-system";
import { Modal, ModalSheet } from "design-system";
import { useMemo } from "react";
import { useRouter } from "app/navigation/use-router";

type Props = {
  children: ReactNode;
};

const NativeModal = Platform.OS === "android" ? ModalSheet : Modal;

const ListingModal = (props: Props) => {
  const children = props.children;
  const snapPoints = useMemo(() => ["90%"], []);
  const router = useRouter();
  return (
    <NativeModal
      // TODO: Ask for copy feedback
      title="List NFT"
      close={router.pop}
      snapPoints={snapPoints}
      height="h-[90vh]"
      bodyTW="bg-white dark:bg-black"
    >
      <View tw="flex-1">{children}</View>
    </NativeModal>
  );
};

export { ListingModal };
