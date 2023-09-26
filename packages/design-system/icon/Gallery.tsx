import * as React from "react";

import Svg, { SvgProps, Path } from "react-native-svg";

const SvgGallery = (props: SvgProps) => (
  <Svg width={24} height={24} fill="none" viewBox="0 0 17 16" {...props}>
    <Path
      stroke={props.color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.074}
      d="M6.41 15.31h4.297c3.582 0 5.014-1.432 5.014-5.013V5.999c0-3.58-1.432-5.013-5.014-5.013H6.41c-3.581 0-5.014 1.432-5.014 5.013v4.298c0 3.581 1.433 5.013 5.014 5.013Z"
    />
    <Path
      fill={props.color}
      stroke={props.color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.074}
      d="M6.411 6.716a1.432 1.432 0 1 0 0-2.865 1.432 1.432 0 0 0 0 2.865Z"
    />
    <Path
      stroke={props.color}
      d="m1.941 13.147 3.543-2.743a1 1 0 0 1 1.27.037l.94.82a1 1 0 0 0 1.337-.02l3.286-3.043a1 1 0 0 1 1.383.023l2.015 1.995"
    />
    <Path
      fill={props.color}
      d="m6.018 10.159-3.87 3.352 2.102 1.608h9.002l2.284-2.231-.13-3.317-2.473-1.765-4.195 3.888-2.72-1.535Z"
    />
  </Svg>
);
export default SvgGallery;
