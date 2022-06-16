import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import { useUser } from "app/hooks/use-user";
import { NFT } from "app/types";
import { findUserInOwnerList } from "app/utilities";

type Props = {
  nft?: NFT;
};

const UnlistingUnavailable = (props: Props) => {
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
      <Text tw="text-black dark:text-white">
        Your current address does not own this NFT!
      </Text>
      <View tw="h-2" />
      {userOwnershipAmount && userOwnershipList ? (
        <View tw="mt-8">
          {userOwnershipList.map((ownerListItem) => {
            const displayAddress = ownerListItem.ens_domain
              ? ownerListItem.ens_domain
              : ownerListItem.address;
            return (
              <>
                <Text
                  tw="font-medium text-black dark:text-white"
                  key={`${ownerListItem.address}`}
                >
                  Please connect with address {displayAddress}
                </Text>
                <View tw="h-2" />
              </>
            );
          })}
        </View>
      ) : null}
    </View>
  );
};

export { UnlistingUnavailable };
