export type Activity = {
  event_type: "Created" | "Sale" | "Transfer" | "List" | "Minted";
  from_address: string | null;
  from_img_url: string | null;
  from_name: string | null;
  from_profile_id: number | null;
  from_username: string | null;
  from_verified: number | null;
  quantity: number;
  timestamp: string;
  to_address: string | null;
  to_img_url: string | null;
  to_name: string | null;
  to_profile_id: number | null;
  to_username: string | null;
  to_verified: number | null;
  token_transfer_id: number;
};

export type TableProps = {
  data?: Array<Activity>;
};

export type TableRowProps = Activity;

export type UserItemProps = {
  imageUrl: string | null;
  verified: number | null;
  username?: string | null;
  userAddress?: string | null;
};
