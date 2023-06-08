import * as React from "react";

import Svg, { SvgProps, Path } from "react-native-svg";

const SvgMessagev2 = (props: SvgProps) => (
  <Svg width={24} height={24} viewBox="0 0 27 25" fill="none" {...props}>
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M13.715 21.707h.009c5.997 0 10.382-4.361 10.382-9.176 0-4.814-4.385-9.176-10.382-9.176S3.342 7.717 3.342 12.531c0 1.745.552 3.388 1.538 4.802.492.706.608 1.611.312 2.42l-.393 1.072 2.274-.465a2.572 2.572 0 0 1 1.637.206 11.385 11.385 0 0 0 5.005 1.141Zm.009 2.622a13.958 13.958 0 0 1-6.136-1.4l-4.558.933c-.997.204-1.828-.777-1.475-1.74l1.203-3.279C1.484 17.017.746 14.853.746 12.531.746 6.016 6.557.733 13.724.733c7.166 0 12.978 5.283 12.978 11.798 0 6.516-5.812 11.798-12.978 11.798Z"
      fill={props.color}
    />
  </Svg>
);

export default SvgMessagev2;
