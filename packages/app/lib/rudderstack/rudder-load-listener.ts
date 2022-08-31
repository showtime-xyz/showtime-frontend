export const onRudderLoad = () => {
  registeredCallbacks.forEach((c: any) => c());
};

const registeredCallbacks: any = [];

export const registerOnRudderLoad = (cb: any) => {
  registeredCallbacks.push(cb);
  return () => {
    registeredCallbacks.filter((c) => c !== cb);
  };
};
