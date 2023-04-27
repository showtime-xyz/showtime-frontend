import { useCallback, useEffect, useState } from "react";

import { DataPill } from "@showtime-xyz/universal.data-pill";
import { CheckFilled1 } from "@showtime-xyz/universal.icon";
import { colors } from "@showtime-xyz/universal.tailwind";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import { useCurrentUserAddress } from "app/hooks/use-current-user-address";
import { useManageAccount } from "app/hooks/use-manage-account";
import { useWeb3 } from "app/hooks/use-web3";
import { useMagic } from "app/lib/magic";
import { WalletAddressesV2 } from "app/types";

import { DropdownMenu } from "./dropdown-menu";

export type EmailItemProps = {
  email: WalletAddressesV2["email"];
  address: WalletAddressesV2["address"];
};

export type EmailHeaderProps = {
  hasEmail: boolean;
  onAddEmail: () => void;
};

export const SettingsEmailItem = (props: EmailItemProps) => {
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
    <View tw="w-full flex-row items-center justify-between px-4 py-5 md:px-0">
      <View tw="flex-1 flex-row items-center">
        <CheckFilled1 color={colors.black} width={20} height={20} />
        <Text tw="ml-2.5 text-base font-medium text-gray-900 dark:text-white">
          {email}
        </Text>
        {isCurrentEmail ? (
          <View tw="ml-2 flex flex-row">
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
