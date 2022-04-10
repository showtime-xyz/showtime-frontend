import {
  useNavigation as useNativeRouter,
  NavigationState,
} from "@react-navigation/native";
import { useRouter as SolitoRouter } from "solito/router";

const getPath = (navigationState: NavigationState) => {
  return (
    navigationState?.routes?.[navigationState?.index]?.path ??
    navigationState?.routes?.[navigationState?.index]?.state?.routes[0]?.path ??
    "/"
  );
};

export function useRouter() {
  const { getState } = useNativeRouter();
  const solitoRouter = SolitoRouter();
  return {
    ...solitoRouter,
    pop: () => {
      solitoRouter.back();
    },
    pathname: getPath(getState()),
  };
}
