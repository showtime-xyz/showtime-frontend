import type { NavigatorScreenParams } from "@react-navigation/native";
import type { NextComponentType, NextPageContext } from "next";

type HomeStackParams = {
  home: undefined;
  login: undefined;
  list: { id: number };
  profile: { walletAddress: number };
  settings: undefined;
};

// TODO: Add correct types, just quick copy-paste from Trending
type CreatorChannelsStackParams = {
  channels: undefined;
  channelId: undefined;
};

type TrendingStackParams = {
  trending: undefined;
  login: undefined;
  profile: { walletAddress: number };
  settings: undefined;
};

type NotificationsStackParams = {
  notifications: undefined;
  login: undefined;
  settings: undefined;
};

type ProfileStackParams = {
  walletAddress: undefined;
  profile: { username: string };
  login: undefined;
  settings: undefined;
  posts: undefined;
};

type NextPageProps = any;
type NextNavigationProps = {
  Component?: NextComponentType<NextPageContext, null, NextPageProps>;
  pageProps?: NextPageProps;
};

type BottomTabNavigatorParams = {
  homeTab: NavigatorScreenParams<HomeStackParams>;
  creatorChannelsTab: NavigatorScreenParams<TrendingStackParams>;
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
  payoutsSetup: undefined;
  trending: undefined;
  channelsMessageReactions: undefined;
  postShare: undefined;
  search: undefined;
  login: undefined;
  editProfile: undefined;
  onboarding: undefined;
  addEmail: undefined;
  verifyPhoneNumber: undefined;
  creatorTokensExplanation: undefined;
  enterInviteCode: undefined;
  creatorTokenInviteSignIn: undefined;
  creatorTokenSocialShare: undefined;
  creatorTokensSelfServeExplainer: undefined;
  creatorTokensImportAllowlist: undefined;
  creatorTokensImportAllowlistSuccess: undefined;
  inviteCreatorToken: undefined;
  reviewCreatorToken: undefined;
  creatorTokenBuy: undefined;
  qrCodeShare: undefined;
  dropImageShare: undefined;
  dropViewShareModal: undefined;
  claimLimitExplanation: undefined;
  posts: undefined;
  postDetail: undefined;
  channelsSettings: undefined;
  channelUnlocked: undefined;
  creatorTokensShare: undefined;
  creatorTokenCollectors: undefined;
  creatorTokenCollected: undefined;
  report: {
    nftId?: string;
    userId?: string;
  };
  channelsMessage: undefined;
  channelsIntro: undefined;
  channelsShare: undefined;
  channelsCongrats: undefined;
  channelsMembers: undefined;
  viewer: undefined;
  uploadPreview: undefined;
  uploadComposer: undefined;
};

export type {
  NextNavigationProps,
  HomeStackParams,
  CreatorChannelsStackParams,
  TrendingStackParams,
  NotificationsStackParams,
  ProfileStackParams,
  BottomTabNavigatorParams,
  RootStackNavigatorParams,
};
