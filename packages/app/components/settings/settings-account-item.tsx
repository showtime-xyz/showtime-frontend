import { useState, useRef } from "react";

import { SvgProps } from "react-native-svg";

import { Button, ButtonProps } from "@showtime-xyz/universal.button";
import { Fieldset } from "@showtime-xyz/universal.fieldset";
import { Trash } from "@showtime-xyz/universal.icon";
import { ModalSheet } from "@showtime-xyz/universal.modal-sheet";
import { colors } from "@showtime-xyz/universal.tailwind";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import { useAuth } from "app/hooks/auth/use-auth";
import { useDeleteUser } from "app/hooks/use-delete-user";
import { useUser } from "app/hooks/use-user";
import { Logger } from "app/lib/logger";

export const SettingDeleteAccount = () => {
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
    <View>
      <AccountSettingItem
        title="Delete account"
        subTitle="This action cannot be undone."
        onPress={() => {
          setShowDeleteConfirmation(true);
          setError("");
        }}
        buttonText="Delete Account"
        Icon={Trash}
        buttonProps={{
          variant: "danger",
        }}
      />

      <ModalSheet
        title="Delete Account?"
        visible={showDeleteConfirmation}
        close={() => setShowDeleteConfirmation(false)}
        onClose={() => setShowDeleteConfirmation(false)}
      >
        <View tw="p-4">
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
          <View tw="mt-8 flex-row justify-between">
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
  title: string;
  subTitle?: string;
  Icon?: (props: SvgProps) => JSX.Element;
  onPress?: () => void;
  buttonText: string;
  buttonProps?: ButtonProps;
};

export const AccountSettingItem = ({
  title,
  subTitle,
  onPress,
  Icon,
  buttonText,
  buttonProps = {},
}: AccountSettingItemProps) => {
  return (
    <View tw="flex-row items-center justify-between py-2.5 ">
      {Icon && (
        <View
          tw={[
            "h-5 w-5 items-center justify-center rounded-full bg-gray-200",
            subTitle ? "self-start" : "",
          ]}
        >
          <Icon color={colors.black} width={14} height={14} />
        </View>
      )}
      <View tw="flex-1 flex-row items-center justify-between">
        <View>
          <Text tw="ml-2.5 text-base font-medium text-gray-900 dark:text-white">
            {title}
          </Text>
          {Boolean(subTitle) && (
            <>
              <View tw="h-2" />
              <Text tw="ml-2.5 text-xs italic text-gray-900 dark:text-white">
                {subTitle}
              </Text>
            </>
          )}
        </View>
        <Button variant="tertiary" onPress={onPress} {...buttonProps}>
          {buttonText}
        </Button>
      </View>
    </View>
  );
};
