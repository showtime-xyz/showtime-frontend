import { useMemo } from "react";

import { useCreatorCollectionDetail } from "app/hooks/use-creator-collection-detail";
import { useNFTDetailByTokenId } from "app/hooks/use-nft-detail-by-token-id";
import { getNFTURL } from "app/hooks/use-share-nft";
import { createParam } from "app/navigation/use-param";

import { QRCode } from "./qr-code";

type DownloadQRCodeModalParams = {
  contractAddress?: string | undefined;
};
const { useParam } = createParam<DownloadQRCodeModalParams>();

export const DownloadQRCodeModal = () => {
  const [contractAddress] = useParam("contractAddress");

  const { data: edition } = useCreatorCollectionDetail(contractAddress);

  const { data } = useNFTDetailByTokenId({
    chainName: edition?.chain_name,
    tokenId: "0",
    contractAddress: edition?.creator_airdrop_edition.contract_address,
  });

  const nft = data?.data.item;
  const qrCodeUrl = useMemo(() => {
    if (!nft) return "";
    const url = new URL(getNFTURL(nft));
    if (edition && edition.password) {
      url.searchParams.set("password", edition?.password);
    }
    return url;
  }, [edition, nft]);

  return (
    <QRCode
      value={qrCodeUrl.toString()}
      size={240}
      tw="web:mt-0 -mt-28 flex-1 items-center justify-center"
    />
  );
};
