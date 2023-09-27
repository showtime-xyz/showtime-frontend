import { Text } from "@showtime-xyz/universal.text";

export const LeanText = Text;

/*
export const LeanText = ({ tw, ...rest }) => {
  const style = useMemo(() => (Array.isArray(tw) ? tw.join(" ") : tw), [tw]);

  return <BasicText tw={style} {...rest} />;
};
*/
