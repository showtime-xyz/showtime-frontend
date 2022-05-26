import React from "react";

import { Collection } from "app/components/collection";
import { useCreatorCollectionDetail } from "app/hooks/use-creator-collection-detail";
import { createParam } from "app/navigation/use-param";

import { Button, Spinner, Text, View } from "design-system";

const { useParam } = createParam<{ collectionAddress: string }>();

const CollectionScreen = () => {
  const [collectionAddress] = useParam("collectionAddress");
  const { data, loading, error, mutate } =
    useCreatorCollectionDetail(collectionAddress);

  if (error) {
    return (
      <Button onPress={mutate}>Something went wrong. Please Try again</Button>
    );
  }

  if (loading) {
    return (
      <View tw="flex-1 items-center justify-center">
        <Spinner />
      </View>
    );
  }

  if (!data) return null;

  return <Collection collection={data} />;
};

export default CollectionScreen;
