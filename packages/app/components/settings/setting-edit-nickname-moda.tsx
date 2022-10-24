import { useEffect, useState, useRef } from "react";

import { Button } from "@showtime-xyz/universal.button";
import { Fieldset } from "@showtime-xyz/universal.fieldset";
import { Modal } from "@showtime-xyz/universal.modal";
import { View } from "@showtime-xyz/universal.view";

import { useAddWalletNickname } from "app/hooks/api/use-add-wallet-nickname";
import { WalletAddressesV2 } from "app/types";

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
    if (editingWallet?.nickname && !initialValueSet.current) {
      setNickname(editingWallet?.nickname);
      initialValueSet.current = true;
    }
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
