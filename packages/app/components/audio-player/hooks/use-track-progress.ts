import { useSnapshot } from "valtio";

import { progressState } from "../store";

export const useTrackProgress = (id: number | string) => {
  const state = useSnapshot(progressState);
  return state.tracks[id.toString()] || 0;
};
