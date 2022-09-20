import { Platform } from "react-native";

import { useAlert } from "@showtime-xyz/universal.alert";
import { useRouter } from "@showtime-xyz/universal.router";

import { useUser } from "app/hooks/use-user";

export const useRedirectToCreateDrop = () => {
  const { isAuthenticated, user } = useUser();
  const router = useRouter();
  const Alert = useAlert();

  const redirectToCreateDrop = () => {
    if (!isAuthenticated) {
      router.push("/login");
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
