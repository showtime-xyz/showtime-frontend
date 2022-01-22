import { View } from "design-system/view";
import { Text } from "design-system/text";
import { useLikes } from "app/hooks/api/use-likes";

interface Props {
  nft: any;
}

/**
 * TODO(gorhom): use avatar group once it is available.
 */

export function LikedBy({ nft }: Props) {
  if (!nft) return null;

  const {} = useLikes(nft.nft_id);

  return (
    <View tw="flex h-[32px] bg-white justify-center">
      <Text>Liked by </Text>
    </View>
  );
}
