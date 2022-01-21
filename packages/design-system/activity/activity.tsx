import { formatDistanceToNowStrict } from "date-fns";

import { ACTIVITY_TYPES, DEFAULT_PROFILE_PIC } from "app/lib/constants";
import { View } from "design-system/view";
import { Text } from "design-system/text";
import { Avatar } from "design-system/activity/avatar";
import {
  Like,
  Comment,
  Sell,
  Buy,
  Create,
  Follow,
  Transfer,
} from "design-system/activity/types";
import { Pressable } from "design-system/pressable-scale";
import { useProfileNavigation } from "app/navigation/app-navigation";
import { ActivityDropdown } from "design-system/activity/activity-dropdown";

const getProfileImageUrl = (imgUrl: string) => {
  if (imgUrl && imgUrl.includes("https://lh3.googleusercontent.com")) {
    imgUrl = imgUrl.split("=")[0] + "=s112";
  }
  return imgUrl;
};

type Props = {
  activity: any;
};

const hitSlop = { top: 10, bottom: 10, left: 10, right: 10 };

function Activity({ activity }: Props) {
  const { type, actor } = activity;
  const openProfile = useProfileNavigation(actor.wallet_address);

  return (
    <View tw="p-4">
      <View tw="h-12 flex-row justify-between">
        <Pressable onPress={openProfile}>
          <Avatar
            url={getProfileImageUrl(actor.img_url ?? DEFAULT_PROFILE_PIC)}
            icon={type}
          />
        </Pressable>

        <View tw="items-start justify-center ml-2 w-[69vw]">
          <Text
            variant="text-sm"
            tw="text-gray-600 dark:text-gray-400 max-w-[69vw]"
            numberOfLines={2}
            ellipsizeMode="tail"
          >
            <Pressable onPress={openProfile} hitSlop={hitSlop}>
              <Text variant="text-sm" tw="text-black dark:text-white font-bold">
                @{actor.username}{" "}
              </Text>
            </Pressable>

            {type === ACTIVITY_TYPES.LIKE && <Like act={activity} />}

            {type === ACTIVITY_TYPES.COMMENT && <Comment act={activity} />}

            {type === ACTIVITY_TYPES.SELL && <Sell act={activity} />}

            {type === ACTIVITY_TYPES.BUY && <Buy act={activity} />}

            {type === ACTIVITY_TYPES.CREATE && <Create act={activity} />}

            {type === ACTIVITY_TYPES.FOLLOW && <Follow act={activity} />}

            {type === ACTIVITY_TYPES.SEND && <></>}

            {type === ACTIVITY_TYPES.RECEIVE && <Transfer act={activity} />}
          </Text>

          <View tw="h-2" />

          <Text variant="text-xs" tw="text-gray-600 dark:text-gray-400">
            {formatDistanceToNowStrict(new Date(`${activity.timestamp}Z`), {
              addSuffix: true,
            })}
          </Text>
        </View>

        <View tw="justify-center">
          <ActivityDropdown activity={activity} />
        </View>
      </View>
    </View>
  );
}

export { Activity };
