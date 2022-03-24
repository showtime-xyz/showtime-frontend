import { useEffect } from "react";

import { withColorScheme } from "app/components/memo-with-theme";
import { Unlist } from "app/components/unlist";
import { useHideHeader } from "app/navigation/use-navigation-elements";
import { createParam } from "app/navigation/use-param";

type Query = {
  id: string;
};

const { useParam } = createParam<Query>();

const UnlistScreen = withColorScheme(() => {
  useHideHeader();
  const [nftId] = useParam("id");

  return <Unlist nftId={nftId} />;
});

export { UnlistScreen };
