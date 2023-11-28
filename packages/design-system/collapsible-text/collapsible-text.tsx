import { useState } from "react";

import { Pressable } from "..";
import { Text } from "../text";

type CollapsibleTextProps = {
  initialNumberOfLines: number;
  children: any;
  tw?: any;
};

export const CollapsibleText = (props: CollapsibleTextProps) => {
  const { initialNumberOfLines, children, tw } = props;
  const [numberOfLines, setNumberOfLines] = useState<undefined | number>(
    initialNumberOfLines
  );

  return (
    <Pressable
      onPress={() => {
        setNumberOfLines(
          typeof numberOfLines === "number" ? undefined : initialNumberOfLines
        );
      }}
    >
      <Text tw={tw} numberOfLines={numberOfLines} style={{ color: "white" }}>
        {children}
      </Text>
    </Pressable>
  );
};
