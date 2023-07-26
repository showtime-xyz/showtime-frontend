import { Platform } from "react-native";

import { useRouter } from "@showtime-xyz/universal.router";

import { toast } from "design-system/toast";

export const useRedirectToStarDropShareScreen = () => {
  const router = useRouter();

  const redirectToStarDropShareScreen = (contractAddress: string) => {
    toast("Coming soon!");
    // const as = `/raffle/${contractAddress}`;
    // router.push(
    //   Platform.select({
    //     native: as,
    //     web: {
    //       pathname: router.pathname,
    //       query: {
    //         ...router.query,
    //         contractAddress,
    //         raffleModal: true,
    //       },
    //     } as any,
    //   }),
    //   Platform.select({
    //     native: as,
    //     web: router.asPath,
    //   }),
    //   { shallow: true }
    // );
  };

  return redirectToStarDropShareScreen;
};
