import create from "zustand";
import { Profile } from "../types";

type GlobalStore = {
  follows: Array<{ profile_id: number }>;
  profile: Profile | null;
  likes_nft: number[];
  likes_comment: any[];
  comments: number[];

  addFollow: (profile_id: number) => void;
};

export const useGlobalStore = create<GlobalStore>((set) => ({
  follows: [],
  profile: null,
  likes_nft: [],
  likes_comment: [],
  comments: [],
  addFollow: (profile_id: number) => {
    set((state) => {
      const { follows } = state;
      const newFollows = [...follows, { profile_id }];
      return { follows: newFollows };
    });
  },
  removeFollow: (profile_id: number) => {
    set((state) => {
      const { follows } = state;
      const newFollows = follows.filter(
        (follow) => follow.profile_id !== profile_id
      );
      return { follows: newFollows };
    });
  },
}));
