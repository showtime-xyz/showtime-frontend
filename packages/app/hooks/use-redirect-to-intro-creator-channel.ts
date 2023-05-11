import { Platform } from "react-native";

import { useRouter } from "@showtime-xyz/universal.router";

import { useOnboardingPromise } from "app/components/onboarding";

export const useRedirectToCreatorChannelIntro = () => {
  const router = useRouter();
  const { onboardingPromise } = useOnboardingPromise();

  const redirectToCreatorChannelIntro = async () => {
    await onboardingPromise();
    const as = `/creator-channels/intro`;
    router.push(
      Platform.select({
        native: as,
        web: {
          pathname: router.pathname,
          query: {
            ...router.query,
            creatorChannelsIntroModal: true,
          },
        } as any,
      }),
      Platform.select({ native: as, web: router.asPath }),
      {
        shallow: true,
      }
    );
  };

  return redirectToCreatorChannelIntro;
};
