import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import Svg, { Defs, Circle, RadialGradient, Stop } from 'react-native-svg';

import useTheme from '../hooks/useTheme';
import { UiUtil } from '../utils/UiUtil';

interface Props {
  address: string;
  style?: StyleProp<ViewStyle>;
}

function Web3Avatar({ address, style }: Props) {
  const Theme = useTheme();
  const colors = UiUtil.generateAvatarColors(address);
  return (
    <View
      style={[
        style,
        {
          backgroundColor: colors[0],
          borderWidth: StyleSheet.hairlineWidth,
          borderColor: Theme.overlayThick,
        },
      ]}
    >
      <Svg height="100%" width="100%">
        <Defs>
          <RadialGradient
            id="gradient1"
            cx="66%"
            cy="77%"
            rx="100%"
            ry="100%"
            gradientUnits="userSpaceOnUse"
          >
            <Stop offset="0%" stopColor={colors[1]} />
            <Stop offset="50%" stopColor={colors[1]} stopOpacity={0} />
          </RadialGradient>
          <RadialGradient
            id="gradient2"
            cx="29%"
            cy="97%"
            rx="100%"
            ry="100%"
            gradientUnits="userSpaceOnUse"
          >
            <Stop offset="0%" stopColor={colors[2]} />
            <Stop offset="50%" stopColor={colors[2]} stopOpacity={0} />
          </RadialGradient>
          <RadialGradient
            id="gradient3"
            cx="99%"
            cy="86%"
            rx="100%"
            ry="100%"
            gradientUnits="userSpaceOnUse"
          >
            <Stop offset="0%" stopColor={colors[3]} />
            <Stop offset="50%" stopColor={colors[3]} stopOpacity={0} />
          </RadialGradient>
          <RadialGradient
            id="gradient4"
            cx="29%"
            cy="88%"
            rx="100%"
            ry="100%"
            gradientUnits="userSpaceOnUse"
          >
            <Stop offset="0%" stopColor={colors[4]} />
            <Stop offset="50%" stopColor={colors[4]} stopOpacity={0} />
          </RadialGradient>
        </Defs>
        <Circle
          fill="url(#gradient4)"
          cx="50%"
          cy="50%"
          r="50%"
          opacity={0.7}
        />
        <Circle
          fill="url(#gradient3)"
          cx="50%"
          cy="50%"
          r="50%"
          opacity={0.7}
        />
        <Circle
          fill="url(#gradient2)"
          cx="50%"
          cy="50%"
          r="50%"
          opacity={0.7}
        />
        <Circle
          fill="url(#gradient1)"
          cx="50%"
          cy="50%"
          r="50%"
          opacity={0.7}
        />
      </Svg>
    </View>
  );
}

export default Web3Avatar;
