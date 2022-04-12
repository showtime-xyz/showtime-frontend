import { ArrowRight, Basket, Globe, Tag } from "design-system/icon";

export const getNftActivityEventIcon = (event: string) => {
  switch (event) {
    case "Created":
      return null;
    case "Sale":
      return <Basket width={16} height={16} fill="#A1A1AA" />;
    case "Transfer":
      return <ArrowRight width={16} height={16} fill="#A1A1AA" />;
    case "List":
      return <Tag width={16} height={16} fill="#A1A1AA" />;
    case "Minted":
      return <Globe width={16} height={16} fill="#A1A1AA" />;
    default:
      return null;
  }
};
