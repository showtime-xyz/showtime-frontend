import {
  Image,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  StyleProp,
  ViewStyle,
  ImageStyle,
} from 'react-native';

import useTheme from '../hooks/useTheme';
import type { Listing } from '../types/controllerTypes';
import { ExplorerUtil } from '../utils/ExplorerUtil';

interface Props {
  onPress: any;
  wallets: Listing[];
  style?: StyleProp<ViewStyle>;
}

const WalletIcon = ({
  wallet,
  style,
}: {
  wallet: Listing;
  style: StyleProp<ImageStyle>;
}) => (
  <Image
    source={{ uri: ExplorerUtil.getWalletImageUrl(wallet.image_id) }}
    style={style}
  />
);

function ViewAllBox({ onPress, wallets, style }: Props) {
  const Theme = useTheme();
  return (
    <TouchableOpacity onPress={onPress} style={[styles.container, style]}>
      <View style={[styles.icons, { borderColor: Theme.overlayThin }]}>
        <View style={styles.row}>
          {wallets.slice(0, 2).map((wallet) => (
            <WalletIcon
              key={wallet.id}
              wallet={wallet}
              style={[styles.icon, { borderColor: Theme.overlayThin }]}
            />
          ))}
        </View>
        <View style={styles.row}>
          {wallets.slice(2, 4).map((wallet) => (
            <WalletIcon
              key={wallet.id}
              wallet={wallet}
              style={[styles.icon, { borderColor: Theme.overlayThin }]}
            />
          ))}
        </View>
      </View>
      <View>
        <Text
          style={[styles.text, { color: Theme.foreground1 }]}
          numberOfLines={1}
        >
          View All
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 80,
    height: 80,
    alignItems: 'center',
    marginVertical: 16,
  },
  icons: {
    height: 60,
    width: 60,
    borderRadius: 16,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    height: 23,
    width: 23,
    borderRadius: 8,
    margin: 1,
    borderWidth: 1,
  },
  row: {
    flexDirection: 'row',
  },
  text: {
    marginTop: 5,
    maxWidth: 100,
    fontWeight: '600',
    fontSize: 12,
  },
});

export default ViewAllBox;
