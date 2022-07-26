import { Platform } from "react-native";

import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";

import { useRouter } from "@showtime-xyz/universal.router";

import { createParam } from "app/navigation/use-param";

import { FollowersList, FollowingList } from "./following-user-list";

type Query = {
  profileId: string;
};

const { useParam } = createParam<Query>();

export const FollowingModal = () => {
  const [profileId] = useParam("profileId");
  const router = useRouter();
  if (!profileId) return null;

  return (
    <BottomSheetModalProvider>
      <FollowingList
        profileId={+profileId}
        hideSheet={Platform.select({
          ios: () => router.pop(),
          default: () => false,
        })}
      />
    </BottomSheetModalProvider>
  );
};

export const FollowerModal = () => {
  const [profileId] = useParam("profileId");
  const router = useRouter();

  if (!profileId) return null;
  return (
    <BottomSheetModalProvider>
      <FollowersList
        profileId={+profileId}
        hideSheet={Platform.select({
          ios: () => router.pop(),
          default: () => false,
        })}
      />
    </BottomSheetModalProvider>
  );
};
