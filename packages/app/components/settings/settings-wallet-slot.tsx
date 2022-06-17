import { useEffect } from "react";

import Animated, { FadeIn } from "react-native-reanimated";

import { useAlert } from "@showtime-xyz/universal.alert";
import { Button } from "@showtime-xyz/universal.button";
import { useColorScheme } from "@showtime-xyz/universal.color-scheme";
import { DataPill } from "@showtime-xyz/universal.data-pill";
import { Ethereum, Tezos } from "@showtime-xyz/universal.icon";
import { Skeleton } from "@showtime-xyz/universal.skeleton";
import { Text } from "@showtime-xyz/universal.text";
import { useToast } from "@showtime-xyz/universal.toast";
import { View } from "@showtime-xyz/universal.view";

import { useAddWallet } from "app/hooks/use-add-wallet";
import { useCurrentUserAddress } from "app/hooks/use-current-user-address";
import { formatAddressShort } from "app/lib/utilities";
import { WalletAddressesExcludingEmailV2 } from "app/types";

import { AddressMenu } from "./address-menu";
import { SettingSubTitle } from "./settings-subtitle";

type Props = {
  address: WalletAddressesExcludingEmailV2["address"];
  ensDomain?: WalletAddressesExcludingEmailV2["ens_domain"];
  mintingEnabled?: WalletAddressesExcludingEmailV2["minting_enabled"];
};

export const SettingsWalletSlotHeader = () => {
  const Alert = useAlert();
  const toast = useToast();
  const { state, addWallet } = useAddWallet();

  const connectionError = state.status === "error";
  const walletCTA = connectionError ? "Connect Lost, Retry" : "Add Wallet";

  useEffect(() => {
    if (connectionError) {
      // TODO: Possible force logout
      toast?.show({
        message: "Wallet connection lost please try again",
        hideAfter: 4000,
      });
    }
  }, [state.status, connectionError, toast]);

  const triggerAddWallet = async () => {
    Alert.alert(
      "Showcase all your NFTs",
      "If you previously signed in with the wallet you are adding, your other profile will get merged into this profile.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Select Wallet",
          style: "default",
          onPress: async () => {
            await addWallet();
          },
        },
      ]
    );
  };

  return (
    <SettingSubTitle>
      <Text tw="text-xl font-bold text-gray-900 dark:text-white">
        Your Wallets
      </Text>
      <Button variant="primary" size="small" onPress={triggerAddWallet}>
        {walletCTA}
      </Button>
    </SettingSubTitle>
  );
};

export const SettingsWalletSlotSkeleton = () => {
  const { colorScheme } = useColorScheme();
  return (
    <View tw="max-h-[150px] w-full flex-1 flex-row justify-between p-4">
      <View tw="flex justify-center">
        <Skeleton
          height={25}
          width={25}
          show={true}
          colorMode={colorScheme as any}
          radius="round"
        >
          <Animated.View entering={FadeIn}></Animated.View>
        </Skeleton>
      </View>
      <View tw="px-4">
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
            height={16}
            width={256}
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
        <View>
          <Skeleton
            height={16}
            width={300}
            show={true}
            colorMode={colorScheme as any}
          >
            <Animated.View entering={FadeIn}></Animated.View>
          </Skeleton>
        </View>
      </View>
    </View>
  );
};

export const SettingsWalletSlotPlaceholder = () => {
  return (
    <Text tw="p-4 text-base font-bold text-gray-900 dark:text-white">
      No wallet connected to your profile.
    </Text>
  );
};

export const SettingsWalletSlot = (props: Props) => {
  const address = props.address;
  const ensDomain = props.ensDomain;

  const { userAddress } = useCurrentUserAddress();

  const mintingEnabled = props.mintingEnabled;
  const display = ensDomain ? ensDomain : formatAddressShort(address);
  const isEthereumAddress = address.startsWith("0x");

  const isConnectedAddress =
    userAddress.toLowerCase() === address?.toLowerCase();
  const multiplePills = isConnectedAddress && mintingEnabled;

  return (
    <View tw="max-h-[150px] w-full flex-1 flex-row justify-between p-4">
      <View tw="justify-center">
        <Button iconOnly={true} variant="secondary">
          {isEthereumAddress ? <Ethereum /> : <Tezos />}
        </Button>
      </View>
      <View tw="flex-1 px-4">
        <Text tw="pb-3 text-base font-bold text-gray-900 dark:text-white">
          {display}
        </Text>
        <View tw="flex flex-row pb-3">
          {isConnectedAddress ? (
            <DataPill label="Current" type="secondary" />
          ) : null}
          {multiplePills ? <View tw="pr-2" /> : null}
          {mintingEnabled ? (
            <DataPill label="🔨 Minting Enabled" type="primary" />
          ) : null}
        </View>
        <Text tw="pb-3 text-xs text-gray-900 dark:text-white">{address}</Text>
      </View>
      <View tw="flex justify-center">
        <AddressMenu
          address={address}
          ctaCopy="Delete Wallet"
          isCurrent={isConnectedAddress}
        />
      </View>
    </View>
  );
};
