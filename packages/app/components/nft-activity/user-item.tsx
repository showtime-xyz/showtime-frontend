import { Image, Text, VerificationBadge, View } from "design-system";

import type { UserItemProps } from "./nft-activity.types";

const UserItem = ({ imageUrl, title, verified }: UserItemProps) => {
  return (
    <View tw="flex flex-row items-center">
      <View tw="mr-2 rounded-xl w-6 h-6 bg-gray-200">
        {imageUrl && (
          <Image tw={"w-full h-full rounded-full"} source={{ uri: imageUrl }} />
        )}
      </View>
      <Text tw={"text-xs text-black dark:text-white mr-1"}>{`@${title}`}</Text>
      {verified ? <VerificationBadge size={12} /> : null}
    </View>
  );
};

export default UserItem;
