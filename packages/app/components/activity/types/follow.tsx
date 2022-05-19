import { truncateWithEllipses } from "app/lib/utilities";
import { TextLink } from "app/navigation/link";

const TRUNCATE_NAME_LENGTH = 24;

function Follow({ act }) {
  const { counterparties } = act;
  const count = counterparties?.length;

  return (
    <>
      <>
        {count === 1 && (
          <>
            followed{" "}
            <TextLink
              tw="text-sm font-bold text-black dark:text-white"
              href={`/@${
                counterparties[0]?.username ?? counterparties[0]?.wallet_address
              }`}
            >
              {truncateWithEllipses(
                counterparties[0].name,
                TRUNCATE_NAME_LENGTH
              )}
            </TextLink>
            .
          </>
        )}
        {count === 2 && (
          <>
            followed{" "}
            <TextLink
              tw="text-sm font-bold text-black dark:text-white"
              href={`/@${
                counterparties[0]?.username ?? counterparties[0]?.wallet_address
              }`}
            >
              {truncateWithEllipses(
                counterparties[0].name,
                TRUNCATE_NAME_LENGTH
              )}
            </TextLink>{" "}
            and{" "}
            <TextLink
              tw="text-sm font-bold text-black dark:text-white"
              href={`/@${counterparties[1]?.wallet_address}`}
            >
              {truncateWithEllipses(
                counterparties[1].name,
                TRUNCATE_NAME_LENGTH
              )}
            </TextLink>
            .
          </>
        )}
        {count === 3 && (
          <>
            followed{" "}
            <TextLink
              tw="text-sm font-bold text-black dark:text-white"
              href={`/@${
                counterparties[0]?.username ?? counterparties[0]?.wallet_address
              }`}
            >
              {truncateWithEllipses(
                counterparties[0].name,
                TRUNCATE_NAME_LENGTH
              )}
            </TextLink>
            ,{" "}
            <TextLink
              tw="text-sm font-bold text-black dark:text-white"
              href={`/@${counterparties[1]?.wallet_address}`}
            >
              {truncateWithEllipses(
                counterparties[1].name,
                TRUNCATE_NAME_LENGTH
              )}
            </TextLink>{" "}
            and{" "}
            <TextLink
              tw="text-sm font-bold text-black dark:text-white"
              href={`/@${counterparties[2]?.wallet_address}`}
            >
              {truncateWithEllipses(
                counterparties[2].name,
                TRUNCATE_NAME_LENGTH
              )}
            </TextLink>
            .
          </>
        )}
        {count > 3 && (
          <>
            followed{" "}
            <TextLink
              tw="text-sm font-bold text-black dark:text-white"
              href={`/@${
                counterparties[0]?.username ?? counterparties[0]?.wallet_address
              }`}
            >
              {truncateWithEllipses(
                counterparties[0].name,
                TRUNCATE_NAME_LENGTH
              )}
            </TextLink>
            ,{" "}
            <TextLink
              tw="text-sm font-bold text-black dark:text-white"
              href={`/@${counterparties[1]?.wallet_address}`}
            >
              {truncateWithEllipses(
                counterparties[1].name,
                TRUNCATE_NAME_LENGTH
              )}
            </TextLink>{" "}
            and {count - 2} others.
          </>
        )}
      </>
    </>
  );
}

export { Follow };
