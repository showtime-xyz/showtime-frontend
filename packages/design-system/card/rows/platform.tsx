import { View } from "design-system/view";
import { Text } from "design-system/text";
import { Image } from "design-system/image";

function Platform({ nft }) {
  return (
    <View tw="px-4 py-2 bg-gray-100 dark:bg-gray-900 flex-row items-center justify-between">
      <View tw="flex-row items-center">
        {nft.collection_img_url && (
          <Image
            source={{ uri: nft.collection_img_url }}
            tw="w-5 h-5 rounded-full"
          />
        )}
        <Text tw="ml-2 text-xs font-bold text-gray-600 dark:text-gray-400">
          {nft.collection_name}
        </Text>
      </View>
      <Text tw="text-xs font-bold text-gray-600 dark:text-gray-400">
        {nft.token_count ? `${nft.token_count} Editions` : "1/1"}
      </Text>
    </View>
  );
}

export { Platform };
