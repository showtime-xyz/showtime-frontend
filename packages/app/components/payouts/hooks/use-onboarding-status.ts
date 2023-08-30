import useSWR from "swr";

import { fetcher } from "app/hooks/use-infinite-list-query";
import { useUser } from "app/hooks/use-user";

type OnboardingStatus =
  | "loading"
  | "onboarded"
  | "processing"
  | "not_onboarded";

export const useOnboardingStatus = () => {
  const user = useUser();
  const queryState = useSWR<{
    can_charge: boolean;
    onboarding_details?: any;
  }>("/v1/payments/nft/payouts/onboarding/status", fetcher, {
    revalidateOnFocus: true,
    // Refresh every 5 seconds if mounted
    refreshInterval: 5 * 1000,
  });

  let status = "not_onboarded" as OnboardingStatus;
  let loading = queryState.isLoading || user.isLoading;
  if (loading) {
    status = "loading";
  } else if (queryState.data?.can_charge) {
    status = "onboarded";
  } else if (
    user.user?.data.profile.stripe_connect_details?.details_submitted ||
    user.user?.data.profile.stripe_connect_details?.tos_acceptance ||
    queryState.data?.onboarding_details
  ) {
    status = "processing";
  }

  return { status, reload: queryState.mutate };
};
