import * as React from "react";

import Svg, { SvgProps, Path } from "react-native-svg";

function SvgGlobe(props: SvgProps) {
  return (
    <Svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" {...props}>
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 23c6.075 0 11-4.925 11-11S18.075 1 12 1 1 5.925 1 12s4.925 11 11 11zM9.726 3.29A9.008 9.008 0 003.055 11H7.05a16.3 16.3 0 012.676-7.71zm4.548 0A16.3 16.3 0 0116.95 11h3.995a9.008 9.008 0 00-6.67-7.71zm.668 7.71A14.3 14.3 0 0012 3.55 14.3 14.3 0 009.058 11h5.884zm-5.884 2h5.884A14.3 14.3 0 0112 20.45 14.3 14.3 0 019.058 13zM7.05 13H3.055a9.008 9.008 0 006.67 7.71A16.3 16.3 0 017.05 13zm7.224 7.71A16.3 16.3 0 0016.95 13h3.995a9.008 9.008 0 01-6.67 7.71z"
        fill={props.color}
      />
    </Svg>
  );
}

export default SvgGlobe;
