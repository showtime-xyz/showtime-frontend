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

export type EmailSlotProps = {
  email: WalletAddressesV2["email"];
  address: WalletAddressesV2["address"];
};

export type EmailHeaderProps = {
  hasEmail: boolean;
  onAddEmail: () => void;
};

export const SettingEmailSlotHeader = ({
  hasEmail,
  onAddEmail,
}: EmailHeaderProps) => {
  return (
    <View>
      <SettingSubTitle>
        <Text tw="text-xl font-bold text-gray-900 dark:text-white">
          Manage your email
        </Text>
        {!hasEmail ? (
          <Button variant="primary" size="small" onPress={onAddEmail}>
            Add Email
          </Button>
        ) : null}
      </SettingSubTitle>
    </View>
  );
};

export const SettingsEmailSkeletonSlot = () => {
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

export const SettingsEmailSlotPlaceholder = () => {
  return (
    <>
      <Text tw="p-4 text-base font-bold text-gray-900 dark:text-white">
        No email connected to your profile.
      </Text>
      <View tw="h-2" />
    </>
  );
};

export const SettingsEmailSlot = (props: EmailSlotProps) => {
  const [isCurrentEmail, setIsCurrentEmail] = useState(false);
  const { removeAccount } = useManageAccount();
  const { magic } = useMagic();
  const { isMagic } = useWeb3();
  const { userAddress } = useCurrentUserAddress();

  const email = props.email;

  const backendAddress = props.address;

  const getCurrentMagicUser = useCallback(async () => {
    if (isMagic) {
      const magicMetaData = await magic?.user?.getMetadata();
      const currentEmail = magicMetaData.email;
      const currentMagicAddress = magicMetaData.publicAddress;
      const isMatchingMagicEmail =
        currentEmail?.toLowerCase() === email?.toLowerCase();
      const isMatchingMagicAddress =
        currentMagicAddress?.toLowerCase() === userAddress?.toLowerCase();
      if (isMatchingMagicEmail && isMatchingMagicAddress) {
        setIsCurrentEmail(true);
      }
    }
  }, [magic, isMagic, email, userAddress]);

  useEffect(() => {
    getCurrentMagicUser();
  }, [getCurrentMagicUser]);

  return (
    <View tw="w-full flex-1 flex-row items-center justify-between p-4">
      <View tw="flex-1">
        <Text tw="pb-3 font-bold text-gray-900 dark:text-white">{email}</Text>
        {isCurrentEmail ? (
          <View tw="flex flex-row">
            <DataPill label="Current" type="secondary" />
          </View>
        ) : null}
      </View>
      <View tw="flex justify-center">
        <DropdownMenu
          onRemove={() => removeAccount(backendAddress)}
          ctaCopy="Delete Email Address"
          isCurrent={isCurrentEmail}
        />
      </View>
    </View>
  );
};
