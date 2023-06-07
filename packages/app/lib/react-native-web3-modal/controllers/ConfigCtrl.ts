import { proxy } from 'valtio';

import type { ConfigCtrlState } from '../types/controllerTypes';

// -- initial state ------------------------------------------------ //
const state = proxy<ConfigCtrlState>({
  projectId: '',
  recentWalletDeepLink: undefined,
});

// -- controller --------------------------------------------------- //
export const ConfigCtrl = {
  state,

  setProjectId(projectId: ConfigCtrlState['projectId']) {
    if (projectId !== state.projectId) {
      state.projectId = projectId;
    }
  },

  setRecentWalletDeepLink(deepLink?: string) {
    state.recentWalletDeepLink = deepLink;
  },

  getRecentWalletDeepLink() {
    return state.recentWalletDeepLink;
  },

  resetConfig() {
    state.recentWalletDeepLink = undefined;
  },
};
