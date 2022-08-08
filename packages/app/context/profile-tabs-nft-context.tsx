import { createContext, useContext } from "react";

type ProfileTabsNFTContextType = { tabType?: string };

const ProfileTabsNFTContext = createContext({
  tabType: undefined,
} as ProfileTabsNFTContextType);

export const ProfileTabsNFTProvider = ({
  children,
  tabType,
}: ProfileTabsNFTContextType & { children: any }) => {
  return (
    <ProfileTabsNFTContext.Provider value={{ tabType }}>
      {children}
    </ProfileTabsNFTContext.Provider>
  );
};

export const useProfileTabType = () => {
  return useContext(ProfileTabsNFTContext).tabType;
};
