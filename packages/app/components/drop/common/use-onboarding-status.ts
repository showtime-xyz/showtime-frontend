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
  }>("/v1/payments/onboarding/creator/status", fetcher);

  let status = "not_onboarded" as OnboardingStatus;
  let loading = queryState.isLoading || user.isLoading;
  if (loading) {
    status = "loading";
  } else if (queryState.data?.can_charge) {
    status = "onboarded";
  } else if (
    user.user?.data.profile.stripe_connect_details?.details_submitted
  ) {
    status = "processing";
  }

  return { status, reload: queryState.mutate };
};
