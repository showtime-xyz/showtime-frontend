import { useEffect } from "react";

import { useCurrentUserAddress } from "app/hooks/use-current-user-address";
import { UnlistNFT } from "app/hooks/use-unlist-nft";
import { useUser } from "app/hooks/use-user";
import { useWeb3 } from "app/hooks/use-web3";
import { useRouter } from "app/navigation/use-router";

import { Button, Text, View } from "design-system";

type Props = {
  listingID?: number;
  unlistState: UnlistNFT;
  unlistNFT: (listingID?: number) => void;
};

type StatusCopyMapping = {
  [Property in UnlistNFT["status"]]: string;
};

const statusCopyMapping: StatusCopyMapping = {
  idle: "Unlist",
  unlisting: "Unlisting your NFT...",
  unlistingError: "Can't unlist your NFT. Please try again.",
  unlistingSuccess: "Success! Your NFT was unlisted.",
  transactionInitiated: "Transaction initiated...",
};

const UnlistingSubmit = (props: Props) => {
  const listingID = props.listingID;
  const router = useRouter();
  const { web3 } = useWeb3();
  const { user } = useUser();
  const { userAddress: address } = useCurrentUserAddress();
  const isNotMagic = !web3;
  const { unlistState: state, unlistNFT } = props;

  useEffect(() => {
    if (state.status === "unlistingSuccess") {
      setTimeout(() => {
        router.pop();
        router.push(`/@${user?.data?.profile?.username ?? address}`);
      }, 1000);
    }
  }, [state.status, user, address]);

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
