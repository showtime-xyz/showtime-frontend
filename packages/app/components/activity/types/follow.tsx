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
              variant="text-sm"
              tw="text-black dark:text-white font-bold"
              href={`/profile/${counterparties[0]?.wallet_address}`}
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
              variant="text-sm"
              tw="text-black dark:text-white font-bold"
              href={`/profile/${counterparties[0]?.wallet_address}`}
            >
              {truncateWithEllipses(
                counterparties[0].name,
                TRUNCATE_NAME_LENGTH
              )}
            </TextLink>{" "}
            and{" "}
            <TextLink
              variant="text-sm"
              tw="text-black dark:text-white font-bold"
              href={`/profile/${counterparties[1]?.wallet_address}`}
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
              variant="text-sm"
              tw="text-black dark:text-white font-bold"
              href={`/profile/${counterparties[0]?.wallet_address}`}
            >
              {truncateWithEllipses(
                counterparties[0].name,
                TRUNCATE_NAME_LENGTH
              )}
            </TextLink>
            ,{" "}
            <TextLink
              variant="text-sm"
              tw="text-black dark:text-white font-bold"
              href={`/profile/${counterparties[1]?.wallet_address}`}
            >
              {truncateWithEllipses(
                counterparties[1].name,
                TRUNCATE_NAME_LENGTH
              )}
            </TextLink>{" "}
            and{" "}
            <TextLink
              variant="text-sm"
              tw="text-black dark:text-white font-bold"
              href={`/profile/${counterparties[2]?.wallet_address}`}
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
              variant="text-sm"
              tw="text-black dark:text-white font-bold"
              href={`/profile/${counterparties[0]?.wallet_address}`}
            >
              {truncateWithEllipses(
                counterparties[0].name,
                TRUNCATE_NAME_LENGTH
              )}
            </TextLink>
            ,{" "}
            <TextLink
              variant="text-sm"
              tw="text-black dark:text-white font-bold"
              href={`/profile/${counterparties[1]?.wallet_address}`}
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
