import type { NextComponentType, NextPageContext } from "next";
import type { NavigatorScreenParams } from "@react-navigation/native";

type HomeStackParams = {
  home: undefined;
  login: undefined;
  profile: { walletAddress: number };
  nft: { id: number };
};

type DiscoverStackParams = {
  discover: undefined;
  login: undefined;
  nft: { id: number };
};

type TrendingStackParams = {
  trending: undefined;
  login: undefined;
  nft: { id: number };
};

type NotificationsStackParams = {
  notifications: undefined;
  login: undefined;
  nft: { id: number };
};

type NextPageProps = any;
type NextNavigationProps = {
  Component?: NextComponentType<NextPageContext, null, NextPageProps>;
  pageProps?: NextPageProps;
};

type BottomTabNavigatorParams = {
  homeTab: NavigatorScreenParams<HomeStackParams>;
  discoverTab: NavigatorScreenParams<DiscoverStackParams>;
  trendingTab: NavigatorScreenParams<TrendingStackParams>;
  notificationsTab: NavigatorScreenParams<NotificationsStackParams>;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends BottomTabNavigatorParams {}
  }
}

export type {
  NextNavigationProps,
  HomeStackParams,
  DiscoverStackParams,
  TrendingStackParams,
  NotificationsStackParams,
  BottomTabNavigatorParams,
};
