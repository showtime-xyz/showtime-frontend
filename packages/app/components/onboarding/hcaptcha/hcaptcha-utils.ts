import { useCallback } from "react";

import { useRouter } from "@showtime-xyz/universal.router";

import { useRedirectToClaimDrop } from "app/hooks/use-redirect-to-claim-drop";
import { axios } from "app/lib/axios";

export const useValidateCaptchaWithServer = () => {
  async function validate(token?: string) {
    if (!token) return Promise.reject(new Error("No token provided"));

    return await axios({
      url: "/v1/profile/captcha/verify",
      method: "POST",
      data: {
        hcaptcha_response_token: token,
      },
    });
  }

  return { validate };
};

export const useFinishOnboarding = () => {
  const router = useRouter();
  const redirectToClaimDrop = useRedirectToClaimDrop();

  const finishOnboarding = useCallback(
    (redirectUri?: string) => {
      console.log(redirectUri);
      if (redirectUri) {
        if (redirectUri.includes("/claim/")) {
          router.pop();
          // wait for the router to pop
          setTimeout(() => {
            const address = redirectUri.replace(/^\/claim\//, "");
            redirectToClaimDrop(address);
          }, 1000);
        } else {
          router.replace(redirectUri);
        }
      } else {
        router.pop();
      }
    },
    [redirectToClaimDrop, router]
  );

  return finishOnboarding;
};
