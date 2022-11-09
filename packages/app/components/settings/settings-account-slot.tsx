import { useState, useRef } from "react";

import { Button } from "@showtime-xyz/universal.button";
import { Fieldset } from "@showtime-xyz/universal.fieldset";
import { useIsDarkMode } from "@showtime-xyz/universal.hooks";
import { ChevronRight } from "@showtime-xyz/universal.icon";
import { ModalSheet } from "@showtime-xyz/universal.modal-sheet";
import { Pressable } from "@showtime-xyz/universal.pressable";
import { useRouter } from "@showtime-xyz/universal.router";
import { colors } from "@showtime-xyz/universal.tailwind";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import { useAuth } from "app/hooks/auth/use-auth";
import { useDeleteUser } from "app/hooks/use-delete-user";
import { useUser } from "app/hooks/use-user";
import { Logger } from "app/lib/logger";

import { ClearCacheBtn } from "./clear-cache-btn";
import { SettingSubTitle } from "./settings-subtitle";

export const SettingAccountSlotHeader = () => {
  return (
    <View>
      <SettingSubTitle>
        <Text tw="text-xl font-bold text-gray-900 dark:text-white">
          Account
        </Text>
      </SettingSubTitle>
    </View>
  );
};

export const SettingAccountSlotFooter = () => {
  const { deleteUser } = useDeleteUser();
  const user = useUser();
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const username = useRef("");
  const [error, setError] = useState("");
  const { logout } = useAuth();

  const handleDeleteConfirm = async () => {
    if (username.current !== user.user?.data.profile.username) {
      setError("Username does not match");
      return;
    }

    try {
      await deleteUser();
      logout();
    } catch (e) {
      Logger.error(e);
      setError("Error deleting account");
    }
  };
  return (
    <View tw="mt-4 px-4">
      <View tw="flex flex-col items-start">
        <Text tw="text-base font-bold text-gray-900 dark:text-white">
          Delete Account
        </Text>
        <View tw="h-4" />
        <Text tw="text-xs text-gray-500 dark:text-white md:text-sm">
          This action cannot be undone.
        </Text>
        <View tw="h-4" />
        <View tw="flex flex-row">
          <Button
            variant="danger"
            size="small"
            onPress={() => {
              setShowDeleteConfirmation(true);
              setError("");
            }}
          >
            <Text>Delete Account</Text>
          </Button>
        </View>
        <View tw="h-4" />
        <ClearCacheBtn />
      </View>
      <ModalSheet
        title="Delete Account?"
        visible={showDeleteConfirmation}
        close={() => setShowDeleteConfirmation(false)}
        onClose={() => setShowDeleteConfirmation(false)}
      >
        <View>
          <View tw="mb-4">
            <Text tw="text-base text-gray-900 dark:text-gray-100">
              Are you sure you want to delete your account? This action cannot
              be undone
            </Text>
            <Text tw="py-4 text-base text-gray-900 dark:text-gray-100">
              Please type{" "}
              <Text tw="font-bold">{user.user?.data.profile.username}</Text> to
              confirm.
            </Text>
          </View>
          <Fieldset
            onChangeText={(t) => (username.current = t)}
            placeholder="Enter your username"
            label="Username"
            errorText={error}
          />
          <View tw="mt-8 flex-row">
            <Button
              tw="mb-4 mr-2"
              onPress={() => setShowDeleteConfirmation(false)}
            >
              Cancel
            </Button>
            <Button variant="danger" onPress={handleDeleteConfirm}>
              Confirm Delete
            </Button>
          </View>
        </View>
      </ModalSheet>
    </View>
  );
};

export type AccountSettingItemProps = {
  id: number | string;
  title: string;
  subRoute: string;
};

export const AccountSettingItem = (props: AccountSettingItemProps) => {
  const isDark = useIsDarkMode();
  const router = useRouter();
  const handleOnPressItem = (route: string) => {
    router.push(`/settings/${route}`);
  };

  return (
    <Pressable
      onPress={() => handleOnPressItem(props.subRoute)}
      tw="mb-2 w-full flex-row items-center justify-between rounded-md px-4 py-2"
    >
      <View tw="flex flex-col">
        <Text tw="text-sm text-gray-900 dark:text-white">{props.title}</Text>
      </View>
      <View tw="h-8 w-8 items-center justify-center">
        <ChevronRight
          width={24}
          height={24}
          color={isDark ? colors.gray[200] : colors.gray[700]}
        />
      </View>
    </Pressable>
  );
};
