import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import { Image } from "design-system/image";
import { VerificationBadge } from "design-system/verification-badge";

import type { UserItemProps } from "./nft-activity.types";

const UserItem = ({ imageUrl, title, verified }: UserItemProps) => {
  return (
    <View tw="flex flex-row items-center">
      <View tw="mr-2 h-6 w-6 rounded-xl bg-gray-200">
        {imageUrl && (
          <Image tw={"h-full w-full rounded-full"} source={{ uri: imageUrl }} />
        )}
      </View>
      <Text tw={"mr-1 text-xs text-black dark:text-white"}>{`@${title}`}</Text>
      {verified ? <VerificationBadge size={12} /> : null}
    </View>
  );
};

export default UserItem;
