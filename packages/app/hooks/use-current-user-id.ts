import { useUser } from "app/hooks/use-user";

function useCurrentUserId() {
  const { user } = useUser();
  const userId = user?.data?.profile?.profile_id;

  return userId;
}

export { useCurrentUserId };
