import { proxy } from 'valtio';

import type { AccountCtrlState } from '../types/controllerTypes';
import { ClientCtrl } from './ClientCtrl';

// -- initial state ------------------------------------------------ //
const state = proxy<AccountCtrlState>({
  address: undefined,
  isConnected: false,
});

// -- controller --------------------------------------------------- //
export const AccountCtrl = {
  state,

  async getAccount() {
    const web3Provider = ClientCtrl.state.web3Provider;
    if (web3Provider) {
      const signer = web3Provider.getSigner();
      const currentAddress = await signer.getAddress();
      state.address = currentAddress;
      state.isConnected = true;
    }
  },

  setAddress(address: AccountCtrlState['address']) {
    state.address = address;
  },

  setIsConnected(isConnected: AccountCtrlState['isConnected']) {
    state.isConnected = isConnected;
  },

  resetAccount() {
    state.address = undefined;
    state.isConnected = false;
  },
};
