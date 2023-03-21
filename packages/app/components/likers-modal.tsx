import { Suspense } from "react";

import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";

import { useLikes } from "app/hooks/api/use-likes";
import { useTrackPageViewed } from "app/lib/analytics";
import { createParam } from "app/navigation/use-param";

import { Spinner } from "design-system/spinner";
import { View } from "design-system/view";

import { ErrorBoundary } from "./error-boundary";
import { UserList } from "./user-list";

type Query = {
  nftId: string;
};

const { useParam } = createParam<Query>();

export const LikersModal = () => {
  useTrackPageViewed({ name: "Likers" });
  const [nftId] = useParam("nftId");
  const { data, loading } = useLikes(Number(nftId));

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
          <UserList loading={loading} users={data?.likers} />
        </Suspense>
      </ErrorBoundary>
    </BottomSheetModalProvider>
  );
};
