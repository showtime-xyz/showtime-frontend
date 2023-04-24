import * as React from "react";

import Svg, { SvgProps, Path } from "react-native-svg";

const SvgUser1 = (props: SvgProps) => (
  <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}>
    <Path
      stroke={props.color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M21 22v-2c0-1.06-.474-2.078-1.318-2.828C18.838 16.422 17.694 16 16.5 16h-9c-1.193 0-2.338.421-3.182 1.172C3.474 17.922 3 18.939 3 20v2M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10Z"
    />
  </Svg>
);
export default SvgUser1;
