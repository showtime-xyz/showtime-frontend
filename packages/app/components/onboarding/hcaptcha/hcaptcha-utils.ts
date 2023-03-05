export const useValidateCaptchaWithServer = async () => {
  // use axios to send the token to the backend
  // const response = await axios.post("/api/hcaptcha", {

  const validateCaptchaWithServer = async (token: string) => {
    // use axios to send the token to the backend
    // const response = await axios.post("/v1/hcaptcha", {
    //   token,
    // });
    // return response.data;
  };

  return validateCaptchaWithServer;
};
