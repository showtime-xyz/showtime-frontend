import { Platform } from "react-native";

import { Button } from "@showtime-xyz/universal.button";
import { Image } from "@showtime-xyz/universal.image";
import { Modal } from "@showtime-xyz/universal.modal";
import { useRouter } from "@showtime-xyz/universal.router";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import { ButtonGoldLinearGradient } from "../gold-gradient";

type Props = {
  isOpen: boolean;
  onClose?: () => void;
  close: () => void;
};
export const MissingStarDropModal = ({ isOpen, onClose, close }: Props) => {
  const router = useRouter();
  return (
    <Modal
      mobile_snapPoints={[380]}
      visible={isOpen}
      onClose={onClose}
      close={close}
    >
      <View tw="min-h- items-center px-4 pb-4 md:px-8">
        <Image
          source={
            Platform.OS === "web"
              ? "https://media.showtime.xyz/assets/st-logo.png"
              : require("app/components/assets/st-logo.png")
          }
          width={50}
          height={50}
        />
        <View tw="py-6">
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
            if (Platform.OS !== "web") {
              router.push("/drop/free");
            } else {
              router.replace("/drop/free");
            }
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
              Collect Star Drop
            </Text>
          </View>
        </Button>
      </View>
    </Modal>
  );
};
