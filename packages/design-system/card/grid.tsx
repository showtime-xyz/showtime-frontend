import { useCallback, useMemo } from "react";
import { FlatList, Dimensions } from "react-native";

import type { NFT } from "app/types";
import { Media } from "design-system/media";

const GAP_BETWEEN_ITEMS = 2;
const ITEM_SIZE = Dimensions.get("window").width / 2;

type Props = {
  nfts: NFT[];
};

function Grid({ nfts }: Props) {
  const count = nfts.length;

  const keyExtractor = useCallback((item) => item?.nft_id?.toString(), []);

  const renderItem = useCallback(
    ({ item }) => {
      if (!item) return null;

      return <Media item={item} count={count} />;
    },
    [count]
  );

  const getItemLayout = useCallback((_data, index) => {
    return { length: ITEM_SIZE, offset: ITEM_SIZE * index, index };
  }, []);

  return (
    <FlatList
      style={useMemo(() => ({ margin: -GAP_BETWEEN_ITEMS }), [])}
      data={count > 4 ? nfts.slice(0, 4) : nfts}
      keyExtractor={keyExtractor}
      numColumns={2}
      windowSize={4}
      renderItem={renderItem}
      getItemLayout={getItemLayout}
      initialNumToRender={count}
      alwaysBounceVertical={false}
      // @ts-ignore
      listKey={keyExtractor}
    />
  );
}

export { Grid };
