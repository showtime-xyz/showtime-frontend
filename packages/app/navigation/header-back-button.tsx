import {
  HeaderBackButton as ReactNavigationHeaderBackButton,
  HeaderBackButtonProps,
} from "@react-navigation/elements";

import { useRouter } from "design-system/router";

export function HeaderBackButton(props: HeaderBackButtonProps) {
  const router = useRouter();

  if (!props.canGoBack) {
    return null;
  }

  return <ReactNavigationHeaderBackButton {...props} onPress={router.pop} />;
}
