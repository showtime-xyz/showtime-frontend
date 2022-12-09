// import { useState, useCallback } from "react";

// import { Meta } from "@storybook/react";

// import { SegmentedControl } from "./index";

// export default {
//   component: SegmentedControl,
//   title: "Components/SegmentedControl",
// } as Meta;

// export const Primary: React.VFC<{}> = () => {
//   const [selected, setSelected] = useState(0);

//   const handleTabChange = useCallback(
//     (index: number) => {
//       setSelected(index);
//     },
//     [setSelected]
//   );

//   return (
//     <SegmentedControl
//       values={["LABEL 1", "LABEL 2", "LABEL 3"]}
//       onChange={handleTabChange}
//       selectedIndex={selected}
//     />
//   );
// };
