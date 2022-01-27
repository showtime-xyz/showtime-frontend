import { createContext } from "react";
import { Profile } from "../types";

type FollowType = {
  profile_id: number;
};

type UserType = {
  data: {
    follows: FollowType[];
    profile: Profile;
    likes_nft: number[];
    likes_comment: number[];
    comments: number[];
  };
};

type UserContextType = {
  user: UserType;
  error: Error;
  isLoading: boolean;
  isAuthenticated: boolean;
};

export const UserContext = createContext<UserContextType | null>(null);
