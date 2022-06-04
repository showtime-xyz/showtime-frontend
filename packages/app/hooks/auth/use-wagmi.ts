const useWagmi = () => {
  return {
    address: null,
    connected: false,
    loggedIn: null,
    networkChanged: null,
    signMessage: null,
    signed: null,
    provider: undefined,
    signature: null,
    signTypedDataAsync: () => {},
  };
};

export { useWagmi };
