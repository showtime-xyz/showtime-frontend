const DEFAULT_CHAINS = ["eip155:1"];
const REQUIRED_METHODS = ["eth_sendTransaction", "personal_sign"];
const REQUIRED_EVENTS = ["chainChanged", "accountsChanged"];

export const defaultSessionParams = {
  namespaces: {
    eip155: {
      methods: REQUIRED_METHODS,
      chains: DEFAULT_CHAINS,
      events: REQUIRED_EVENTS,
      rpcMap: {},
    },
  },
};
