import * as React from "react";

import Svg, { SvgProps, Path } from "react-native-svg";

const SvgFreeDropType = (props: SvgProps) => (
  <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}>
    <Path
      fill={props.color}
      fillRule="evenodd"
      d="M10.65 1.493a3.144 3.144 0 0 0-4.19 4.556H4.658A3.659 3.659 0 0 0 1 9.707v1.117c0 .808.289 1.548.768 2.123V17.9a4.77 4.77 0 0 0 4.77 4.77h10.924a4.77 4.77 0 0 0 4.77-4.77v-4.953c.48-.575.768-1.315.768-2.123V9.707a3.659 3.659 0 0 0-3.659-3.658h-1.8a3.145 3.145 0 0 0-4.191-4.556c-.444.282-.929.75-1.35 1.271-.421-.522-.906-.989-1.35-1.271Zm2.666 3.75c.406-1.25 1.687-2.364 2.3-1.504.65.911-.915 1.616-2.3 1.504Zm-2.754 0c-.406-1.25-1.687-2.364-2.3-1.504-.65.911.915 1.616 2.3 1.504Zm.674 9.573v5.734h1.528v-5.734h7.689v-1.528h-7.689V8.597h-1.528v4.69H3.547v1.529h7.689Z"
      clipRule="evenodd"
    />
  </Svg>
);
export default SvgFreeDropType;
