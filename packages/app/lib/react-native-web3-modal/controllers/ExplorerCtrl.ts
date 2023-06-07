import { proxy } from 'valtio';

import type {
  ExplorerCtrlState,
  ListingParams,
} from '../types/controllerTypes';
import { ExplorerUtil } from '../utils/ExplorerUtil';

// -- initial state ------------------------------------------------ //
const state = proxy<ExplorerCtrlState>({
  wallets: { listings: [], total: 0, page: 1 },
});

// -- controller --------------------------------------------------- //
export const ExplorerCtrl = {
  state,

  async getMobileWallets(params: ListingParams) {
    const { listings, total } = await ExplorerUtil.getListings(params);
    state.wallets = { listings: Object.values(listings), page: 1, total };
  },

  getWalletImageUrl(imageId: string) {
    return ExplorerUtil.getWalletImageUrl(imageId);
  },

  getAssetImageUrl(imageId: string) {
    return ExplorerUtil.getAssetImageUrl(imageId);
  },
};
