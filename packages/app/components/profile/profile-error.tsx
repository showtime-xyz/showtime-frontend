import { Platform, Linking } from "react-native";

import * as Clipboard from "expo-clipboard";

import { Alert } from "@showtime-xyz/universal.alert";
import { Button, ButtonProps } from "@showtime-xyz/universal.button";
import { useRouter } from "@showtime-xyz/universal.router";
import { Text } from "@showtime-xyz/universal.text";

import { Link, TextLink } from "app/navigation/link";

import { Pressable, View } from "design-system";

import { EmptyPlaceholder } from "../empty-placeholder";

const ContactBtn = (props: ButtonProps) => {
  return (
    <Button variant="tertiary" {...props}>
      Contact support
    </Button>
  );
};
const Profile404 = () => {
  const router = useRouter();
  return (
    <View tw="items-center justify-center px-4 pt-8">
      <EmptyPlaceholder
        title="This user does not exist."
        text={
          <Pressable
            onPress={() => (router.canGoBack() ? router.back() : router.pop())}
            tw="items-center justify-center text-center"
          >
            <Text tw="text-center text-base">
              Try searching for another one or check the link.&nbsp;{"\n"}
            </Text>
            <View tw="web:mt-6 mt-2">
              <Text tw="text-base font-semibold text-indigo-500">
                {router.canGoBack() ? "Go back" : "Go Home"}
              </Text>
            </View>
          </Pressable>
        }
        hideLoginBtn
      />
    </View>
  );
};
const Profile403 = () => {
  return (
    <View tw="items-center justify-center px-4 pt-8">
      <View tw="max-w-sm text-center">
        <EmptyPlaceholder
          title="Restricted"
          text={
            <Text tw="text-center">
              This profile has been suspended for violating our&nbsp;
              <TextLink
                tw="text-indigo-500"
                href="https://www.notion.so/showtime-xyz/Legal-Public-c407e36eb7cd414ca190245ca8621e68"
                target="_blank"
              >
                Terms of Service
              </TextLink>
              . If you think that was a mistake, please let us know.
            </Text>
          }
          hideLoginBtn
        />
      </View>
      <View tw="mt-6 w-full max-w-xs flex-row justify-between px-4">
        <Link href="/">
          <Button disabled={Platform.OS !== "web"}>Take me home</Button>
        </Link>
        {Platform.OS === "web" ? (
          <Link href="mailto:help@showtime.xyz">
            <ContactBtn />
          </Link>
        ) : (
          <ContactBtn
            onPress={async () => {
              const isCanOpen = await Linking.canOpenURL(
                "mailto:help@showtime.xyz"
              );
              if (isCanOpen) {
                await Linking.openURL("mailto:help@showtime.xyz");
              } else {
                await Clipboard.setStringAsync("help@showtime.xyz");
                Alert.alert(
                  "The email address has been copied to your clipboard!"
                );
              }
            }}
          />
        )}
      </View>
    </View>
  );
};

export const ProfileError = ({
  error,
  isBlocked,
  username,
}: {
  error: any;
  isBlocked: boolean;
  username: string;
}) => {
  if (error?.response?.status === 403) {
    return <Profile403 />;
  }
  if (error?.response?.status === 400) {
    return <Profile404 />;
  }
  return (
    <EmptyPlaceholder
      title={
        isBlocked ? (
          <Text tw="text-gray-900 dark:text-white">
            <Text tw="font-bold">@{username}</Text> is blocked
          </Text>
        ) : (
          error?.message
        )
      }
      tw="h-[50vh]"
      hideLoginBtn
    />
  );
};
