import * as React from "react";

import Svg, { SvgProps, Circle, Path } from "react-native-svg";

const SvgShowtimeRounded = (props: SvgProps) => (
  <Svg width={24} height={24} fill="none" viewBox="0 0 16 16" {...props}>
    <Circle
      cx={7.895}
      cy={8.131}
      r={6.971}
      stroke={props.color}
      strokeWidth={1.059}
    />
    <Path
      fill={props.color}
      d="M11.585 8.321a.207.207 0 0 0 0-.38l-1.12-.48a3.618 3.618 0 0 1-1.901-1.9l-.48-1.122a.207.207 0 0 0-.38 0L7.222 5.56a3.618 3.618 0 0 1-1.9 1.9L4.2 7.942a.207.207 0 0 0 0 .38l1.121.48a3.618 3.618 0 0 1 1.9 1.901l.481 1.121a.207.207 0 0 0 .38 0l.48-1.12a3.618 3.618 0 0 1 1.901-1.901l1.121-.48Z"
    />
  </Svg>
);
export default SvgShowtimeRounded;
