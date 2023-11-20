import { useState, useRef, useEffect } from "react";

import * as Clipboard from "expo-clipboard";
import { AvoidSoftInput } from "react-native-avoid-softinput";

import { Button } from "@showtime-xyz/universal.button";
import { useRouter } from "@showtime-xyz/universal.router";
import { colors } from "@showtime-xyz/universal.tailwind";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import { axios } from "app/lib/axios";

import { toast } from "design-system/toast";

import { OtpInput, OtpInputRef } from "../otp-input";

export const EnterInviteCodeModal = () => {
  const otpRef = useRef<OtpInputRef>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [inviteCode, setInviteCode] = useState("");
  const router = useRouter();

  useEffect(() => {
    AvoidSoftInput.setEnabled(false);

    return () => {
      AvoidSoftInput.setEnabled(true);
    };
  }, []);

  const checkCode = async () => {
    try {
      setIsLoading(true);
      await axios({
        method: "POST",
        url: "/v1/profile/creator-tokens/optin",
        data: {
          invite_code: inviteCode,
        },
      });
      //console.log(res);
      toast.success("Success! Launch your creator token now");
      router.push("/creator-token/self-serve-explainer");
    } catch (e: any) {
      const errorCode = e.response.data.error.code;
      if (errorCode === 400) {
        toast.error("You already have a creator token!", { from: "top" });
      } else if (errorCode === 404) {
        toast.error("Invalid code", { from: "top" });
      } else if (errorCode === 410) {
        toast.error("Code expired or already used", { from: "top" });
      } else {
        toast.error("Something went wrong", { from: "top" });
      }
    } finally {
      setIsLoading(false);
      setInviteCode("");
      otpRef.current?.clear();
      2;
    }
  };

  return (
    <View tw="px-4">
      <Text tw="text-base font-bold text-gray-900 dark:text-white">
        Enter invite code to launch your creator token
      </Text>
      <View tw="flex-row items-center justify-between py-4">
        <View tw="relative mr-4 flex-1">
          <OtpInput
            ref={otpRef}
            numberOfDigits={6}
            onTextChange={(text) => setInviteCode(text)}
            focusColor={colors.indigo[500]}
            theme={{
              pinCodeTextStyle: {
                fontWeight: "bold",
                textTransform: "uppercase",
              },
            }}
          />
        </View>
        <Text
          onPress={async () => {
            try {
              const code = await Clipboard.getStringAsync();
              if (code.length === 6) {
                setInviteCode(code);
                otpRef.current?.setValue(code);
                toast.success("Pasted from clipboard");
              } else {
                toast.error("Invalid code");
              }
            } catch (e: any) {
              toast.error("No permission to paste from clipboard");
            }
          }}
          tw="text-sm font-medium text-indigo-500"
        >
          Paste
        </Text>
      </View>
      <Button
        size="regular"
        onPress={checkCode}
        disabled={inviteCode.length < 6 || isLoading}
        style={{ opacity: inviteCode.length < 6 || isLoading ? 0.5 : 1 }}
      >
        {isLoading ? "Please wait..." : "Review token"}
      </Button>
    </View>
  );
};
