import type { NavigatorScreenParams } from "@react-navigation/native";
import type { NextComponentType, NextPageContext } from "next";

type HomeStackParams = {
  home: undefined;
  login: undefined;
  nft: { id: number };
  nftTransfer: { id: number };
  delete: { id: number };
  list: { id: number };
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

type NotificationsStackParams = {
  notifications: undefined;
  login: undefined;
  nft: { id: number };
  settings: undefined;
};

type ProfileStackParams = {
  walletAddress: undefined;
  profile: { walletAddress: number };
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
  home: NavigatorScreenParams<HomeStackParams>;
  trending: NavigatorScreenParams<TrendingStackParams>;
  camera: NavigatorScreenParams<CameraStackParams>;
  notifications: NavigatorScreenParams<NotificationsStackParams>;
  profile: NavigatorScreenParams<ProfileStackParams>;
};

declare global {
  // namespace ReactNavigation {
  //   interface RootParamList extends BottomTabNavigatorParams {}
  // }
}

export type {
  NextNavigationProps,
  HomeStackParams,
  TrendingStackParams,
  CameraStackParams,
  NotificationsStackParams,
  ProfileStackParams,
  BottomTabNavigatorParams,
};
