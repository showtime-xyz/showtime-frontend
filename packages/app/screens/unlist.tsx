import { withColorScheme } from "app/components/memo-with-theme";
import { Unlist } from "app/components/unlist";
import { useHideHeader } from "app/navigation/use-navigation-elements";
import { createParam } from "app/navigation/use-param";
import { withModalScreen } from "app/navigation/with-modal-screen";

type Query = {
  id: string;
};

const { useParam } = createParam<Query>();

const UnlistModal = withColorScheme(() => {
  useHideHeader();
  const [nftId] = useParam("id");

  return <Unlist nftId={nftId} />;
});

export const UnlistScreen = withModalScreen(
  UnlistModal,
  "/nft/[id]/unlist",
  "unlist"
);
