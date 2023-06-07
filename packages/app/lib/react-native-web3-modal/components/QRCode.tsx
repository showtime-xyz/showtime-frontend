import { useMemo } from 'react';
import { Svg } from 'react-native-svg';
import { View, StyleSheet } from 'react-native';

import { QRCodeUtil } from '../utils/QRCodeUtil';
import WCLogo from '../assets/WCLogo';
import { DarkTheme, LightTheme } from '../constants/Colors';

interface Props {
  uri: string;
  size: number;
  theme?: 'light' | 'dark';
}

function QRCode({ uri, size, theme = 'light' }: Props) {
  const tintColor = theme === 'light' ? LightTheme.accent : DarkTheme.accent;
  const dots = useMemo(
    () => QRCodeUtil.generate(uri, size, size / 4, theme),
    [uri, size, theme]
  );

  return (
    <View style={styles.container}>
      <Svg height={size} width={size}>
        {dots}
      </Svg>
      <WCLogo width={size / 4} fill={tintColor} style={styles.logo} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    position: 'absolute',
  },
});

export default QRCode;
