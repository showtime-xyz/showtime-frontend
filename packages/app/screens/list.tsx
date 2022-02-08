import { useEffect } from "react";
import { useHideHeader } from "app/navigation/use-navigation-elements";
import { mixpanel } from "app/lib/mixpanel";
import { withColorScheme } from "app/components/memo-with-theme";
import { List } from "app/components/list";
import { createParam } from "app/navigation/use-param";

type Query = {
  id: string;
};

const { useParam } = createParam<Query>();

const ListScreen = withColorScheme(() => {
  useHideHeader();
  const [nftId] = useParam("id");
  useEffect(() => {
    mixpanel.track("NFT list view");
  }, []);

  return <List nftId={nftId} />;
});

export { ListScreen };
