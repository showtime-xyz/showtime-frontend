import { useSnapshot } from 'valtio';

import { ModalCtrl } from '../controllers/ModalCtrl';
import { ClientCtrl } from '../controllers/ClientCtrl';
import { AccountCtrl } from '../controllers/AccountCtrl';

export function useWeb3Modal() {
  const modalState = useSnapshot(ModalCtrl.state);
  const accountState = useSnapshot(AccountCtrl.state);
  const clientState = useSnapshot(ClientCtrl.state);

  return {
    isOpen: modalState.open,
    open: ModalCtrl.open,
    close: ModalCtrl.close,
    provider: clientState.initialized ? ClientCtrl.provider() : undefined,
    isConnected: accountState.isConnected,
    address: accountState.address,
  };
}
