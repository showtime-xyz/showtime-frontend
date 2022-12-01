import * as React from "react";

import Svg, { SvgProps, Path } from "react-native-svg";

const SvgLock = (props: SvgProps) => (
  <Svg viewBox="0 0 24 24" width={24} height={24} {...props}>
    <Path d="M17 9V7c0-2.8-2.2-5-5-5S7 4.2 7 7v2c-1.7 0-3 1.3-3 3v7c0 1.7 1.3 3 3 3h10c1.7 0 3-1.3 3-3v-7c0-1.7-1.3-3-3-3zM9 7c0-1.7 1.3-3 3-3s3 1.3 3 3v2H9V7zm4.1 8.5-.1.1V17c0 .6-.4 1-1 1s-1-.4-1-1v-1.4c-.6-.6-.7-1.5-.1-2.1.6-.6 1.5-.7 2.1-.1.6.5.7 1.5.1 2.1z" />
  </Svg>
);

export default SvgLock;
