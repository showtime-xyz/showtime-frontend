import { useCallback } from "react";

import { useSnapshot } from "valtio";

import { Logger } from "app/lib/logger";

import { AccountCtrl } from "../controllers/AccountCtrl";
import { ClientCtrl } from "../controllers/ClientCtrl";
import { ConfigCtrl } from "../controllers/ConfigCtrl";
import { ModalCtrl } from "../controllers/ModalCtrl";
import { WcConnectionCtrl } from "../controllers/WcConnectionCtrl";
import { removeDeepLinkWallet } from "../utils/StorageUtil";

export function useWeb3Modal() {
  const modalState = useSnapshot(ModalCtrl.state);
  const accountState = useSnapshot(AccountCtrl.state);
  const clientState = useSnapshot(ClientCtrl.state);

  return {
    isOpen: modalState.open,
    open: ModalCtrl.open,
    close: ModalCtrl.close,
    provider: clientState.initialized ? ClientCtrl.provider() : undefined,
    disconnect: useCallback(() => {
      Logger.log("disconnect callled");
      ClientCtrl.provider()?.disconnect();
      ClientCtrl.resetSession();
      AccountCtrl.resetAccount();
      WcConnectionCtrl.resetConnection();
      ConfigCtrl.resetConfig();
      removeDeepLinkWallet();
    }, []),
    isConnected: accountState.isConnected,
    address: accountState.address,
  };
}
