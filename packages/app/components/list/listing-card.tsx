import { ReactNode } from "react";
import { Platform } from "react-native";
import { View, Text } from "design-system";
import { Modal, ModalSheet } from "design-system";
import { useMemo } from "react";
import { useRouter } from "app/navigation/use-router";
import { useUser } from "app/hooks/use-user";

type Props = {
  nftId?: string;
};

const ListingCard = (props: Props) => {
  const nftId = props.nftId;
  console.log("nftId", nftId);

  return (
    <View tw="flex-1">
      <Text>Lois</Text>
    </View>
  );
};

export { ListingCard };
