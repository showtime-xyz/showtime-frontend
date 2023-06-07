import type {
  ConnectParams,
  Metadata,
  IUniversalProvider,
} from '@walletconnect/universal-provider';

export type IProvider = IUniversalProvider;

export interface IProviderMetadata extends Metadata {
  redirect: {
    native: string;
    universal?: string;
  };
}

export type ISessionParams = ConnectParams;
