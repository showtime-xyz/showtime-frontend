import * as React from "react";

import Svg, { SvgProps, Path } from "react-native-svg";

const SvgHourglass = (props: SvgProps) => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M4.81 2.75h14.38M4.81 21.25h14.38M16.54 7.46l-3.08 3.08c-.8.8-2.1.8-2.91 0L7.47 7.46c-.39-.39-.6-.91-.6-1.45v-1.2c0-1.14.92-2.06 2.06-2.06h6.17c1.14 0 2.06.92 2.06 2.06v1.2c-.02.54-.24 1.07-.62 1.45Z"
      stroke={props.color}
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M17.14 19.19c0 1.14-.92 2.06-2.06 2.06H8.92c-1.14 0-2.06-.92-2.06-2.06h10.28Z"
      fill={props.color}
      stroke={props.color}
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M17.14 17.99v1.2H6.86v-1.2c0-.54.22-1.07.6-1.45l3.09-3.09c.8-.8 2.1-.8 2.9 0l3.09 3.09c.38.38.6.91.6 1.45ZM9.94 9.94h4.12"
      stroke={props.color}
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M12 16.86a.75.75 0 0 1-.53-1.28c.2-.21.54-.27.82-.16.09.04.17.09.24.16a.776.776 0 0 1 .22.53.75.75 0 0 1-.75.75Z"
      fill={props.color}
    />
  </Svg>
);

export default SvgHourglass;
