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
