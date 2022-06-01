import {
  ArrowRight,
  Basket,
  Globe,
  Tag,
  PolygonScan,
} from "@showtime-xyz/universal.icon";

import { BLOCKCHAIN_TYPES, EVENT_TYPES } from "./nft-activity.constants";

type EventIconHelperProps = {
  event: string;
  color: string;
};

type BlockchainIconHelperProps = {
  blockchain: string;
  color: string;
};

export const getNftActivityEventIcon = ({
  event,
  color,
}: EventIconHelperProps) => {
  const iconProps = {
    width: 16,
    height: 16,
    color,
  };

  switch (event) {
    case EVENT_TYPES.CREATED:
      return <Globe {...iconProps} />;
    case EVENT_TYPES.SALE:
      return <Basket {...iconProps} />;
    case EVENT_TYPES.TRANSFER:
      return <ArrowRight {...iconProps} />;
    case EVENT_TYPES.LIST:
      return <Tag {...iconProps} />;
    case EVENT_TYPES.MINTED:
      return <Globe {...iconProps} />;
    default:
      return null;
  }
};

export const getNftBlockchainIcon = ({
  blockchain,
  color,
}: BlockchainIconHelperProps) => {
  const iconProps = {
    width: 16,
    height: 16,
    color,
  };

  switch (blockchain) {
    case BLOCKCHAIN_TYPES.POLYGONSCAN:
      return <PolygonScan {...iconProps} />;
    default:
      return null;
  }
};
