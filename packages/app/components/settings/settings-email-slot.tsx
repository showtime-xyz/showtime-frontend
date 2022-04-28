import { useCallback, useEffect, useState } from "react";

import Animated, { FadeIn } from "react-native-reanimated";

import { useCurrentUserAddress } from "app/hooks/use-current-user-address";
import { useWeb3 } from "app/hooks/use-web3";
import { magic } from "app/lib/magic";
import { WalletAddressesV2 } from "app/types";

import { Button, Skeleton, Text, View } from "design-system";
import { DataPill } from "design-system/data-pill";
import { useColorScheme } from "design-system/hooks";

import { AddEmail } from "./add-email";
import { AddressMenu } from "./address-menu";
import { SettingSubTitle } from "./settings-subtitle";

export type EmailSlotProps = {
  email: WalletAddressesV2["email"];
  address: WalletAddressesV2["address"];
};

export type EmailHeaderProps = {
  hasEmail: boolean;
};

export const SettingEmailSlotHeader = (props: EmailHeaderProps) => {
  const noEmailConnected = !props.hasEmail;
  const [viewAddEmail, setViewAddEmail] = useState(false);
  return (
    <View>
      <SettingSubTitle>
        <Text tw="text-xl font-bold text-gray-900 dark:text-white">
          Manage your email
        </Text>
        {noEmailConnected ? (
          <Button
            variant="primary"
            size="small"
            onPress={() => setViewAddEmail(true)}
          >
            Add Email
          </Button>
        ) : null}
      </SettingSubTitle>
      <AddEmail
        visibility={viewAddEmail}
        dismiss={() => setViewAddEmail(false)}
      />
    </View>
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

export const SettingsEmailSlotPlaceholder = () => {
  return (
    <Text tw="m-0 p-4 text-base font-bold text-gray-900 dark:text-white">
      No email connected to your profile.
    </Text>
  );
};

export const SettingsEmailSlot = (props: EmailSlotProps) => {
  const [isCurrentEmail, setIsCurrentEmail] = useState(false);
  const { web3 } = useWeb3();
  const { userAddress } = useCurrentUserAddress();

  const email = props.email;
  const isMagic = !!web3;

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
  }, [isMagic, email]);

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
        <AddressMenu
          address={backendAddress}
          ctaCopy="Delete Email Address"
          isCurrent={isCurrentEmail}
        />
      </View>
    </View>
  );
};
