import { useState } from "react";

import { usePrivy } from "@privy-io/react-auth";

import { DataPill } from "@showtime-xyz/universal.data-pill";
import { CheckFilled1 } from "@showtime-xyz/universal.icon";
import { colors } from "@showtime-xyz/universal.tailwind";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import { WalletAddressesV2 } from "app/types";

import { DropdownMenu } from "./dropdown-menu";

export type EmailItemProps = {
  email: WalletAddressesV2["email"];
};

export type EmailHeaderProps = {
  hasEmail: boolean;
  onAddEmail: () => void;
};

export const SettingsEmailItem = (props: EmailItemProps) => {
  const [isCurrentEmail] = useState(false);
  const email = props.email;
  const { unlinkEmail } = usePrivy();

  return (
    <View tw="w-full flex-row items-center justify-between px-4 py-5 lg:px-0">
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
          onRemove={() => unlinkEmail(props.email)}
          ctaCopy="Delete Email Address"
          isCurrent={isCurrentEmail}
        />
      </View>
    </View>
  );
};
