import { useEffect } from "react";
import { StyleSheet, Alert, SafeAreaView, View } from "react-native";

import type { SessionTypes } from "@walletconnect/types";
import Modal from "react-native-modal";
import { useSnapshot } from "valtio";

import { defaultSessionParams } from "../constants/Config";
import { AccountCtrl } from "../controllers/AccountCtrl";
import { ClientCtrl } from "../controllers/ClientCtrl";
import { ConfigCtrl } from "../controllers/ConfigCtrl";
import { ModalCtrl } from "../controllers/ModalCtrl";
import { useConfigure } from "../hooks/useConfigure";
import { useOrientation } from "../hooks/useOrientation";
import useTheme from "../hooks/useTheme";
import type { IProviderMetadata, ISessionParams } from "../types/coreTypes";
import { setDeepLinkWallet } from "../utils/StorageUtil";
import Web3ModalHeader from "./Web3ModalHeader";
import { Web3ModalRouter } from "./Web3ModalRouter";

interface Web3ModalProps {
  projectId: string;
  providerMetadata: IProviderMetadata;
  sessionParams?: ISessionParams;
  relayUrl?: string;
  onCopyClipboard?: (value: string) => void;
  themeMode?: "dark" | "light";
}

export function Web3Modal({
  projectId,
  providerMetadata,
  sessionParams = defaultSessionParams,
  relayUrl,
  onCopyClipboard,
  themeMode,
}: Web3ModalProps) {
  useConfigure({ projectId, providerMetadata, relayUrl, themeMode });
  const { open } = useSnapshot(ModalCtrl.state);
  const { isConnected } = useSnapshot(AccountCtrl.state);
  const { width } = useOrientation();
  const Theme = useTheme();

  const onSessionCreated = async (session: SessionTypes.Struct) => {
    ClientCtrl.setSessionTopic(session.topic);
    const deepLink = ConfigCtrl.getRecentWalletDeepLink();
    try {
      if (deepLink) {
        await setDeepLinkWallet(deepLink);
        ConfigCtrl.setRecentWalletDeepLink(undefined);
      }
      AccountCtrl.getAccount();
      ModalCtrl.close();
    } catch (error) {
      Alert.alert("Error", "Error setting deep link wallet");
    }
  };

  const onSessionError = async () => {
    ConfigCtrl.setRecentWalletDeepLink(undefined);
    ModalCtrl.close();
    Alert.alert("Error", "Error with session");
  };

  const onConnect = async () => {
    const provider = ClientCtrl.provider();
    try {
      if (!provider) throw new Error("Provider not initialized");

      if (!isConnected) {
        const session = await provider.connect(sessionParams);
        if (session) {
          onSessionCreated(session);
        }
      }
    } catch (error) {
      onSessionError();
    }
  };

  useEffect(() => {
    if (!projectId) {
      Alert.alert("Error", "Please provide a projectId");
    }
  }, [projectId]);

  return (
    <Modal
      isVisible={open}
      style={styles.modal}
      propagateSwipe
      hideModalContentWhileAnimating
      onBackdropPress={ModalCtrl.close}
      onModalWillShow={onConnect}
      useNativeDriver
      statusBarTranslucent
    >
      <View
        style={[styles.container, { width, backgroundColor: Theme.accent }]}
      >
        <Web3ModalHeader onClose={ModalCtrl.close} />
        <SafeAreaView
          style={[
            styles.connectWalletContainer,
            { backgroundColor: Theme.background1 },
          ]}
        >
          <Web3ModalRouter onCopyClipboard={onCopyClipboard} />
        </SafeAreaView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modal: {
    margin: 0,
    justifyContent: "flex-end",
  },
  container: {
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  connectWalletContainer: {
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
});
