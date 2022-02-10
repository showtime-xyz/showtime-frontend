import { useContext } from "react";

import AppContext from "@/context/app-context";

export default function useProfile() {
  const { myProfile, setMyProfile } = useContext(AppContext);

  return { myProfile, setMyProfile };
}
