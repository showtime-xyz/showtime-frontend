import { withModalScreen } from "@showtime-xyz/universal.modal-screen";

import { Drop } from "app/components/drop";

const DropModal = () => {
  return <Drop />;
};

export const DropScreen = withModalScreen(DropModal, {
  title: "Choose your drop type",
  matchingPathname: "/drop",
  matchingQueryParam: "dropModal",
  tw: "w-full web:lg:pb-8",
  snapPoints: [400],
  useNativeModal: false,
});
