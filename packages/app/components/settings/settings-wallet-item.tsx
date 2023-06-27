import React from "react";

import { SvgProps } from "react-native-svg";

import { useIsDarkMode } from "@showtime-xyz/universal.hooks";
import {
  Ethereum,
  Tezos,
  Check,
  Mail,
  PhonePortraitOutline,
  GoogleOriginal,
  Apple,
  Twitter,
} from "@showtime-xyz/universal.icon";
import { PressableHover } from "@showtime-xyz/universal.pressable-hover";
import { colors } from "@showtime-xyz/universal.tailwind";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import { useSetPrimaryWallet } from "app/hooks/api/use-set-primary-wallet";
import { useCurrentUserAddress } from "app/hooks/use-current-user-address";
import { useUser } from "app/hooks/use-user";
import { WalletAddressesV2 } from "app/types";
import { formatAddressShort } from "app/utilities";

import { Hidden } from "design-system/hidden";

import { WalletDropdownMenu } from "./wallet-dropdown-menu";

type Props = {
  wallet: WalletAddressesV2;
  onEditNickname: () => void;
};

type WalletLoginWithProps = {
  Icon?: (props: SvgProps) => JSX.Element;
  text: string;
};
const LoginWithPlatformTitle = ({ Icon, text }: WalletLoginWithProps) => {
  const isDark = useIsDarkMode();

  return (
    <View tw="flex-row items-center">
      {Icon && (
        <Icon
          color={isDark ? colors.white : colors.gray[900]}
          width={16}
          height={16}
        />
      )}
      <Text tw="ml-1 text-sm font-medium text-gray-900 dark:text-white">
        {text}
      </Text>
    </View>
  );
};
const Title = ({ wallet }: { wallet: WalletAddressesV2 }) => {
  if (wallet.email && wallet.is_email) {
    return <LoginWithPlatformTitle text={wallet.email} Icon={Mail} />;
  }
  if (wallet.phone_number && wallet.is_phone) {
    return (
      <LoginWithPlatformTitle
        text={wallet.phone_number}
        Icon={PhonePortraitOutline}
      />
    );
  }
  if (wallet.is_google) {
    return (
      <LoginWithPlatformTitle
        text={"Login from Google"}
        Icon={GoogleOriginal}
      />
    );
  }
  if (wallet.is_apple) {
    return <LoginWithPlatformTitle text={"Login from Apple"} Icon={Apple} />;
  }
  if (wallet.is_twitter) {
    return (
      <LoginWithPlatformTitle text={"Login from Twitter"} Icon={Twitter} />
    );
  }
  return null;
};
const LoginWithTitle = ({
  wallet,
  nickname,
}: {
  wallet: WalletAddressesV2;
  nickname?: string;
}) => {
  const isHasSubTitle =
    wallet.email ||
    wallet.phone_number ||
    wallet.is_google ||
    wallet.is_apple ||
    wallet.is_twitter;

  if (!nickname && !isHasSubTitle) {
    return null;
  }
  return (
    <View tw="mb-2.5 flex-row flex-wrap items-center">
      {Boolean(nickname) && (
        <Text tw="mr-2 text-base font-bold text-gray-900 dark:text-white">
          {nickname}
        </Text>
      )}
      {Boolean(nickname) && isHasSubTitle ? (
        <View tw="flex-row items-center justify-center">
          <Text tw="text-sm text-gray-900 dark:text-white">(</Text>
          <Title wallet={wallet} />
          <Text tw="text-sm text-gray-900 dark:text-white">)</Text>
        </View>
      ) : (
        <Title wallet={wallet} />
      )}
    </View>
  );
};
const MakePrimaryBtn = ({
  isPrimary,
  onPress,
}: {
  isPrimary: boolean;
  onPress?: () => void;
}) => {
  return (
    <View tw="mb-2 md:mb-0">
      {!isPrimary ? (
        <PressableHover
          tw="mr-4 h-6 flex-row items-center justify-center self-start rounded-3xl border bg-black px-2 dark:bg-white md:h-8"
          onPress={onPress}
        >
          <Text tw="text-xs text-white dark:text-gray-900">Make Primary</Text>
        </PressableHover>
      ) : (
        <PressableHover tw="mr-4 h-6 flex-row items-center justify-center self-start rounded-3xl border border-green-500 bg-green-500/20 px-2 md:h-8">
          <Check color={colors.green[700]} width={16} height={16} />
          <Text tw="text-xs text-green-600"> Primary</Text>
        </PressableHover>
      )}
    </View>
  );
};
export const SettingsWalletItem = (props: Props) => {
  const address = props.wallet.address;
  const ensDomain = props.wallet.ens_domain;
  const nickname = props.wallet.nickname;
  const wallet = props.wallet;
  const { userAddress } = useCurrentUserAddress();
  const user = useUser();
  const isDark = useIsDarkMode();
  const display = ensDomain ? ensDomain : formatAddressShort(address);
  const isEthereumAddress = address.startsWith("0x");

  const isConnectedAddress =
    userAddress?.toLowerCase() === address?.toLowerCase();

  const isPrimary = user.user?.data.profile.primary_wallet?.address === address;
  const { setPrimaryWallet } = useSetPrimaryWallet();

  return (
    <>
      <View tw="mt-6 px-4 lg:px-0">
        <View tw="w-full flex-row items-start justify-between py-1 md:rounded-2xl md:bg-white md:dark:bg-black">
          <View tw="self-start rounded-full bg-gray-200 p-1 dark:bg-gray-700">
            {isEthereumAddress ? (
              <Ethereum
                width={16}
                height={16}
                color={isDark ? colors.white : colors.gray[900]}
              />
            ) : (
              <Tezos
                width={16}
                height={16}
                color={isDark ? colors.white : colors.gray[900]}
              />
            )}
          </View>
          <View tw="flex-1 px-2.5">
            <View>
              <LoginWithTitle wallet={wallet} nickname={nickname} />
              <View tw="mb-2 md:flex-row">
                <Text tw="text-base font-medium text-gray-900 dark:text-white md:self-center">
                  {display}
                </Text>
              </View>
            </View>
            <Hidden from="md">
              <MakePrimaryBtn
                isPrimary={isPrimary}
                onPress={() => setPrimaryWallet(wallet)}
              />
            </Hidden>
            <Text tw="text-sm text-gray-900 dark:text-white">{address}</Text>
            <View tw="h-2" />
          </View>
          <View tw="flex flex-row items-center justify-center">
            <Hidden until="md">
              <MakePrimaryBtn
                isPrimary={isPrimary}
                onPress={() => setPrimaryWallet(wallet)}
              />
            </Hidden>
            <WalletDropdownMenu
              address={address}
              isCurrent={isConnectedAddress}
              isMagicWallet={
                !!props.wallet.is_email ||
                !!props.wallet.is_phone ||
                !!props.wallet.is_apple ||
                !!props.wallet.is_google
              }
              onEditNickname={props.onEditNickname}
            />
          </View>
        </View>
      </View>
    </>
  );
};
