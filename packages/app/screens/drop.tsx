import { withModalScreen } from "@showtime-xyz/universal.modal-screen";

import { Drop } from "app/components/drop";

const DropModal = () => {
  return <Drop />;
};

export const DropScreen = withModalScreen(DropModal, {
  title: "Choose your drop type",
  matchingPathname: "/drop",
  matchingQueryParam: "dropModal",
  tw: "w-full lg:w-[800px] web:lg:pb-8",
  snapPoints: [450],
  useNativeModal: false,
});
