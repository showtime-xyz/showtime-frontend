import { useCallback, useEffect, useState } from "react";

import Animated, { FadeIn } from "react-native-reanimated";

import { Button } from "@showtime-xyz/universal.button";
import { useColorScheme } from "@showtime-xyz/universal.color-scheme";
import { DataPill } from "@showtime-xyz/universal.data-pill";
import { Skeleton } from "@showtime-xyz/universal.skeleton";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import { useCurrentUserAddress } from "app/hooks/use-current-user-address";
import { useManageAccount } from "app/hooks/use-manage-account";
import { useWeb3 } from "app/hooks/use-web3";
import { useMagic } from "app/lib/magic";
import { WalletAddressesV2 } from "app/types";

import { DropdownMenu } from "./dropdown-menu";
import { SettingSubTitle } from "./settings-subtitle";

export type PhoneNumberSlotProps = {
  phoneNumber: WalletAddressesV2["phone_number"];
  address: WalletAddressesV2["address"];
};

export type PhoneNumberHeaderProps = {
  hasPhoneNumber: boolean;
  onVerifyPhoneNumber: () => void;
};

export const SettingPhoneNumberSlotHeader = ({
  hasPhoneNumber,
  onVerifyPhoneNumber,
}: PhoneNumberHeaderProps) => {
  return (
    <View>
      <SettingSubTitle>
        <Text tw="text-xl font-bold text-gray-900 dark:text-white">
          Manage your phone
        </Text>
        {!hasPhoneNumber ? (
          <Button variant="primary" size="small" onPress={onVerifyPhoneNumber}>
            Verify Phone Number
          </Button>
        ) : null}
      </SettingSubTitle>
    </View>
  );
};

export const SettingsPhoneNumberSkeletonSlot = () => {
  const { colorScheme } = useColorScheme();

  return (
    <View tw="p-4">
      <View tw="pb-3">
        <Skeleton
          height={16}
          width={128}
          show={true}
          colorMode={colorScheme as any}
        >
          <Animated.View entering={FadeIn}></Animated.View>
        </Skeleton>
      </View>
      <View tw="pb-3">
        <Skeleton
          height={32}
          width={300}
          show={true}
          colorMode={colorScheme as any}
        >
          <Animated.View entering={FadeIn}></Animated.View>
        </Skeleton>
      </View>
    </View>
  );
};

export const SettingsPhoneNumberSlotPlaceholder = () => {
  return (
    <Text
      tw="p-4 text-base font-bold text-gray-900 dark:text-white"
      style={{ margin: 0 }}
    >
      No phone number connected to your profile.
    </Text>
  );
};

export const SettingsPhoneNumberSlot = (props: PhoneNumberSlotProps) => {
  const [isCurrentPhoneNumber, setIsCurrentPhoneNumber] = useState(false);
  const { magic } = useMagic();
  const { isMagic } = useWeb3();
  const { userAddress } = useCurrentUserAddress();
  const { removePhoneNumber } = useManageAccount();

  const phoneNumber = props.phoneNumber;
  const address = props.address;

  const getCurrentMagicUser = useCallback(async () => {
    if (isMagic) {
      const magicMetaData = await magic?.user?.getMetadata();
      const currentPhoneNumber = magicMetaData.phoneNumber;
      const currentMagicAddress = magicMetaData.publicAddress;
      const isMatchingMagicPhoneNumber =
        currentPhoneNumber?.toLowerCase() === phoneNumber?.toLowerCase();
      const isMatchingMagicAddress =
        currentMagicAddress?.toLowerCase() === userAddress?.toLowerCase();
      if (isMatchingMagicPhoneNumber && isMatchingMagicAddress) {
        setIsCurrentPhoneNumber(true);
      }
    }
  }, [magic, isMagic, phoneNumber, userAddress]);

  useEffect(() => {
    getCurrentMagicUser();
  }, [getCurrentMagicUser]);

  return (
    <View tw="w-full flex-1 flex-row items-center justify-between p-4">
      <View tw="flex-1">
        <Text tw="pb-3 font-bold text-gray-900 dark:text-white">
          {phoneNumber}
        </Text>
        {isCurrentPhoneNumber ? (
          <View tw="flex flex-row">
            <DataPill label="Current" type="secondary" />
          </View>
        ) : null}
      </View>
      <View tw="flex justify-center">
        <DropdownMenu
          ctaCopy="Delete Phone Number"
          isCurrent={isCurrentPhoneNumber}
          onRemove={() => removePhoneNumber(address)}
        />
      </View>
    </View>
  );
};
