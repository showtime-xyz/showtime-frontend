import { useWindowDimensions } from "react-native";

import { useRouter } from "@showtime-xyz/universal.router";

import { HIDE_MOBILE_WEB_HEADER_SCREENS } from "app/lib/constants";
import { useNavigationElements } from "app/navigation/use-navigation-elements";

import { breakpoints } from "design-system/theme";

import { withColorScheme } from "../memo-with-theme";
import { HeaderMd } from "./header.md.web";
import { HeaderSm } from "./header.sm.web";

export const Header = withColorScheme(() => {
  const { width } = useWindowDimensions();
  const isMdWidth = width >= breakpoints["md"];

  if (isMdWidth) {
    return <HeaderMd />;
  }
  return <HeaderSm />;
});
