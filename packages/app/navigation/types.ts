import type { NextComponentType, NextPageContext } from "next";
import type { NavigatorScreenParams } from "@react-navigation/native";

type HomeStackParams = {
  home: undefined;
  login: undefined;
  profile: { walletAddress: number };
  nft: { id: number };
};

type TrendingStackParams = {
  trending: undefined;
  login: undefined;
  nft: { id: number };
};

type CameraStackParams = {
  camera: undefined;
  login: undefined;
  nft: { id: number };
  create: undefined;
};

type MarketplaceStackParams = {
  marketplace: undefined;
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
  trendingTab: NavigatorScreenParams<TrendingStackParams>;
  cameraTab: NavigatorScreenParams<CameraStackParams>;
  marketplaceTab: NavigatorScreenParams<MarketplaceStackParams>;
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
  MarketplaceStackParams,
  TrendingStackParams,
  CameraStackParams,
  NotificationsStackParams,
  BottomTabNavigatorParams,
};
