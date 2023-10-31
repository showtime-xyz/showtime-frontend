import { Platform } from "react-native";

import { Button, GradientButton } from "@showtime-xyz/universal.button";
import { useRouter } from "@showtime-xyz/universal.router";

import { useOnboardingPromise } from "app/components/onboarding";
import { useUser } from "app/hooks/use-user";

export const CompleteProfileButton = ({ isSelf }: { isSelf: boolean }) => {
  const router = useRouter();
  const { isIncompletedProfile } = useUser();
  const { onboardingPromise } = useOnboardingPromise();

  if (!isSelf) return null;
  if (isIncompletedProfile) {
    return (
      <GradientButton
        size="small"
        onPress={async () => {
          await onboardingPromise();
        }}
        labelTW={"color-white"}
        style={{ height: 28, paddingVertical: 0 }}
        gradientProps={{
          colors: ["#ED0A25", "#ED0ABB"],
          locations: [0, 1],
          start: { x: 1.0263092128417304, y: 0.5294252532614323 },
          end: { x: -0.02630921284173038, y: 0.4705747467385677 },
        }}
      >
        Complete profile
      </GradientButton>
    );
  }
  return (
    <Button
      size="small"
      variant="outlined"
      style={{ height: 26, paddingVertical: 0 }}
      tw="py-0"
      onPress={() => {
        router.push(
          Platform.select({
            native: "/profile/edit",
            web: {
              pathname: router.pathname,
              query: {
                ...router.query,
                editProfileModal: true,
              },
            } as any,
          }),
          Platform.select({
            native: "/profile/edit",
            web: router.asPath,
          })
        );
      }}
    >
      Edit profile
    </Button>
  );
};
