import * as React from "react";

import Svg, { SvgProps, Path } from "react-native-svg";

const SvgEyeOffV2 = (props: SvgProps) => (
  <Svg width={24} height={24} fill="none" viewBox="0 0 19 19" {...props}>
    <Path
      stroke={props.color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="m11.652 7.418-3.716 3.717a2.627 2.627 0 1 1 3.716-3.716Z"
    />
    <Path
      stroke={props.color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M14.069 4.701c-1.286-.97-2.755-1.498-4.275-1.498-2.592 0-5.009 1.527-6.69 4.171-.356.557-.831 1.317-.805 2.062.023.641.499 1.271.804 1.75.58.91 1.256 1.697 1.99 2.328M15.97 6.626c.179.237.352.484.515.741.356.558.799 1.32.771 2.067-.024.64-.466 1.267-.771 1.745-1.682 2.644-4.098 4.171-6.69 4.171-.76 0-1.51-.135-2.227-.387"
    />
    <Path
      stroke={props.color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M12.372 9.79a2.618 2.618 0 0 1-2.071 2.072M7.936 11.135 2.45 16.62M17.139 1.932l-5.487 5.486"
    />
  </Svg>
);
export default SvgEyeOffV2;
