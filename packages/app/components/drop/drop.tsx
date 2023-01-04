import { useState } from "react";

import { MMKV } from "react-native-mmkv";

import { DropExplanation } from "./drop-explanation";
import { DropSelect } from "./drop-select";

const store = new MMKV();
const STORE_KEY = "showExplanation";

export const Drop = () => {
  const [showExplanation, setShowExplanation] = useState(
    () => store.getBoolean(STORE_KEY) ?? true
  );

  const hideExplanation = () => {
    setShowExplanation(false);
    store.set(STORE_KEY, false);
  };

  return showExplanation ? (
    <DropExplanation onDone={hideExplanation} />
  ) : (
    <DropSelect />
  );
};
