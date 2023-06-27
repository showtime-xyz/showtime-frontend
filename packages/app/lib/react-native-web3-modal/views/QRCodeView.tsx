import { useEffect, useRef } from "react";
import { ActivityIndicator, Animated, StyleSheet } from "react-native";

import { useSnapshot } from "valtio";

import CopyIcon from "../assets/CopyLarge";
import NavHeader from "../components/NavHeader";
import QRCode from "../components/QRCode";
import { RouterCtrl } from "../controllers/RouterCtrl";
import { ThemeCtrl } from "../controllers/ThemeCtrl";
import { WcConnectionCtrl } from "../controllers/WcConnectionCtrl";
import useTheme from "../hooks/useTheme";
import type { RouterProps } from "../types/routerTypes";

function QRCodeView({
  onCopyClipboard,
  isPortrait,
  windowHeight,
  windowWidth,
}: RouterProps) {
  const Theme = useTheme();
  const themeState = useSnapshot(ThemeCtrl.state);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const wcConnectionState = useSnapshot(WcConnectionCtrl.state);

  const onCopy = async () => {
    if (onCopyClipboard && wcConnectionState.pairingUri) {
      onCopyClipboard(wcConnectionState.pairingUri);
      // Show toast
    }
  };

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <NavHeader
        title="Scan the code"
        onBackPress={RouterCtrl.goBack}
        actionIcon={CopyIcon}
        onActionPress={onCopyClipboard ? onCopy : undefined}
        actionDisabled={!wcConnectionState.pairingUri}
      />
      {wcConnectionState?.pairingUri ? (
        <QRCode
          uri={wcConnectionState.pairingUri}
          size={isPortrait ? windowWidth * 0.9 : windowHeight * 0.6}
          theme={themeState.themeMode}
        />
      ) : (
        <ActivityIndicator
          style={{
            height: isPortrait ? windowWidth * 0.9 : windowHeight * 0.6,
          }}
          color={Theme.accent}
        />
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 12,
  },
});

export default QRCodeView;
