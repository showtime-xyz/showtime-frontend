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

export type PhoneNumberItemProps = {
  phoneNumber: WalletAddressesV2["phone_number"];
  address: WalletAddressesV2["address"];
};

export type PhoneNumberHeaderProps = {
  hasPhoneNumber: boolean;
  onVerifyPhoneNumber: () => void;
};

export const SettingsPhoneNumberItem = (props: PhoneNumberItemProps) => {
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
    <View tw="w-full flex-row items-center justify-between px-4 py-5 lg:px-0">
      <View tw="flex-1 flex-row items-center">
        <CheckFilled1 color={colors.black} width={20} height={20} />
        <Text tw="ml-2.5 text-base font-medium text-gray-900 dark:text-white">
          {phoneNumber}
        </Text>

        {isCurrentPhoneNumber ? (
          <View tw="ml-1 flex flex-row">
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
