import { useUser } from "app/hooks/use-user";
import { NFT } from "app/types";
import { findUserInOwnerList } from "app/utilities";

import { View, Text } from "design-system";

type Props = {
  nft?: NFT;
};

export const ListingUnavailable = (props: Props) => {
  const multipleOwnersList = props.nft?.multiple_owners_list;

  const { user } = useUser();
  const userAddresses = user?.data.profile.wallet_addresses_v2;

  const userOwnershipList = findUserInOwnerList(
    userAddresses,
    multipleOwnersList
  );

  const userOwnershipAmount = userOwnershipList?.length || 0;

  const tryAgainCopy = `Try again from ${
    userOwnershipAmount > 1 ? "one of these addresses " : "this address "
  }`;

  return (
    <View tw="mt-8">
      <Text tw="text-black dark:text-white mb-2">
        The current address you are using does not own an edition of this NFT.
      </Text>
      {userOwnershipAmount && userOwnershipList ? (
        <View tw="mt-8">
          <Text tw="font-medium text-black dark:text-white mb-4">
            {tryAgainCopy}
          </Text>

          {userOwnershipList.map((ownerListItem) => (
            <Text
              tw="font-medium text-black dark:text-white mb-2"
              key={`${ownerListItem.address}`}
            >
              {ownerListItem.address}
            </Text>
          ))}
        </View>
      ) : null}
    </View>
  );
};
