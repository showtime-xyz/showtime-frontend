import { useEffect } from "react";

import { useCurrentUserAddress } from "app/hooks/use-current-user-address";
import { useListNFT, UnlistNFT } from "app/hooks/use-unlist-nft";
import { useWeb3 } from "app/hooks/use-web3";
import { useRouter } from "app/navigation/use-router";

import { View, Text, Button } from "design-system";

type Props = {
  listingID?: number;
};

type StatusCopyMapping = {
  [Property in UnlistNFT["status"]]: string;
};

const statusCopyMapping: StatusCopyMapping = {
  idle: "Unlist",
  unlisting: "Unlisting your NFT...",
  unlistingError: "Can't unlist your NFT. Please try again.",
  unlistingSuccess: "Success! Your NFT was unlisted.",
};

const UnlistingSubmit = (props: Props) => {
  const listingID = props.listingID;
  const { unlistNFT, state } = useListNFT();
  const router = useRouter();
  const { web3 } = useWeb3();
  const { userAddress: address } = useCurrentUserAddress();
  const isNotMagic = !web3;

  useEffect(() => {
    if (state.status === "unlistingSuccess") {
      setTimeout(() => {
        router.pop();
        router.push(`/profile/${address}`);
      }, 1000);
    }
  }, [state.status]);

  const ctaCopy = statusCopyMapping[state.status];

  const showSigningOption = state.status === "unlisting" && isNotMagic;

  return (
    <View tw="p-4 w-full">
      <Button
        onPress={() => unlistNFT(listingID)}
        tw="h-12 rounded-full"
        variant="primary"
      >
        <Text tw="text-white dark:text-gray-900 text-sm pl-1">{ctaCopy}</Text>
      </Button>
      <View tw=" h-36 w-full mt-4">
        {showSigningOption ? (
          <Button
            onPress={() => unlistNFT(listingID)}
            tw="h-12 w-full mt-4"
            variant="tertiary"
          >
            <Text tw="text-gray-900 dark:text-white text-sm">
              Didn't receive the signature request yet?
            </Text>
          </Button>
        ) : null}
      </View>
    </View>
  );
};

export { UnlistingSubmit };
