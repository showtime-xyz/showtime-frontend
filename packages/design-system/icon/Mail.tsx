import * as React from "react";

import Svg, { SvgProps, Path } from "react-native-svg";

const SvgMail = (props: SvgProps) => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M2 6.711V17.636a2.733 2.733 0 0 0 2.727 2.727h14.546A2.733 2.733 0 0 0 22 17.636V6.711A2.733 2.733 0 0 0 19.273 4H4.727A2.733 2.733 0 0 0 2 6.711Zm1.915-.39a.915.915 0 0 1 .812-.503h14.546c.352 0 .662.206.812.504L12 11.982l-8.085-5.66Zm16.267 2.152v9.163a.914.914 0 0 1-.91.91H4.728a.914.914 0 0 1-.909-.91V8.473l7.66 5.363a.91.91 0 0 0 1.043 0l7.66-5.363Z"
      fill={props.color}
    />
  </Svg>
);

export default SvgMail;
