import { useCallback, useMemo, useRef, useState, useEffect } from "react";
import { Platform } from "react-native";

import { useRouting } from "expo-next-react-navigation";
import Router from "next/router";

function useStable<T>(value: T) {
  const ref = useRef(value);
  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref;
}

type Config<
  Props extends Record<string, unknown>,
  Required extends boolean,
  ParsedType,
  InitialValue
> = (Required extends false
  ? {
      parse?: (value?: string) => ParsedType;
    }
  : {
      parse: (value?: string) => ParsedType;
    }) & {
  stringify?: (value: ParsedType) => string;
  initial: InitialValue;
  paramsToClearOnSetState?: (keyof Props)[];
};

type Params<
  Props extends Record<string, unknown> = Record<string, string>,
  Name extends keyof Props = keyof Props,
  NullableUnparsedParsedType extends Props[Name] | undefined =
    | Props[Name]
    | undefined,
  ParseFunction extends
    | undefined
    | ((value?: string) => NonNullable<NullableUnparsedParsedType>) = (
    value?: string
  ) => NonNullable<NullableUnparsedParsedType>,
  InitialValue = NullableUnparsedParsedType | undefined,
  ParsedType = InitialValue extends undefined
    ? NullableUnparsedParsedType
    : ParseFunction extends undefined
    ? NullableUnparsedParsedType
    : NonNullable<NullableUnparsedParsedType>
> = NonNullable<ParsedType> extends string
  ?
      | [name: Name, config: Config<Props, false, ParsedType, InitialValue>]
      | [name: Name]
  : [name: Name, config: Config<Props, true, ParsedType, InitialValue>];

type Returns<
  Props extends Record<string, unknown> = Record<string, string>,
  Name extends keyof Props = keyof Props,
  NullableUnparsedParsedType extends Props[Name] | undefined =
    | Props[Name]
    | undefined,
  ParseFunction extends
    | undefined
    | ((value?: string) => NonNullable<NullableUnparsedParsedType>) = (
    value?: string
  ) => NonNullable<NullableUnparsedParsedType>,
  InitialValue = NullableUnparsedParsedType | undefined,
  ParsedType = InitialValue extends undefined
    ? NullableUnparsedParsedType
    : ParseFunction extends undefined
    ? NullableUnparsedParsedType
    : NonNullable<NullableUnparsedParsedType>
> = readonly [
  state: ParsedType | InitialValue,
  setState: (value: ParsedType) => void
];

export function createParam<
  Props extends Record<string, unknown> = Record<string, string>
>() {
  function useParam<
    Name extends keyof Props,
    NullableUnparsedParsedType extends Props[Name] | undefined =
      | Props[Name]
      | undefined,
    ParseFunction extends
      | undefined
      | ((value?: string) => NonNullable<NullableUnparsedParsedType>) = (
      value?: string
    ) => NonNullable<NullableUnparsedParsedType>,
    InitialValue = NullableUnparsedParsedType | undefined,
    ParsedType = InitialValue extends undefined
      ? NullableUnparsedParsedType
      : ParseFunction extends undefined
      ? NullableUnparsedParsedType
      : NonNullable<NullableUnparsedParsedType>
  >(
    ...[name, maybeConfig]: Params<
      Props,
      Name,
      NullableUnparsedParsedType,
      ParseFunction,
      InitialValue,
      ParsedType
    >
  ): Returns<
    Props,
    Name,
    NullableUnparsedParsedType,
    ParseFunction,
    InitialValue,
    ParsedType
  > {
    const {
      parse,
      initial,
      stringify = (value: ParsedType) => `${value}`,
      paramsToClearOnSetState,
    } = maybeConfig || {};
    const router = useRouting();
    const [nativeState, setNativeState] = useState<ParsedType | InitialValue>(
      (initial as InitialValue) ?? router?.params?.[name as string]
    );

    const stableStringify = useStable(stringify);
    const stableParse = useStable(parse);
    const stableParamsToClear = useStable(paramsToClearOnSetState);

    const initialValue = useRef(initial);
    const hasSetState = useRef(false);

    const setState = useCallback(
      (value: ParsedType) => {
        hasSetState.current = true;
        const { pathname, query } = Router;
        const newQuery = { ...query };
        if (value != null) {
          newQuery[name as string] = stableStringify.current(value);
        } else {
          delete newQuery[name as string];
        }

        if (stableParamsToClear.current) {
          for (const paramKey of stableParamsToClear.current) {
            delete newQuery[paramKey as string];
          }
        }

        const willChangeExistingParam =
          query[name as string] && newQuery[name as string];

        const action = willChangeExistingParam ? Router.replace : Router.push;

        action(
          {
            pathname,
            query: newQuery,
          },
          undefined,
          {
            shallow: true,
          }
        );
      },
      [name, stableStringify, stableParamsToClear]
    );

    useEffect(() => {
      setNativeState(router?.params?.[name]);
    }, [name, router?.params]);

    const webParam: string | undefined = router.getParam(name as string);

    const state = useMemo<ParsedType>(() => {
      let state: ParsedType;
      if (webParam === undefined && !hasSetState.current) {
        state = initialValue.current as any;
      } else if (stableParse.current) {
        state = stableParse.current?.(webParam);
      } else {
        state = webParam as any;
      }
      return state;
    }, [stableParse, webParam]);

    if (Platform.OS !== "web") {
      return [nativeState, setNativeState];
    }

    return [state, setState];
  }

  return {
    useParam,
  };
}
