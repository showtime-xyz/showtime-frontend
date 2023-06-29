import {
  Platform,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

import { useSnapshot } from "valtio";

import CloseIcon from "../assets/Close";
import DisconnectIcon from "../assets/Disconnect";
import WCLogo from "../assets/LogoLockup";
import { ClientCtrl } from "../controllers/ClientCtrl";
import { ModalCtrl } from "../controllers/ModalCtrl";
import { RouterCtrl } from "../controllers/RouterCtrl";
import useTheme from "../hooks/useTheme";

interface Web3ModalHeaderProps {
  onClose: () => void;
}

export function Web3ModalHeader({ onClose }: Web3ModalHeaderProps) {
  const Theme = useTheme();
  const routerState = useSnapshot(RouterCtrl.state);

  const onDisconnect = () => {
    ClientCtrl.provider()?.disconnect();
    ModalCtrl.close();
  };

  return (
    <SafeAreaView style={styles.container}>
      <WCLogo width={181} height={28} fill="white" />
      <View style={styles.row}>
        {routerState.view === "Account" && (
          <TouchableOpacity
            style={[
              styles.buttonContainer,
              styles.disconnectButton,
              { backgroundColor: Theme.background1 },
            ]}
            onPress={onDisconnect}
          >
            <DisconnectIcon height={14} fill={Theme.foreground1} />
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={[
            styles.buttonContainer,
            { backgroundColor: Theme.background1 },
          ]}
          onPress={onClose}
        >
          <CloseIcon height={11} fill={Theme.foreground1} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 46,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginHorizontal: 10,
  },
  row: {
    flexDirection: "row",
  },
  buttonContainer: {
    height: 28,
    width: 28,
    borderRadius: 14,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    ...Platform.select({
      ios: {
        shadowColor: "rgba(0, 0, 0, 0.12)",
        shadowOpacity: 1,
        shadowOffset: { width: 0, height: 4 },
      },
      android: {
        borderColor: "rgba(0, 0, 0, 0.12)",
        borderWidth: 1,
        elevation: 4,
      },
    }),
  },
  disconnectButton: {
    marginRight: 16,
  },
});

export default Web3ModalHeader;
