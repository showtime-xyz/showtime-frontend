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
        creator_name: "wddw",
        creator_address: "wddw",
        creator_address_nonens: "wddw",
        multiple_owners: 0,
        owner_id: 0,
        owner_name: "wddw",
        token_creator_followers_only: 0,
        creator_verified: 0,
        owner_verified: 0,
        owner_count: 0,
        token_count: 0,
        source_url:
          "https://images.unsplash.com/photo-1503965830912-6d7b07921cd1?ixlib=rb-1.2.1&raw_url=true&q=80&fm=jpg&crop=entropy&cs=tinysrgb&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074",
        still_preview_url: "wddw",
        mime_type: "wddw",
        chain_identifier: "wddw",
        collection_slug: "wddw",
        contract_is_creator: 0,
        multiple_owners_list: [],
      }}
    />
  );
};
