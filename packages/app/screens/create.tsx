import { withModalScreen } from "@showtime-xyz/universal.modal-screen";

import { Create } from "app/components/create";
import { useTrackPageViewed } from "app/lib/analytics";
import { useHideHeader } from "app/navigation/use-navigation-elements";

const CreateModal = () => {
  //#region hooks
  useTrackPageViewed({ name: "Create" });
  useHideHeader();
  //#endregion

  return <Create />;
};

export const CreateScreen = withModalScreen(CreateModal, {
  title: "Create",
  matchingPathname: "/create",
  matchingQueryParam: "createModal",
  disableBackdropPress: true,
});
