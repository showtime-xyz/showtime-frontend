import { proxy } from "valtio";

import type { ModalCtrlState } from "../types/controllerTypes";
import { AccountCtrl } from "./AccountCtrl";
import { ClientCtrl } from "./ClientCtrl";
import { OptionsCtrl } from "./OptionsCtrl";
import { RouterCtrl } from "./RouterCtrl";

// -- types -------------------------------------------------------- //
export interface OpenOptions {
  route?: "ConnectWallet" | "Qrcode" | "WalletExplorer" | "Account";
}

// -- initial state ------------------------------------------------ //
const state = proxy<ModalCtrlState>({
  open: false,
});

// -- controller --------------------------------------------------- //
export const ModalCtrl = {
  state,

  async open(options?: OpenOptions) {
    return new Promise<void>((resolve) => {
      const { isDataLoaded } = OptionsCtrl.state;
      const { isConnected } = AccountCtrl.state;
      const { initialized } = ClientCtrl.state;

      if (options?.route) {
        if (!isConnected && options.route === "Account") {
          RouterCtrl.replace("ConnectWallet");
        } else {
          RouterCtrl.replace(options.route);
        }
      } else if (isConnected) {
        RouterCtrl.replace("Account");
      } else {
        RouterCtrl.replace("ConnectWallet");
      }

      // Open modal if async data is ready
      if (initialized && isDataLoaded) {
        state.open = true;
        resolve();
      }
      // Otherwise (slow network) re-attempt open checks
      else {
        const interval = setInterval(() => {
          if (ClientCtrl.state.initialized && OptionsCtrl.state.isDataLoaded) {
            clearInterval(interval);
            state.open = true;
            resolve();
          }
        }, 200);
      }
    });
  },

  close() {
    state.open = false;
  },
};
