import { useContext } from "react";

import { UserContext } from "app/context/user-context";

export const useTokenEarnings = () => {
  const user = useContext(UserContext);
  const earnings = user?.user?.data?.profile?.creator_token?.total_earnings;

  if (earnings) {
    const actualAmount = Number(earnings) / Math.pow(10, 6);
    return actualAmount;
  }

  return 0;
};
