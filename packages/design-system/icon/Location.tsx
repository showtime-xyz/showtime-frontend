import * as React from "react";

import Svg, { SvgProps, Path } from "react-native-svg";

const SvgLocation = (props: SvgProps) => (
  <Svg
    data-name="Layer 3"
    viewBox="0 0 24 24"
    width={24}
    height={24}
    {...props}
  >
    <Path d="M12 2a8.009 8.009 0 0 0-8 8c0 3.255 2.363 5.958 4.866 8.819.792.906 1.612 1.843 2.342 2.791a1 1 0 0 0 1.584 0c.73-.948 1.55-1.885 2.342-2.791C17.637 15.958 20 13.255 20 10a8.009 8.009 0 0 0-8-8Zm0 11a3 3 0 1 1 3-3 3 3 0 0 1-3 3Z" />
  </Svg>
);

export default SvgLocation;
