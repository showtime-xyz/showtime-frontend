import { useMemo } from 'react';
import { useSnapshot } from 'valtio';

import QRCodeView from '../views/QRCodeView';
import ViewAllExplorer from '../views/ViewAllExplorer';
import { RouterCtrl } from '../controllers/RouterCtrl';
import InitialExplorer from '../views/InitialExplorer';
import { Account } from '../views/Account';
import { Error } from '../views/Error';
import { useOrientation } from '../hooks/useOrientation';

interface Props {
  onCopyClipboard?: (value: string) => void;
}

export function Web3ModalRouter(props: Props) {
  const routerState = useSnapshot(RouterCtrl.state);
  const { height, width, isPortrait } = useOrientation();

  const ViewComponent = useMemo(() => {
    switch (routerState.view) {
      case 'ConnectWallet':
        return InitialExplorer;
      case 'WalletExplorer':
        return ViewAllExplorer;
      case 'Qrcode':
        return QRCodeView;
      case 'Account':
        return Account;
      default:
        return Error;
    }
  }, [routerState.view]);

  return (
    <ViewComponent
      windowHeight={height}
      windowWidth={width}
      isPortrait={isPortrait}
      {...props}
    />
  );
}
