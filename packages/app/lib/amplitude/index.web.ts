import * as amplitude from "@amplitude/analytics-browser";

if (process.env.NEXT_PUBLIC_AMPLITUDE_API_KEY && typeof window !== "undefined")
  amplitude.init(process.env.NEXT_PUBLIC_AMPLITUDE_API_KEY);

export { amplitude };
