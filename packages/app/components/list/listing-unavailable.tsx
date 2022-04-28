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

  return (
    <View tw="mt-8">
      <Text tw="mb-2 text-black dark:text-white">
        Your current address does not own this NFT!
      </Text>
      {userOwnershipAmount && userOwnershipList ? (
        <View tw="mt-8">
          {userOwnershipList.map((ownerListItem) => {
            const displayAddress = ownerListItem.ens_domain
              ? ownerListItem.ens_domain
              : ownerListItem.address;
            return (
              <Text
                tw="mb-2 font-medium text-black dark:text-white"
                key={`${ownerListItem.address}`}
              >
                Please connect {displayAddress} address
              </Text>
            );
          })}
        </View>
      ) : null}
    </View>
  );
};
