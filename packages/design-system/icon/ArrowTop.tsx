import * as React from "react";

import Svg, { SvgProps, Path } from "react-native-svg";

const SvgArrowBotton = (props: SvgProps) => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M18.2929 12.7071C18.6834 13.0976 19.3166 13.0976 19.7071 12.7071C20.0976 12.3166 20.0976 11.6834 19.7071 11.2929L12.7071 4.29289C12.3166 3.90237 11.6834 3.90237 11.2929 4.29289L4.29289 11.2929C3.90237 11.6834 3.90237 12.3166 4.29289 12.7071C4.68342 13.0976 5.31658 13.0976 5.70711 12.7071L11 7.41421L11 19C11 19.5523 11.4477 20 12 20C12.5523 20 13 19.5523 13 19L13 7.41421L18.2929 12.7071Z"
      fill={props.color}
    />
  </Svg>
);

export default SvgArrowBotton;
