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

// TODO: Add correct types, just quick copy-paste from Trending
type CreatorChannelsStackParams = {
  channels: undefined;
  channelId: undefined;
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
  creatorChannelsTab: NavigatorScreenParams<TrendingStackParams>;
  cameraTab: NavigatorScreenParams<CameraStackParams>;
  notificationsTab: NavigatorScreenParams<NotificationsStackParams>;
  profileTab: NavigatorScreenParams<ProfileStackParams>;
};
type SwipeListParams = {
  profileId?: string;
  initialScrollIndex?: number;
  collectionId?: number;
  sortType?: string;
  tabType?: string;
  type: string;
};
type RootStackNavigatorParams = {
  bottomTabs: BottomTabNavigatorParams;
  profile: ProfileStackParams["profile"];
  settings: undefined;
  privacySecuritySettings: undefined;
  notificationSettings: undefined;
  blockedList: undefined;
  payoutsSetup: undefined;
  dropStar: undefined;
  dropSlug: SwipeListParams & {
    dropSlug?: string;
  };
  trending: undefined;
  dropEvent: undefined;
  dropPrivate: undefined;
  dropUpdate: undefined;
  dropEditDetailsModal: undefined;
  channelsMessageReactions: undefined;
  search: undefined;
  swipeList: SwipeListParams;
  nft: SwipeListParams;
  login: undefined;
  comments: undefined;
  details: undefined;
  activity: undefined;
  editProfile: undefined;
  onboarding: undefined;
  followers: undefined;
  following: undefined;
  addEmail: undefined;
  verifyPhoneNumber: undefined;
  dropExplanation: undefined;
  creatorTokensExplanation: undefined;
  enterInviteCode: undefined;
  creatorTokenInviteSignIn: undefined;
  creatorTokensSelfServeExplainer: undefined;
  inviteCreatorToken: undefined;
  drop: undefined;
  qrCodeShare: undefined;
  dropImageShare: undefined;
  dropViewShareModal: undefined;
  raffle: undefined;
  claim: undefined;
  collectors: undefined;
  spotifyAuth: undefined;
  claimLimitExplanation: undefined;
  channelsSettings: undefined;
  channelUnlocked: undefined;
  creatorTokensShare: undefined;
  topCreatorTokens: undefined;
  likers: undefined;
  appleMusicAuthNativeWebView: undefined;
  report: {
    nftId?: string;
    userId?: string;
  };
  channelsMessage: undefined;
  channelsIntro: undefined;
  channelsShare: undefined;
  channelsCongrats: undefined;
  channelsMembers: undefined;
};

export type {
  NextNavigationProps,
  HomeStackParams,
  CreatorChannelsStackParams,
  TrendingStackParams,
  CameraStackParams,
  CreateStackParams,
  NotificationsStackParams,
  ProfileStackParams,
  BottomTabNavigatorParams,
  RootStackNavigatorParams,
};
