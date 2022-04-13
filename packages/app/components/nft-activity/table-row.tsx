import React from "react";

import { formatDistanceToNowStrict } from "date-fns";

import { Text, View } from "design-system";

import { getNftActivityEventIcon } from "./nft-activity.helpers";
import type { TableRowProps } from "./nft-activity.types";
import UserItem from "./user-item";

const TableRow = ({ ...props }: TableRowProps) => {
  return (
    <View tw="flex flex-row items-center p-4">
      <View tw="flex flex-row items-center flex-1 min-w-[128px]">
        <View tw="mr-2">{getNftActivityEventIcon(props.event_type)}</View>
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
      <Text tw="flex-1 text-gray-600 dark:text-gray-400 text-xs font-semibold min-w-[128px]">
        {formatDistanceToNowStrict(new Date(props.timestamp), {
          addSuffix: true,
        })}
      </Text>
    </View>
  );
};

export default TableRow;
