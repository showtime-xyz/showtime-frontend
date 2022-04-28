import { UserList } from "app/components/user-list";
import { useFollowersList } from "app/hooks/api/use-followers-list";
import { useFollowingList } from "app/hooks/api/use-following-list";

export const FollowersList = (props: {
  profileId?: number;
  hideSheet: () => void;
}) => {
  const { data, loading } = useFollowersList(props.profileId);

  return (
    <UserList loading={loading} users={data?.list} onClose={props.hideSheet} />
  );
};

export const FollowingList = (props: {
  profileId?: number;
  hideSheet: () => void;
}) => {
  const { data, loading } = useFollowingList(props.profileId);

  return (
    <UserList loading={loading} users={data?.list} onClose={props.hideSheet} />
  );
};
