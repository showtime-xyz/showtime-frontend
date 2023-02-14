import * as React from "react";

import Svg, { SvgProps, Path } from "react-native-svg";

const SvgEyeOff = (props: SvgProps) => (
  <Svg viewBox="0 0 32 32" width={24} height={24} {...props}>
    <Path
      d="M29.788 15.384C25.896 10.346 21.515 8 16 8c-2.016 0-3.88.317-5.624.962L7.06 5.646a.5.5 0 0 0-.707 0l-.707.707a.5.5 0 0 0 0 .708l2.782 2.782c-2.244 1.216-4.29 3.048-6.217 5.541a1.02 1.02 0 0 0 0 1.232C6.105 21.654 10.486 24 16 24c2.016 0 3.88-.317 5.624-.962l3.315 3.315a.5.5 0 0 0 .707 0l.707-.707a.5.5 0 0 0 0-.707l-2.782-2.782c2.244-1.217 4.29-3.048 6.217-5.541a1.02 1.02 0 0 0 0-1.232zM16 22c-4.688 0-8.33-1.857-11.723-6 1.772-2.165 3.618-3.69 5.64-4.669l2.65 2.65A3.955 3.955 0 0 0 12 16c0 2.206 1.794 4 4 4 .74 0 1.424-.215 2.02-.567l2.008 2.009c-1.263.36-2.592.558-4.028.558zm1.925-5.489-2.436-2.437c.164-.043.333-.074.511-.074 1.103 0 2 .897 2 2 0 .178-.03.347-.075.511zm-1.414 1.415A1.977 1.977 0 0 1 16 18c-1.103 0-2-.897-2-2 0-.178.03-.347.074-.511l2.437 2.436zm5.572 2.743-2.65-2.65c.352-.595.567-1.28.567-2.019 0-2.206-1.794-4-4-4-.74 0-1.424.215-2.02.567l-2.008-2.009A14.52 14.52 0 0 1 16 10c4.688 0 8.331 1.857 11.723 6-1.772 2.165-3.618 3.69-5.64 4.669z"
      fill={props.color}
    />
  </Svg>
);

export default SvgEyeOff;
