import { fontFamily } from "design-system/typography";

export const navigatorScreenOptions = {
  animationEnabled: true,
  headerShown: false,
  headerStyle: {
    height: 0,
  },
  // headerBackTitleVisible: false,
  // headerTitleStyle: {
  //   fontFamily: fontFamily("Inter-Black"),
  // },
  // headerLeft: Platform.select({
  //   web(props: HeaderBackButtonProps) {
  //     return <HeaderBackButton {...props} />;
  //   },
  // }),
  cardStyle: { flex: 1, backgroundColor: "transparent" },
};
