import * as amplitude from "@amplitude/analytics-react-native";
import * as Types from "@amplitude/analytics-types";

if (process.env.NEXT_PUBLIC_AMPLITUDE_API_KEY)
  amplitude.init(process.env.NEXT_PUBLIC_AMPLITUDE_API_KEY);

export { amplitude, Types };
