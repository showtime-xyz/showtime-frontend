import * as React from "react";

import Svg, { SvgProps, Path, Defs } from "react-native-svg";

const SvgGoogleOriginal = (props: SvgProps) => (
  <Svg width={24} height={24} viewBox="0 0 48 48" fill="none" {...props}>
    <Path
      d="M47.532 24.553c0-1.632-.132-3.272-.414-4.877H24.48v9.242h12.963a11.109 11.109 0 0 1-4.797 7.293v5.997h7.734c4.542-4.18 7.152-10.353 7.152-17.655Z"
      fill="#4285F4"
    />
    <Path
      d="M24.48 48.002c6.473 0 11.932-2.126 15.909-5.794l-7.734-5.997c-2.152 1.464-4.93 2.293-8.166 2.293-6.262 0-11.57-4.224-13.475-9.903H3.033v6.181a24.003 24.003 0 0 0 21.447 13.22Z"
      fill="#34A853"
    />
    <Path
      d="M11.005 28.6a14.375 14.375 0 0 1 0-9.189V13.23H3.033a24.02 24.02 0 0 0 0 21.553l7.972-6.182Z"
      fill="#FBBC04"
    />
    <Path
      d="M24.48 9.5a13.042 13.042 0 0 1 9.207 3.597l6.852-6.852A23.066 23.066 0 0 0 24.48.002 23.995 23.995 0 0 0 3.033 13.23l7.972 6.181C12.901 13.724 18.219 9.5 24.48 9.5Z"
      fill="#EA4335"
    />
    <Defs>
      <Path fill={props.color} d="M0 0h48v48H0z" />
    </Defs>
  </Svg>
);

export default SvgGoogleOriginal;
