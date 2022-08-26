export const onMagicLoad = () => {
  registeredCallbacks.forEach((c: any) => c());
};

const registeredCallbacks: any = [];

export const registerOnMagicLoad = (cb: any) => {
  registeredCallbacks.push(cb);
  return () => {
    registeredCallbacks.filter((c) => c !== cb);
  };
};
