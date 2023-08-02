import { Platform, Modal, StyleSheet } from "react-native";

import { Button } from "@showtime-xyz/universal.button";
import { Image } from "@showtime-xyz/universal.image";
import { ModalHeader } from "@showtime-xyz/universal.modal";
// import { Modal } from "@showtime-xyz/universal.modal";
import { useRouter } from "@showtime-xyz/universal.router";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import { ButtonGoldLinearGradient } from "../gold-gradient";

type Props = {
  isOpen: boolean;
  close: () => void;
};
export const MissingStarDropModal = ({ isOpen, close }: Props) => {
  const router = useRouter();
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isOpen}
      onRequestClose={close}
    >
      <View tw="bg-black/70" style={StyleSheet.absoluteFillObject} />
      <View tw="flex-1 items-center justify-center px-4">
        <View tw="max-w-[380px] rounded-3xl bg-white dark:bg-gray-900">
          <ModalHeader title="Star Drops" onClose={close} />
          <View tw="items-center justify-center px-4 pb-6">
            <Image
              source={
                Platform.OS === "web"
                  ? "https://media.showtime.xyz/assets/st-logo.png"
                  : require("app/components/assets/st-logo.png")
              }
              width={50}
              height={50}
            />
            <View tw="pb-6 pt-8">
              <Text tw="text-base text-gray-900 dark:text-white">
                Star Drops are collectibles your fans pay for that unlock your
                channel content.
              </Text>
              <View tw="h-8" />
              <Text tw="text-base text-gray-900 dark:text-white">
                <Text tw="font-bold">Create a Star Drop </Text>
                to earn money and to allow users to see your channel updates.
              </Text>
            </View>
            <Button
              variant="primary"
              size="regular"
              onPress={() => {
                close();
                requestAnimationFrame(() => {
                  router.push("/drop/free");
                });
              }}
              tw="w-full"
              style={[
                {
                  backgroundColor: "transparent",
                },
              ]}
            >
              <ButtonGoldLinearGradient />
              <View tw="w-full flex-row items-center justify-center">
                <View>
                  <Image
                    source={
                      Platform.OS === "web"
                        ? "https://media.showtime.xyz/assets/st-logo.png"
                        : require("app/components/assets/st-logo.png")
                    }
                    width={24}
                    height={24}
                  />
                </View>

                <Text tw={["ml-2 text-base font-semibold text-black"]}>
                  Create a Star Drop
                </Text>
              </View>
            </Button>
          </View>
        </View>
      </View>
    </Modal>
  );
};
