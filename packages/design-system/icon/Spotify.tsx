import * as React from "react";

import Svg, { Path, SvgProps } from "react-native-svg";

function Spotify(props: SvgProps) {
  return (
    <Svg width={14} height={15} viewBox="0 0 14 15" fill="none" {...props}>
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M11.14 6.705c-2.256-1.34-5.978-1.463-8.132-.809a.654.654 0 11-.38-1.253c2.473-.75 6.583-.605 9.181.937a.655.655 0 01-.668 1.125zm-.073 1.986a.547.547 0 01-.75.18c-1.882-1.157-4.75-1.492-6.976-.817a.546.546 0 11-.317-1.044c2.542-.771 5.703-.398 7.863.93a.546.546 0 01.18.75zm-.857 1.905a.435.435 0 01-.6.146c-1.643-1.005-3.712-1.232-6.15-.675a.436.436 0 01-.193-.85c2.666-.61 4.953-.348 6.798.78.206.125.271.394.145.6zM7 .5a7 7 0 100 14 7 7 0 000-14z"
        fill={props.color}
      />
    </Svg>
  );
}

export default Spotify;
