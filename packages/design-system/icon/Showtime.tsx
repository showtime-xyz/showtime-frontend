import * as React from "react";

import Svg, { SvgProps, Path } from "react-native-svg";

const SvgShowtime = (props: SvgProps) => (
  <Svg width={24} height={24} viewBox="0 0 80 80" fill="none" {...props}>
    <Path
      d="M75.71 41.838c1.617-.692 1.617-2.984 0-3.676l-10.842-4.647a35 35 0 0 1-18.383-18.383L41.838 4.289c-.692-1.616-2.984-1.616-3.676 0l-4.647 10.843a35 35 0 0 1-18.383 18.383L4.289 38.162c-1.616.692-1.616 2.984 0 3.676l10.843 4.647a35 35 0 0 1 18.383 18.383l4.647 10.843c.692 1.616 2.984 1.616 3.676 0l4.647-10.843a35 35 0 0 1 18.383-18.383l10.843-4.647Z"
      fill={props.color}
    />
  </Svg>
);

export default SvgShowtime;
