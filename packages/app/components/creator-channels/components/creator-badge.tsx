import { LeanText, LeanView } from "./lean-text";

export const CreatorBadge = () => {
  return (
    <LeanView tw="rounded-md bg-[#CE8903] px-2 py-1.5">
      <LeanView tw="flex-row items-center justify-center">
        <LeanText
          tw="text-xs font-medium text-white"
          style={{ lineHeight: 14 }}
        >
          Creator
        </LeanText>
      </LeanView>
    </LeanView>
  );
};
