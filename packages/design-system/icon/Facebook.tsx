import * as React from "react";

import Svg, { SvgProps, Path, Defs } from "react-native-svg";

const SvgFacebook = (props: SvgProps) => (
  <Svg width={24} height={24} viewBox="0 0 48 48" fill="none" {...props}>
    <Path
      d="M48 24C48 10.745 37.255 0 24 0S0 10.745 0 24c0 11.979 8.776 21.908 20.25 23.708v-16.77h-6.094V24h6.094v-5.288c0-6.014 3.583-9.337 9.065-9.337 2.625 0 5.372.469 5.372.469v5.906h-3.026c-2.981 0-3.911 1.85-3.911 3.75V24h6.656l-1.064 6.938H27.75v16.77C39.224 45.908 48 35.978 48 24Z"
      fill={props.color}
    />
    <Defs>
      <Path fill={props.color} d="M0 0h48v48H0z" />
    </Defs>
  </Svg>
);

export default SvgFacebook;
