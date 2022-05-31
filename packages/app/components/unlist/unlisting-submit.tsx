import { useEffect } from "react";

import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import { useCurrentUserAddress } from "app/hooks/use-current-user-address";
import { UnlistNFT } from "app/hooks/use-unlist-nft";
import { useUser } from "app/hooks/use-user";
import { useWeb3 } from "app/hooks/use-web3";
import { useRouter } from "app/navigation/use-router";

import { Button } from "design-system";

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

  const enabled = state.status === "idle" || state.status === "unlistingError";

  useEffect(() => {
    if (state.status === "unlistingSuccess") {
      setTimeout(() => {
        router.pop();
        router.push(`/@${user?.data?.profile?.username ?? address}`);
      }, 1000);
    }
  }, [state.status, user, address, router]);

  const ctaCopy = statusCopyMapping[state.status];

  const showSigningOption = state.status === "unlisting" && isNotMagic;

  return (
    <View tw="w-full p-4">
      <Button
        onPress={() => unlistNFT(listingID)}
        variant="primary"
        disabled={!enabled}
        tw={`h-12 rounded-full ${!enabled ? "opacity-60" : ""}`}
      >
        <Text tw="pl-1 text-sm text-white dark:text-gray-900">{ctaCopy}</Text>
      </Button>
      <View tw=" mt-4 h-36 w-full">
        {showSigningOption ? (
          <Button
            onPress={() => unlistNFT(listingID)}
            tw="mt-4 h-12 w-full"
            variant="tertiary"
          >
            <Text tw="text-sm text-gray-900 dark:text-white">
              Didn't receive the signature request yet?
            </Text>
          </Button>
        ) : null}
      </View>
    </View>
  );
};

export { UnlistingSubmit };
