import { FC } from "react";
import { Platform } from "react-native";

import { useRouter } from "./use-router";

function withModalScreen<P>(
  Screen: FC<P>,
  matchingPathname: string,
  matchingQueryParam: string
) {
  return function (props: P) {
    const { pathname, query } = useRouter();

    const shouldShowModal =
      pathname === matchingPathname || Boolean(query[matchingQueryParam]);

    if (Platform.OS === "web" && !shouldShowModal) {
      return null;
    }

    return <Screen {...props} />;
  };
}

export { withModalScreen };
