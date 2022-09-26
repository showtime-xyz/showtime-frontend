import { useEffect } from "react";

import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import { withColorScheme } from "app/components/memo-with-theme";

const DemoDoubleFire = withColorScheme(() => {
  useEffect(() => {
    console.log("I fire once");
  }, []);

  return (
    <View tw="flex-1" style={{ marginTop: 48, marginLeft: 48 }}>
      <Text style={{ alignContent: "center" }}>Hello!</Text>
    </View>
  );
});

export default DemoDoubleFire;
