import { useContext } from "react";

import { AppContext } from "app/context/app-context";

function useProfile() {
  // @ts-ignore
  const { myProfile, setMyProfile } = useContext(AppContext);

  return { myProfile, setMyProfile };
}

export { useProfile };
