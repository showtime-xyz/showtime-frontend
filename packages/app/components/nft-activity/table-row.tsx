import React from "react";

import { formatDistanceToNowStrict } from "date-fns";

import { Text, View } from "design-system";
import { useIsDarkMode } from "design-system/hooks";

import { BLOCKCHAIN_TYPES } from "./nft-activity.constants";
import {
  getNftActivityEventIcon,
  getNftBlockchainIcon,
} from "./nft-activity.helpers";
import type { TableRowProps } from "./nft-activity.types";
import UserItem from "./user-item";

const TableRow = ({ ...props }: TableRowProps) => {
  const isDark = useIsDarkMode();
  const color = isDark ? "white" : "black";

  return (
    <View tw="flex flex-row items-center p-4">
      <View tw="flex flex-row items-center flex-1 min-w-[128px]">
        <View tw="mr-2">
          {getNftActivityEventIcon({ event: props.event_type, color })}
        </View>
        <Text tw=" text-gray-600 dark:text-gray-400 text-xs font-semibold">
          {props.event_type}
        </Text>
      </View>
      <View tw="flex-1 text-gray-600 dark:text-gray-400 text-xs font-semibold min-w-[128px]">
        <UserItem
          imageUrl={props.from_img_url}
          title={props.from_username}
          verified={props.from_verified}
        />
      </View>
      <View tw="flex-1 text-gray-600 dark:text-gray-400 text-xs font-semibold min-w-[128px]">
        <UserItem
          imageUrl={props.to_img_url}
          title={props.to_username}
          verified={props.to_verified}
        />
      </View>
      <Text tw="flex-1 text-gray-600 dark:text-gray-400 text-xs font-semibold min-w-[128px]">
        {props.quantity}
      </Text>
      <View tw="flex flex-row items-center flex-1 min-w-[128px]">
        <Text tw="text-gray-600 dark:text-gray-400 text-xs font-semibold">
          {formatDistanceToNowStrict(new Date(props.timestamp), {
            addSuffix: true,
          })}
        </Text>
        <View tw="ml-2">
          {getNftBlockchainIcon({
            blockchain: BLOCKCHAIN_TYPES.POLYGONSCAN,
            color,
          })}
        </View>
      </View>
    </View>
  );
};

export default TableRow;
