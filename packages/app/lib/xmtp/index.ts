import { Platform } from "react-native";

import { utils as SecpUtils } from "@noble/secp256k1";
import { Client } from "@xmtp/xmtp-js";
import { Wallet } from "ethers";

function createAccount() {
  const account = new Wallet(SecpUtils.randomPrivateKey());

  return account;
}

async function sendGM(account: Wallet) {
  console.log("creating xmtp client");

  try {
    const xmtp = await Client.create(account);
    const conversation = await xmtp.conversations.newConversation(
      // "axeldelafosse.eth"
      "0xAee2B2414f6ddd7E19697de40d828CBCDdAbf27F"
    );
    const message = await conversation.send(`gm from ${Platform.OS}!`);
    console.log("sent message: " + message.content);
  } catch (error) {
    console.log(`error creating client: ${error}`);
  }
}

export { createAccount, sendGM };
