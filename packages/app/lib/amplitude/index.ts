import * as amplitude from "@amplitude/analytics-react-native";

if (process.env.NEXT_PUBLIC_AMPLITUDE_API_KEY)
  amplitude.init(process.env.NEXT_PUBLIC_AMPLITUDE_API_KEY);

export { amplitude };
