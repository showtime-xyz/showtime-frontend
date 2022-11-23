import { Button } from "@showtime-xyz/universal.button";
import { View } from "@showtime-xyz/universal.view";

import { createAccount, sendGM } from "app/lib/xmtp";

function InboxScreen() {
  const account = createAccount();

  console.log(account);

  return (
    <View tw="mt-20">
      <Button onPress={() => sendGM(account)}>Send GM</Button>
    </View>
  );
}

export { InboxScreen };
