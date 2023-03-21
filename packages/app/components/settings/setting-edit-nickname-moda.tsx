import { useEffect, useState, useRef } from "react";

import { AvoidSoftInput } from "react-native-avoid-softinput";

import { useAddWalletNickname } from "app/hooks/api/use-add-wallet-nickname";
import { WalletAddressesV2 } from "app/types";

import { Button } from "design-system/button";
import { Fieldset } from "design-system/fieldset";
import { Modal } from "design-system/modal";
import { View } from "design-system/view";

export type EditNicknameModalProps = {
  editingWallet?: WalletAddressesV2;
  onClose: any;
};
export const EditNicknameModal = ({
  editingWallet,
  onClose,
}: EditNicknameModalProps) => {
  const [nickname, setNickname] = useState("");
  const { editWalletNickName } = useAddWalletNickname();
  const initialValueSet = useRef(false);

  useEffect(() => {
    AvoidSoftInput.setEnabled(false);

    if (editingWallet?.nickname && !initialValueSet.current) {
      setNickname(editingWallet?.nickname);
      initialValueSet.current = true;
    }

    return function unmount() {
      AvoidSoftInput.setEnabled(true);
    };
  }, [editingWallet?.nickname]);

  return (
    <Modal tw="bottom-16 md:bottom-0" onClose={onClose} title="Edit Nickname">
      <View tw="p-4">
        <Fieldset
          placeholder="rainbow wallet"
          label="Nickname"
          autoFocus
          value={nickname}
          onChangeText={setNickname}
        />
        <Button
          tw="mt-4"
          onPress={() => {
            if (editingWallet) {
              editWalletNickName(editingWallet?.address, nickname);
              onClose();
            }
          }}
        >
          Submit
        </Button>
      </View>
    </Modal>
  );
};
