import { Linking, Platform } from "react-native";

import { Button } from "@showtime-xyz/universal.button";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import { useUser } from "app/hooks/use-user";
import { SHOWTIME_CONTRACTS } from "app/lib/constants";
import {
  useNavigateToBuy,
  useNavigateToListing,
} from "app/navigation/use-navigate-to";
import { NFT } from "app/types";
import { getBidLink, getContractName } from "app/utilities";

export const BuyButton = ({ nft }: { nft: NFT }) => {
  const { user } = useUser();
  const isNFTOwner =
    user?.data.profile.profile_id === nft?.listing?.profile_id &&
    typeof user?.data.profile.profile_id === "number";
  const freeItem = nft?.listing?.min_price === 0;

  const navigateToListing = useNavigateToListing();
  const navigateToBuy = useNavigateToBuy();

  if (Platform.OS !== "web") return null;

  if (!nft.listing) {
    if (isNFTOwner && SHOWTIME_CONTRACTS.includes(nft.contract_address)) {
      return (
        <Button onPress={() => navigateToListing(nft)}>List on Showtime</Button>
      );
    }

    return (
      <Button onPress={() => Linking.openURL(getBidLink(nft))}>
        <Text>View on {getContractName(nft)}</Text>
      </Button>
    );
  }

  if (isNFTOwner) {
    return (
      <View>
        <Text tw="text-black dark:text-white">
          {freeItem
            ? "Listed for free"
            : `Price ${nft.listing.min_price} ${nft.listing.currency}`}
        </Text>
      </View>
    );
  } else {
    return (
      <Button onPress={() => navigateToBuy(nft)}>
        {freeItem
          ? "Price Free"
          : `Price ${nft.listing.min_price} ${nft.listing.currency}`}
      </Button>
    );
  }
};
