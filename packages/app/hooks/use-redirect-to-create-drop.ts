import { Platform } from "react-native";

import { useAlert } from "@showtime-xyz/universal.alert";
import { useRouter } from "@showtime-xyz/universal.router";

import { useOnboardingPromise } from "app/components/onboarding";
import { useUser } from "app/hooks/use-user";
import { useLogInPromise } from "app/lib/login-promise";

export const useRedirectToCreateDrop = () => {
  const { isAuthenticated, user } = useUser();
  const { loginPromise } = useLogInPromise();
  const { onboardingPromise } = useOnboardingPromise();

  const router = useRouter();
  const Alert = useAlert();

  const redirectToCreateDrop = async () => {
    if (isAuthenticated && user?.data.can_create_drop === false) {
      const timeRemaining = 24 - new Date().getUTCHours();
      Alert.alert(
        "Wow, you love drops!",
        `Only one drop per day is allowed.\n\nCome back in ${timeRemaining} hours!`
      );
    } else {
      // check if user is logged in
      await loginPromise();
      // check if user has completed onboarding
      await onboardingPromise();

      // redirect to create drop
      router.push(
        Platform.select({
          native: "/drop",
          web: {
            pathname: router.pathname,
            query: { ...router.query, dropModal: true },
          } as any,
        }),
        Platform.select({
          native: "/drop",
          web: router.asPath === "/" ? "/drop" : router.asPath,
        }),
        { shallow: true }
      );
    }
  };

  return redirectToCreateDrop;
};
