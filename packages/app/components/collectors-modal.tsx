import { Suspense } from "react";

import { BottomSheetModalProvider } from "@showtime-xyz/universal.bottom-sheet";
import { Spinner } from "@showtime-xyz/universal.spinner";
import { View } from "@showtime-xyz/universal.view";

import { useNFTDetailByTokenId } from "app/hooks/use-nft-detail-by-token-id";
import { useTrackPageViewed } from "app/lib/analytics";
import { createParam } from "app/navigation/use-param";

import { ErrorBoundary } from "./error-boundary";
import { UserList } from "./user-list";

type Query = {
  tokenId: string;
  contractAddress: string;
  chainName: string;
};

const { useParam } = createParam<Query>();

export const CollectorsModal = () => {
  useTrackPageViewed({ name: "Collectors" });
  const [tokenId] = useParam("tokenId");
  const [contractAddress] = useParam("contractAddress");
  const [chainName] = useParam("chainName");

  const { data, isLoading } = useNFTDetailByTokenId({
    chainName: chainName as string,
    tokenId: tokenId as string,
    contractAddress: contractAddress as string,
  });

  return (
    <BottomSheetModalProvider>
      <ErrorBoundary>
        <Suspense
          fallback={
            <View tw="p-4">
              <Spinner />
            </View>
          }
        >
          <UserList
            loading={isLoading}
            users={data?.data?.item?.multiple_owners_list}
          />
        </Suspense>
      </ErrorBoundary>
    </BottomSheetModalProvider>
  );
};
