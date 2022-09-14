import { useEffect } from "react";

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
import { useUser } from "app/hooks/use-user";
import { formatAddressShort } from "app/lib/utilities";
import { WalletAddressesExcludingEmailV2 } from "app/types";

import { SettingSubTitle } from "./settings-subtitle";
import { WalletDropdownMenu } from "./wallet-dropdown-menu";

type Props = {
  address: WalletAddressesExcludingEmailV2["address"];
  ensDomain?: WalletAddressesExcludingEmailV2["ens_domain"];
  mintingEnabled?: WalletAddressesExcludingEmailV2["minting_enabled"];
  nickname?: string;
  onEditNickname: (wallet: string) => void;
};

export const SettingsWalletSlotHeader = () => {
  const toast = useToast();
  const { state, addWallet } = useAddWallet();

  const walletCTA =
    state.status === "error" ? "Connect Lost, Retry" : "Add Wallet";

  useEffect(() => {
    if (state.status === "error") {
      // TODO: Possible force logout
      toast?.show({
        message: "Wallet connection lost please try again",
        hideAfter: 4000,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.status]);

  return (
    <SettingSubTitle>
      <Text tw="text-xl font-bold text-gray-900 dark:text-white">
        Your Wallets
      </Text>
      <Button variant="primary" size="small" onPress={addWallet}>
        {walletCTA}
      </Button>
    </SettingSubTitle>
  );
};

export const SettingsWalletSlotSkeleton = () => {
  const { colorScheme } = useColorScheme();
  return (
    <View tw="max-h-[150px] w-full flex-1 flex-row justify-between p-4">
      <View tw="w-full px-4">
        <View tw="w-full pb-3">
          <Skeleton
            height={16}
            width={200}
            show={true}
            colorMode={colorScheme as any}
          />
        </View>
        <View tw="pb-3">
          <Skeleton
            height={16}
            width={"70%"}
            show={true}
            colorMode={colorScheme as any}
          />
        </View>
        <View>
          <Skeleton
            height={16}
            width={300}
            show={true}
            colorMode={colorScheme as any}
          />
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
  const user = useUser();

  const display = ensDomain ? ensDomain : formatAddressShort(address);
  const nickname = props.nickname;
  const isEthereumAddress = address.startsWith("0x");

  const isConnectedAddress =
    userAddress?.toLowerCase() === address?.toLowerCase();

  const isPrimary = user.user?.data.profile.primary_wallet?.address === address;

  return (
    <>
      <View tw="md:px-4">
        <View tw="md:dark:shadow-dark md:shadow-light w-full flex-row justify-between p-4 md:rounded-2xl md:bg-white md:dark:bg-black">
          <View tw="justify-center">
            <Button iconOnly={true} variant="secondary">
              {isEthereumAddress ? <Ethereum /> : <Tezos />}
            </Button>
          </View>
          <View tw="flex-1 px-4">
            <View>
              <Text tw="pb-4 text-base font-bold text-gray-900 dark:text-white">
                {nickname}
              </Text>
              <View tw="md:mb-3 md:flex-row">
                <Text tw="text-base font-bold text-gray-900 dark:text-white md:self-center">
                  {display}
                </Text>
                <View tw="my-2 flex flex-row md:my-0">
                  {isConnectedAddress ? (
                    <DataPill label="Current" tw="md:ml-2" type="primary" />
                  ) : null}
                  {isPrimary ? (
                    <DataPill label="Primary" tw="md:ml-2" type="secondary" />
                  ) : null}
                </View>
              </View>
            </View>
            <Text tw=" text-xs text-gray-900 dark:text-white">{address}</Text>
          </View>
          <View tw="flex justify-center">
            <WalletDropdownMenu
              address={address}
              isCurrent={isConnectedAddress}
              onEditNickname={props.onEditNickname}
              isPrimary={isPrimary}
            />
          </View>
        </View>
      </View>
    </>
  );
};
