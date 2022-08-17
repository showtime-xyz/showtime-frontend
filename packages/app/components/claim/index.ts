import { CreatorEditionResponse } from "app/hooks/use-creator-collection-detail";

export { Claim } from "./claim";

export enum ClaimStatus {
  Soldout,
  Claimed,
  Expired,
  Normal,
}
export const getClaimStatus = (edition: CreatorEditionResponse) => {
  if (!edition) return undefined;
  if (
    edition.total_claimed_count ===
    edition.creator_airdrop_edition?.edition_size
  )
    return ClaimStatus.Soldout;

  if (edition.is_already_claimed) return ClaimStatus.Claimed;

  return typeof edition?.time_limit === "string" &&
    new Date() > new Date(edition.time_limit)
    ? ClaimStatus.Expired
    : ClaimStatus.Normal;
};

// Format claim big numbers
export function formatClaimNumber(number: number) {
  if (!number) return 0;
  // for the edge case of 100k, our max supply, put “100k”, no decimals
  if (number >= 100000) {
    return `100k`;
  } else if (number > 1000) {
    return `${(number / 1000).toFixed(1)}k`;
  } else {
    return number;
  }
}
