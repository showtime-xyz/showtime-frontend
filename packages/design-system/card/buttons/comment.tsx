import { useContext } from "react";

import { AppContext } from "app/context/app-context";
import { mixpanel } from "app/lib/mixpanel";
import { useUser } from "app/hooks/use-user";
import { View, Text, Pressable } from "design-system";
import { Message, MessageFilled } from "design-system/icon";
import { useRouter } from "app/navigation/use-router";

const CommentButton = ({ item, handleComment }) => {
  const { isAuthenticated } = useUser();
  const context = useContext(AppContext);
  const comment_count =
    (context.myCommentCounts && context.myCommentCounts[item?.nft_id]) ||
    item.comment_count;
  const commented = context.myComments?.includes(item.nft_id);
  const router = useRouter();

  const handleLoggedOutComment = () => {
    mixpanel.track("Commented but logged out");
    router.push("/login");
  };

  return (
    <Pressable
      tw="focus:outline-none hover:bg-blue-50 dark:hover:bg-blue-900 focus:bg-blue-50 dark:focus:bg-blue-900 px-2 -mx-2 rounded-xl group"
      disabled={context.disableComments}
      onPress={isAuthenticated ? handleComment : handleLoggedOutComment}
    >
      <View tw={`flex-row items-center rounded-lg py-1`}>
        <View>
          {commented ? (
            <MessageFilled tw="w-5 h-5" />
          ) : (
            <Message tw="w-5 h-5" />
          )}
        </View>
        <Text
          tw={`ml-1 whitespace-nowrap dark:text-gray-300 ${
            commented
              ? "text-blue-500 dark:text-blue-600"
              : "group-hover:text-blue-400 dark:group-hover:text-blue-400"
          } ${
            context.disableComments ? "hover:text-gray-500 text-gray-500" : ""
          }`}
        >
          {comment_count}
        </Text>
      </View>
    </Pressable>
  );
};

export { CommentButton };
