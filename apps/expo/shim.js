import "react-native-random-values-jsi-helper";

import { Platform } from "react-native";

import "@azure/core-asynciterator-polyfill";
import { Crypto as WebCrypto } from "@peculiar/webcrypto";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { btoa, atob, toByteArray } from "react-native-quick-base64";
import "text-encoding";
import "web-streams-polyfill";

if (!global.localStorage) {
  global.localStorage = AsyncStorage;
}

if (!global.Buffer) {
  global.Buffer = require("@craftzdog/react-native-buffer").Buffer;
}

if (!global.crypto.subtle) {
  // Only polyfill SubtleCrypto, not getRandomValues
  const webCrypto = new WebCrypto();
  global.crypto.subtle = webCrypto.subtle;
}

if (typeof __dirname === "undefined") global.__dirname = "/";
if (typeof __filename === "undefined") global.__filename = "";
if (typeof process === "undefined") {
  global.process = require("process");
} else {
  const bProcess = require("process");
  for (var p in bProcess) {
    if (!(p in process)) {
      process[p] = bProcess[p];
    }
  }
}
process.browser = false;

// global.location = global.location || { port: 80 }
const isDev = typeof __DEV__ === "boolean" && __DEV__;
process.env["NODE_ENV"] = isDev ? "development" : "production";
if (typeof localStorage !== "undefined") {
  localStorage.debug = isDev ? "*" : "";
}

if (Platform.OS !== "web") {
  global.atob = atob;
  global.btoa = btoa;
  FileReader.prototype.readAsArrayBuffer = function (blob) {
    if (this.readyState === this.LOADING) {
      throw new Error("InvalidStateError");
    }
    this._setReadyState(this.LOADING);
    this._result = null;
    this._error = null;
    var fr = new FileReader();
    fr.onloadend = () => {
      this._result = toByteArray(fr.result.split(",").pop().trim());
      this._setReadyState(this.DONE);
    };
    fr.readAsDataURL(blob);
  };
}
