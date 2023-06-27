import { useRef, useEffect, useMemo } from "react";
import {
  Animated,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  StatusBar,
} from "react-native";

import { useSnapshot } from "valtio";

import NavHeader from "../components/NavHeader";
import WalletItem, { ITEM_HEIGHT } from "../components/WalletItem";
import { ExplorerCtrl } from "../controllers/ExplorerCtrl";
import { OptionsCtrl } from "../controllers/OptionsCtrl";
import { RouterCtrl } from "../controllers/RouterCtrl";
import { ThemeCtrl } from "../controllers/ThemeCtrl";
import { WcConnectionCtrl } from "../controllers/WcConnectionCtrl";
import useTheme from "../hooks/useTheme";
import type { RouterProps } from "../types/routerTypes";

function ViewAllExplorer({
  isPortrait,
  windowHeight,
  windowWidth,
}: RouterProps) {
  const Theme = useTheme();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const optionsState = useSnapshot(OptionsCtrl.state);
  const wcConnectionState = useSnapshot(WcConnectionCtrl.state);
  const themeState = useSnapshot(ThemeCtrl.state);
  const loading = !optionsState.isDataLoaded || !wcConnectionState.pairingUri;
  const wallets = useMemo(() => {
    return ExplorerCtrl.state.wallets.listings;
  }, []);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  return (
    <Animated.View
      style={{
        opacity: fadeAnim,
      }}
    >
      <>
        <NavHeader
          title="Connect your wallet"
          onBackPress={RouterCtrl.goBack}
        />
        {loading ? (
          <ActivityIndicator
            style={{ height: windowHeight * 0.6 }}
            color={Theme.accent}
          />
        ) : (
          <FlatList
            data={wallets || []}
            style={{
              maxHeight: windowHeight * 0.6 - (StatusBar.currentHeight || 0),
            }}
            contentContainerStyle={styles.listContentContainer}
            indicatorStyle={themeState.themeMode === "dark" ? "white" : "black"}
            showsVerticalScrollIndicator
            numColumns={isPortrait ? 4 : 6}
            key={isPortrait ? "portrait" : "landscape"}
            getItemLayout={(_data, index) => ({
              length: ITEM_HEIGHT,
              offset: ITEM_HEIGHT * index,
              index,
            })}
            renderItem={({ item }) => (
              <WalletItem
                currentWCURI={wcConnectionState.pairingUri}
                walletInfo={item}
                style={{
                  width: isPortrait ? windowWidth / 4 : windowWidth / 7,
                }}
              />
            )}
          />
        )}
      </>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  listContentContainer: {
    paddingBottom: 12,
    alignItems: "center",
  },
});

export default ViewAllExplorer;
