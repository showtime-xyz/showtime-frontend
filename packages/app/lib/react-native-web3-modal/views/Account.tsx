import { View, TouchableOpacity, StyleSheet } from "react-native";

import type { RouterProps } from "src/types/routerTypes";
import { useSnapshot } from "valtio";

import CopyIcon from "../assets/Copy";
import ConnectionBadge from "../components/ConnectionBadge";
import Web3Avatar from "../components/Web3Avatar";
import Web3Text from "../components/Web3Text";
import { AccountCtrl } from "../controllers/AccountCtrl";
import useTheme from "../hooks/useTheme";
import { UiUtil } from "../utils/UiUtil";

export function Account({ onCopyClipboard }: RouterProps) {
  const Theme = useTheme();
  const accountState = useSnapshot(AccountCtrl.state);

  const onCopy = () => {
    if (onCopyClipboard && accountState.address) {
      onCopyClipboard(accountState.address);
    }
  };

  return (
    <>
      <View style={styles.container}>
        <View style={styles.header}>
          <View>
            <Web3Avatar
              address={accountState.address ?? ""}
              style={styles.avatar}
            />
            <View style={styles.row}>
              <Web3Text style={styles.address}>
                {UiUtil.truncate(accountState.address ?? "")}
              </Web3Text>
              {onCopyClipboard && (
                <TouchableOpacity onPress={onCopy} style={styles.button}>
                  <CopyIcon height={14} width={14} fill={Theme.foreground3} />
                </TouchableOpacity>
              )}
            </View>
          </View>
          <ConnectionBadge />
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "space-between",
  },
  header: {
    padding: 24,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  avatar: {
    height: 70,
    width: 70,
    borderRadius: 100,
    marginBottom: 10,
  },
  address: {
    fontSize: 20,
    fontWeight: "bold",
  },
  button: {
    marginLeft: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  row: {
    flexDirection: "row",
  },
});
