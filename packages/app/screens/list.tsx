import { useEffect } from "react";

import { List } from "app/components/list";
import { withColorScheme } from "app/components/memo-with-theme";
import { mixpanel } from "app/lib/mixpanel";
import { useHideHeader } from "app/navigation/use-navigation-elements";
import { createParam } from "app/navigation/use-param";
import { withModalScreen } from "app/navigation/with-modal-screen";

type Query = {
  id: string;
};

const { useParam } = createParam<Query>();

const ListModal = withColorScheme(() => {
  useHideHeader();
  const [nftId] = useParam("id");
  useEffect(() => {
    mixpanel.track("NFT list view");
  }, []);

  return <List nftId={nftId} />;
});

export const ListScreen = withModalScreen(ListModal, "/nft/[id]/list", "list");
