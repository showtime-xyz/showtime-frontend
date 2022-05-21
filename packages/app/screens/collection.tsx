import { ClaimButton } from "app/components/claim-button";
import { useCreatorCollectionDetail } from "app/hooks/use-creator-collection-detail";
import { createParam } from "app/navigation/use-param";

import { Button, Spinner } from "design-system";

const { useParam } = createParam<{ collectionAddress: string }>();

export const CollectionScreen = () => {
  const [collectionAddress] = useParam("collectionAddress");
  const { data, loading, error, mutate } =
    useCreatorCollectionDetail(collectionAddress);
  console.log("hey there ", data, loading, error);

  if (error) {
    return (
      <Button onPress={mutate}>Something went wrong. Please Try again</Button>
    );
  }

  if (loading) {
    return <Spinner />;
  }

  if (data) {
    return <ClaimButton edition={data} />;
  }

  return null;
};
