import { View } from "design-system/view";
import { Button } from "design-system/card/social/button";

function Social({ nft }) {
  return (
    <View tw="p-4 bg-white dark:bg-black flex-row justify-between">
      <View tw="flex-row">
        <Button variant="like" count={nft.like_count} />
        <View tw="ml-2" />
        <Button variant="comment" count={nft.comment_count} />
      </View>

      <View>
        <Button variant="boost" count={0} />
      </View>
    </View>
  );
}

export { Social };
