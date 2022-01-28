import Animated, { FadeIn } from "react-native-reanimated";
import { View, Text, Button, Skeleton } from "design-system";
import { MoreHorizontal } from "design-system/icon";
import { useColorScheme } from "design-system/hooks";
import { SettingSubTitle } from "./settings-subtitle";
import { WalletAddressesV2 } from "app/types";
import { AddressMenu } from "./address-menu";

export type EmailSlotProps = {
  email: WalletAddressesV2["email"];
};

type EmailSlotHeaderProps = {
  onPress: () => void;
};

export const SettingEmailSlotHeader = (props: EmailSlotHeaderProps) => {
  const onPress = props?.onPress;
  return (
    <SettingSubTitle>
      <Text tw="text-gray-900 dark:text-white font-bold text-xl">
        Manage your emails
      </Text>
      <Button
        variant="tertiary"
        size="regular"
        onPress={onPress}
        disabled={true}
      >
        Add Wallet
      </Button>
    </SettingSubTitle>
  );
};

export const SettingsEmailSkeletonSlot = () => {
  const colorMode = useColorScheme();
  return (
    <View tw="p-4">
      <View tw="pb-3">
        <Skeleton
          height={16}
          width={128}
          show={true}
          colorMode={colorMode as any}
        >
          <Animated.View entering={FadeIn}></Animated.View>
        </Skeleton>
      </View>
      <View tw="pb-3">
        <Skeleton
          height={32}
          width={300}
          show={true}
          colorMode={colorMode as any}
        >
          <Animated.View entering={FadeIn}></Animated.View>
        </Skeleton>
      </View>
    </View>
  );
};

export const SettingsEmailSlot = (props: EmailSlotProps) => {
  const email = props.email;
  return (
    <View tw="flex-1 flex-row justify-between w-full p-4 items-center">
      <View tw="flex-1">
        <Text tw="text-gray-900 dark:text-white font-bold">{email}</Text>
      </View>
      <View tw="flex justify-center">
        <AddressMenu email={email} ctaCopy="Delete Email Address" />
      </View>
    </View>
  );
};
