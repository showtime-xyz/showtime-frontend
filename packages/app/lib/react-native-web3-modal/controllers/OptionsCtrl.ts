import { proxy } from 'valtio';

import type { OptionsCtrlState } from '../types/controllerTypes';

// -- initial state ------------------------------------------------ //
const state = proxy<OptionsCtrlState>({
  isDataLoaded: false,
});

// -- controller --------------------------------------------------- //
export const OptionsCtrl = {
  state,

  setIsDataLoaded(isDataLoaded: OptionsCtrlState['isDataLoaded']) {
    state.isDataLoaded = isDataLoaded;
  },
};
