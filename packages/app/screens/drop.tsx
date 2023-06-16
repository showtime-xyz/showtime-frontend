import { withModalScreen } from "@showtime-xyz/universal.modal-screen";

import { CreateDropSteps } from "app/components/drop/create-drop-steps/create-drop-steps";

const DropModal = () => {
  return <CreateDropSteps />;
};

export const DropScreen = withModalScreen(DropModal, {
  title: "Create",
  matchingPathname: "/drop",
  matchingQueryParam: "dropModal",
  tw: "w-full web:lg:pb-8",
  snapPoints: [400, "100%"],
  useNativeModal: false,
  headerShown: false,
});
