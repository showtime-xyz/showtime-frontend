import { useState } from "react";

import { usePrivy } from "@privy-io/react-auth";

import { DataPill } from "@showtime-xyz/universal.data-pill";
import { CheckFilled1 } from "@showtime-xyz/universal.icon";
import { colors } from "@showtime-xyz/universal.tailwind";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import { WalletAddressesV2 } from "app/types";

import { DropdownMenu } from "./dropdown-menu";

export type PhoneNumberItemProps = {
  phoneNumber: WalletAddressesV2["phone_number"];
};

export type PhoneNumberHeaderProps = {
  hasPhoneNumber: boolean;
  onVerifyPhoneNumber: () => void;
};

export const SettingsPhoneNumberItem = (props: PhoneNumberItemProps) => {
  const [isCurrentPhoneNumber] = useState(false);
  const { unlinkPhone } = usePrivy();

  const phoneNumber = props.phoneNumber;

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
          onRemove={() => unlinkPhone(props.phoneNumber)}
        />
      </View>
    </View>
  );
};
