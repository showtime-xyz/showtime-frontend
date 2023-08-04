import { CreatorEditionResponse } from "app/hooks/use-creator-collection-detail";

export enum ClaimStatus {
  Soldout,
  Claimed,
  Expired,
  Normal,
}
export const getClaimStatus = (edition?: CreatorEditionResponse) => {
  if (!edition) return undefined;
  if (
    edition.creator_airdrop_edition?.edition_size !== 0 &&
    edition.total_claimed_count >= edition.creator_airdrop_edition?.edition_size
  )
    return ClaimStatus.Soldout;

  if (edition.is_already_claimed) return ClaimStatus.Claimed;

  return typeof edition?.time_limit === "string" &&
    new Date() > new Date(edition.time_limit)
    ? ClaimStatus.Expired
    : ClaimStatus.Normal;
};
