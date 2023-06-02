import { Platform } from "react-native";

import { MMKV } from "react-native-mmkv";

import { withModalScreen } from "@showtime-xyz/universal.modal-screen";
import { useRouter } from "@showtime-xyz/universal.router";

import { DropExplanation } from "app/components/drop/drop-explanation";

const store = new MMKV();
const STORE_KEY = "showExplanationv2";

export const DropExplanationModal = () => {
  const router = useRouter();
  const hideExplanation = () => {
    store.set(STORE_KEY, false);
    if (Platform.OS === "web") {
      router.replace("/drop");
    } else {
      router.pop();
      setTimeout(() => {
        router.push("/drop");
      }, 600);
    }
  };

  return <DropExplanation onDone={hideExplanation} />;
};

export const DropExplanationScreen = withModalScreen(DropExplanationModal, {
  title: "Drop Explanation",
  matchingPathname: "/dropExplanation",
  matchingQueryParam: "dropExplanationModal",
  tw: "w-full lg:w-[800px] web:lg:pb-8",
  snapPoints: ["100%"],
});
