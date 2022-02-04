import type { NavigatorScreenParams } from "@react-navigation/native";
import type { NextComponentType, NextPageContext } from "next";

type HomeStackParams = {
  home: undefined;
  login: undefined;
  nft: { id: number };
  nftTransfer: { id: number };
  burn: undefined;
  list: undefined;
  profile: { walletAddress: number };
  settings: undefined;
};

type TrendingStackParams = {
  trending: undefined;
  login: undefined;
  nft: { id: number };
  profile: { walletAddress: number };
  settings: undefined;
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
  settings: undefined;
};

type NotificationsStackParams = {
  notifications: undefined;
  login: undefined;
  nft: { id: number };
  settings: undefined;
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
  // namespace ReactNavigation {
  //   interface RootParamList extends BottomTabNavigatorParams {}
  // }
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
