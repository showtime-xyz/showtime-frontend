import { formatDistanceToNowStrict } from "date-fns";

import { ACTIVITY_TYPES, DEFAULT_PROFILE_PIC } from "app/lib/constants";
import { formatAddressShort } from "app/lib/utilities";
import { Link, TextLink } from "app/navigation/link";

import { ActivityDropdown } from "design-system/activity/activity-dropdown";
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
import { Text } from "design-system/text";
import { View } from "design-system/view";

const getProfileImageUrl = (imgUrl: string) => {
  if (imgUrl && imgUrl.includes("https://lh3.googleusercontent.com")) {
    imgUrl = imgUrl.split("=")[0] + "=s112";
  }
  return imgUrl;
};

type Props = {
  activity: any;
};

function Activity({ activity }: Props) {
  const { type, actor } = activity;

  return (
    <View tw="px-4 py-2">
      <View tw="flex-row justify-between">
        <Link href={`/profile/${actor.wallet_address}`}>
          <Avatar
            url={getProfileImageUrl(actor.img_url ?? DEFAULT_PROFILE_PIC)}
            icon={type}
          />
        </Link>

        <View tw="items-start justify-center ml-2 w-[69vw]">
          <Text
            variant="text-sm"
            tw="text-gray-600 dark:text-gray-400 max-w-[69vw]"
            numberOfLines={2}
            ellipsizeMode="tail"
          >
            <TextLink
              href={`/profile/${actor.wallet_address}`}
              variant="text-sm"
              tw="text-black dark:text-white font-bold"
            >
              {actor.username ? (
                <>@{actor.username}</>
              ) : (
                <>{formatAddressShort(actor.wallet_address)}</>
              )}{" "}
            </TextLink>

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
