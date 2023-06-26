import type { IUniversalProvider } from "@walletconnect/universal-provider";
import type { ethers } from "ethers";

// -- ClientCtrl ------------------------------------------- //
export interface ClientCtrlState {
  initialized: boolean;
  provider?: IUniversalProvider;
  web3Provider?: ethers.providers.Web3Provider;
  sessionTopic?: string;
}

// -- ConfigCtrl ------------------------------------------- //
export interface ConfigCtrlState {
  projectId: string;
  recentWalletDeepLink?: string;
}

// -- ModalCtrl --------------------------------------- //
export interface ModalCtrlState {
  open: boolean;
}

// -- OptionsCtrl --------------------------------------- //
export interface OptionsCtrlState {
  isDataLoaded: boolean;
}

// -- AccountCtrl --------------------------------------- //
export interface AccountCtrlState {
  address?: string;
  isConnected: boolean;
}

// -- WcConnectionCtrl ------------------------------------- //
export interface WcConnectionCtrlState {
  pairingUri: string;
  pairingError: boolean;
}

// -- ExplorerCtrl ------------------------------------------- //
export interface ExplorerCtrlState {
  wallets: ListingResponse & { page: number };
}

// -- ThemeCtrl --------------------------------------------- //
export interface ThemeCtrlState {
  themeMode: "dark" | "light";
}

export interface ListingParams {
  page?: number;
  search?: string;
  entries?: number;
  version?: number;
  chains?: string;
}

export interface PlatformInfo {
  native: string;
  universal: string;
}

export interface Listing {
  id: string;
  name: string;
  homepage: string;
  image_id: string;
  app: {
    browser: string;
    ios: string;
    android: string;
    mac: string;
    window: string;
    linux: string;
  };
  mobile: PlatformInfo;
  desktop: PlatformInfo;
}

export interface ListingResponse {
  listings: Listing[];
  total: number;
}

// -- RouterCtrl --------------------------------------------- //
export type RouterView =
  | "ConnectWallet"
  | "Qrcode"
  | "WalletExplorer"
  | "Account";

export interface RouterCtrlState {
  history: RouterView[];
  view: RouterView;
}
