import { ClaimButton } from "app/components/claim-button";
import { createParam } from "app/navigation/use-param";

type Query = {
  contractAddress: string;
};

const { useParam } = createParam<Query>();

export const Claim = () => {
  const [contractAddress] = useParam("contractAddress");

  //@ts-ignore
  return <ClaimButton edition={{ minter_address: contractAddress }} />;
};
