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
      <View tw="flex min-w-[128px] flex-1 flex-row items-center">
        <View tw="mr-2">
          {getNftActivityEventIcon({ event: props.event_type, color })}
        </View>
        <Text tw=" text-xs font-semibold text-gray-600 dark:text-gray-400">
          {props.event_type}
        </Text>
      </View>
      <View tw="min-w-[128px] flex-1 text-xs font-semibold text-gray-600 dark:text-gray-400">
        <UserItem
          imageUrl={props.from_img_url}
          title={props.from_username}
          verified={props.from_verified}
        />
      </View>
      <View tw="min-w-[128px] flex-1 text-xs font-semibold text-gray-600 dark:text-gray-400">
        <UserItem
          imageUrl={props.to_img_url}
          title={props.to_username}
          verified={props.to_verified}
        />
      </View>
      <Text tw="min-w-[128px] flex-1 text-xs font-semibold text-gray-600 dark:text-gray-400">
        {props.quantity}
      </Text>
      <View tw="flex min-w-[128px] flex-1 flex-row items-center">
        <Text tw="text-xs font-semibold text-gray-600 dark:text-gray-400">
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
