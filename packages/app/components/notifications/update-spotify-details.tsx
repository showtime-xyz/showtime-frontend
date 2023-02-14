import { NotificationNFT } from "app/hooks/use-notifications";
import { Link } from "app/navigation/link";

type NotificationDescriptionProps = {
  nfts: NotificationNFT[];
  children: React.ReactNode;
};

export const UpdateSpotifyDetails = ({
  nfts,
  children,
}: NotificationDescriptionProps) => {
  if (!nfts || nfts?.length === 0) return null;

  const nft = nfts[0];

  return (
    <Link href={"/drop/update/" + nft.contract_address} tw={"flex-1"}>
      {children}
    </Link>
  );
};
