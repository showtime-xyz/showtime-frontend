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

type CreateStackParams = {
  login: undefined;
  nft: { id: number };
  create: undefined;
  drop: undefined;
};

type NotificationsStackParams = {
  notifications: undefined;
  login: undefined;
  nft: { id: number };
  settings: undefined;
};

type ProfileStackParams = {
  walletAddress: undefined;
  profile: { username: string };
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
  notificationsTab: NavigatorScreenParams<NotificationsStackParams>;
  profileTab: NavigatorScreenParams<ProfileStackParams>;
};

type RootStackNavigatorParams = {
  bottomTabs: BottomTabNavigatorParams;
  profile: ProfileStackParams["profile"];
  settings: undefined;
  privacySecuritySettings: undefined;
  notificationSettings: undefined;
  blockedList: undefined;
  dropMusic: undefined;
  dropFree: undefined;
  dropEvent: undefined;
  dropPrivate: undefined;
  search: undefined;
  swipeList: {
    profileId?: string;
    initialScrollIndex?: number;
    collectionId?: number;
    sortType?: string;
    tabType?: string;
    type: string;
  };
  nft: undefined;
  login: undefined;
  comments: undefined;
  details: undefined;
  activity: undefined;
  editProfile: undefined;
  completeProfile: undefined;
  followers: undefined;
  following: undefined;
  addEmail: undefined;
  verifyPhoneNumber: undefined;
  drop: undefined;
  qrCodeShare: undefined;
  claim: undefined;
  collectors: undefined;
  spotifyAuth: undefined;
  claimLimitExplanation: undefined;
  likers: undefined;
  report: {
    nftId?: string;
    userId?: string;
  };
};

export type {
  NextNavigationProps,
  HomeStackParams,
  TrendingStackParams,
  CameraStackParams,
  CreateStackParams,
  NotificationsStackParams,
  ProfileStackParams,
  BottomTabNavigatorParams,
  RootStackNavigatorParams,
};
