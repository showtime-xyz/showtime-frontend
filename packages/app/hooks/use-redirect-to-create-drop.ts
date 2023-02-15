import { Platform } from "react-native";

import { useAlert } from "@showtime-xyz/universal.alert";
import { useRouter } from "@showtime-xyz/universal.router";

import { useUser } from "app/hooks/use-user";
import { useNavigateToLogin } from "app/navigation/use-navigate-to";

export const useRedirectToCreateDrop = () => {
  const { isAuthenticated, user } = useUser();
  const router = useRouter();
  const navigateToLogin = useNavigateToLogin();
  const Alert = useAlert();

  const redirectToCreateDrop = () => {
    if (!isAuthenticated) {
      navigateToLogin();
    } else if (user?.data.can_create_drop === false) {
      const timeRemaining = 24 - new Date().getUTCHours();
      Alert.alert(
        "Wow, you love drops!",
        `Only one drop per day is allowed.\n\nCome back in ${timeRemaining} hours!`
      );
    } else {
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
