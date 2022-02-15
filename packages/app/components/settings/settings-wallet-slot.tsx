import { useContext } from "react";

import Animated, { FadeIn } from "react-native-reanimated";

import { AppContext } from "app/context/app-context";
import { formatAddressShort } from "app/lib/utilities";
import { useWalletConnect } from "app/lib/walletconnect";
import { WalletAddressesExcludingEmailV2 } from "app/types";

import { View, Text, Button, Skeleton } from "design-system";
import { DataPill } from "design-system/data-pill";
import { useColorScheme } from "design-system/hooks";
import { Ethereum, Tezos } from "design-system/icon";

import { AddressMenu } from "./address-menu";
import { SettingSubTitle } from "./settings-subtitle";

type Props = {
  address: WalletAddressesExcludingEmailV2["address"];
  ensDomain?: WalletAddressesExcludingEmailV2["ens_domain"];
  mintingEnabled?: WalletAddressesExcludingEmailV2["minting_enabled"];
};

export const SettingsWalletSlotHeader = () => {
  return (
    <SettingSubTitle>
      <Text tw="text-gray-900 dark:text-white font-bold text-xl">
        Your Wallets
      </Text>
      <Button variant="primary" size="small">
        Add Wallet
      </Button>
    </SettingSubTitle>
  );
};

export const SettingsWalletSlotSkeleton = () => {
  const colorMode = useColorScheme();
  return (
    <View tw="flex-1 flex-row justify-between w-full p-4 max-h-[150px]">
      <View tw="flex justify-center">
        <Skeleton
          height={25}
          width={25}
          show={true}
          colorMode={colorMode as any}
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
            colorMode={colorMode as any}
          >
            <Animated.View entering={FadeIn}></Animated.View>
          </Skeleton>
        </View>
        <View tw="pb-3">
          <Skeleton
            height={16}
            width={256}
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
        <View>
          <Skeleton
            height={16}
            width={300}
            show={true}
            colorMode={colorMode as any}
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
    <Text tw="text-gray-900 dark:text-white text-base font-bold p-4">
      No wallet connected to your profile.
    </Text>
  );
};

export const SettingsWalletSlot = (props: Props) => {
  const context = useContext(AppContext);
  const connector = useWalletConnect();
  const notMagic = !!context.web3 === false;
  const address = props.address;
  const ensDomain = props.ensDomain;
  const mintingEnabled = props.mintingEnabled;
  const display = ensDomain ? ensDomain : formatAddressShort(address);
  const isEthereumAddress = address.startsWith("0x");
  const [connectedAddress] = connector?.session?.accounts;
  const isConnectedAddress =
    notMagic && connectedAddress.toLowerCase() === address.toLowerCase();
  const multiplePills = isConnectedAddress && mintingEnabled;

  return (
    <View tw="flex-1 flex-row justify-between w-full p-4 max-h-[150px]">
      <View tw="justify-center">
        <Button iconOnly={true} variant="secondary">
          {isEthereumAddress ? <Ethereum /> : <Tezos />}
        </Button>
      </View>
      <View tw="flex-1 px-4">
        <Text tw="text-gray-900 dark:text-white pb-3 text-base font-bold">
          {display}
        </Text>
        <View tw="pb-3 flex flex-row">
          {isConnectedAddress ? (
            <DataPill label="Current" type="secondary" />
          ) : null}
          {multiplePills ? <View tw="pr-2" /> : null}
          {mintingEnabled ? (
            <DataPill label="🔨 Minting Enabled" type="primary" />
          ) : null}
        </View>
        <Text tw="text-gray-900 dark:text-white text-xs pb-3">{address}</Text>
      </View>
      <View tw="flex justify-center">
        <AddressMenu address={address} ctaCopy="Delete Wallet" />
      </View>
    </View>
  );
};
