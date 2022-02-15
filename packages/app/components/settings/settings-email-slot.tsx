import { useContext, useEffect, useState, useCallback } from "react";

import Animated, { FadeIn } from "react-native-reanimated";

import { AppContext } from "app/context/app-context";
import { magic } from "app/lib/magic";
import { WalletAddressesV2 } from "app/types";

import { View, Text, Button, Skeleton } from "design-system";
import { DataPill } from "design-system/data-pill";
import { useColorScheme } from "design-system/hooks";

import { AddEmail } from "./add-email";
import { AddressMenu } from "./address-menu";
import { SettingSubTitle } from "./settings-subtitle";

export type EmailSlotProps = {
  email: WalletAddressesV2["email"];
};

export const SettingEmailSlotHeader = () => {
  const [viewAddEmail, setViewAddEmail] = useState(false);
  return (
    <View>
      <SettingSubTitle>
        <Text tw="text-gray-900 dark:text-white font-bold text-xl">
          Manage your emails
        </Text>
        <Button
          variant="primary"
          size="small"
          onPress={() => setViewAddEmail(true)}
        >
          Add Email
        </Button>
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
    <Text tw="text-gray-900 dark:text-white text-base font-bold p-4">
      No email connected to your profile.
    </Text>
  );
};

export const SettingsEmailSlot = (props: EmailSlotProps) => {
  const [isCurrentEmail, setIsCurrentEmail] = useState(false);
  const [magicAddress, setMagicAddress] = useState<string>();
  const context = useContext(AppContext);
  const email = props.email;
  const isMagic = !!context.web3;

  const getCurrentMagicUser = useCallback(async () => {
    if (isMagic) {
      const magicMetaData = await magic?.user?.getMetadata();
      const currentEmail = magicMetaData.email;
      const currentMagicAddress = magicMetaData.publicAddress;
      const isMatchingMagic =
        currentEmail?.toLowerCase() === email?.toLowerCase();
      if (isMatchingMagic) {
        setIsCurrentEmail(true);
      }

      if (isMatchingMagic && currentMagicAddress) {
        setMagicAddress(currentMagicAddress);
      }
    }
  }, [isMagic, email]);

  useEffect(() => {
    getCurrentMagicUser();
  }, [getCurrentMagicUser]);

  return (
    <View tw="flex-1 flex-row justify-between w-full p-4 items-center">
      <View tw="flex-1">
        <Text tw="text-gray-900 dark:text-white font-bold pb-3">{email}</Text>
        {isCurrentEmail ? (
          <View tw="flex flex-row">
            <DataPill label="Current" type="secondary" />
          </View>
        ) : null}
      </View>
      <View tw="flex justify-center">
        <AddressMenu address={magicAddress} ctaCopy="Delete Email Address" />
      </View>
    </View>
  );
};
