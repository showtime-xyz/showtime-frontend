import { Suspense } from "react";
import { Platform } from "react-native";

import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";

import { useRouter } from "@showtime-xyz/universal.router";
import { Spinner } from "@showtime-xyz/universal.spinner";
import { View } from "@showtime-xyz/universal.view";

import { useLikes } from "app/hooks/api/use-likes";
import { useTrackPageViewed } from "app/lib/analytics";
import { createParam } from "app/navigation/use-param";

import { ErrorBoundary } from "./error-boundary";
import { UserList } from "./user-list";

type Query = {
  nftId: string;
};

const { useParam } = createParam<Query>();

export const LikersModal = () => {
  useTrackPageViewed({ name: "Likers" });
  const router = useRouter();
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
          <UserList
            loading={loading}
            users={data?.likers}
            onClose={Platform.select({
              ios: () => router.pop(),
              default: () => false,
            })}
          />
        </Suspense>
      </ErrorBoundary>
    </BottomSheetModalProvider>
  );
};
