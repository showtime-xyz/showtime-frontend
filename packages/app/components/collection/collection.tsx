import { Text } from "design-system";

import { IEdition } from "../../types";
import { CollectionCard } from "./collection-card";

export const Collection = ({ collection }: { collection: IEdition }) => {
  return (
    <CollectionCard
      nft={{
        nft_id: 1,
        token_name: collection.name,
        token_description: collection.description,
        collection_name: collection.name,
        contract_address: collection.contract_address,
        token_hidden: 0,
        creator_id: 0,
        multiple_owners: 0,
        owner_id: 0,
        token_creator_followers_only: 0,
        creator_verified: 0,
        owner_verified: 0,
        owner_count: 0,
        token_count: 0,
        source_url:
          "https://ipfs.io/ipfs/" + collection.image_url.replace("ipfs://", ""),
        contract_is_creator: 0,
        multiple_owners_list: [],
      }}
    />
  );
};
