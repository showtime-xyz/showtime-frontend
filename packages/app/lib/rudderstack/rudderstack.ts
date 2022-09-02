import rudder from "@rudderstack/rudder-sdk-react-native";

function useRudder() {
  return { rudder } as { rudder: typeof rudder };
}

export { useRudder };
