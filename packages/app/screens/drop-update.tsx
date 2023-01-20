import { DropUpdate } from "app/components/drop/drop-update";
import { useCreatorCollectionDetail } from "app/hooks/use-creator-collection-detail";
import { createParam } from "app/navigation/use-param";

type Query = {
  editionContractAddress: string;
};

const { useParam } = createParam<Query>();

export const DropUpdateScreen = () => {
  const [contractAddress] = useParam("editionContractAddress");

  const { data } = useCreatorCollectionDetail(contractAddress);

  return <DropUpdate edition={data} />;
};
