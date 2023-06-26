import { proxy } from "valtio";

import type { RouterCtrlState } from "../types/controllerTypes";

// -- initial state ------------------------------------------------ //
const state = proxy<RouterCtrlState>({
  history: ["ConnectWallet"],
  view: "ConnectWallet",
});

// -- controller --------------------------------------------------- //
export const RouterCtrl = {
  state,

  push(view: RouterCtrlState["view"]) {
    if (view !== state.view) {
      state.view = view;
      state.history.push(view);
    }
  },

  replace(view: RouterCtrlState["view"]) {
    state.view = view;
    state.history = [view];
  },

  goBack() {
    if (state.history.length > 1) {
      state.history.pop();
      const [last] = state.history.slice(-1);
      state.view = last || "ConnectWallet";
    }
  },
};
