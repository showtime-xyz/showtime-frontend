import { UserList } from "app/components/user-list";
import {
  useFollowingList,
  useFollowersList,
} from "app/hooks/api/use-follow-list";

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
