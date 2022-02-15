// https://reactnavigation.org/docs/custom-navigators/#type-checking-navigators
import { Children, useCallback, cloneElement } from "react";

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  BottomTabNavigationOptions,
  BottomTabNavigationEventMap,
  BottomTabNavigationConfig,
} from "@react-navigation/bottom-tabs/lib/typescript/src/types";
import {
  createNavigatorFactory,
  DefaultNavigatorOptions,
  ParamListBase,
  TabNavigationState,
  TabRouterOptions,
} from "@react-navigation/native";
import { useRouter } from "next/router";

import { NextNavigationProps } from "../types";
import { useBuildLink } from "./build-link";

const { Navigator } = createBottomTabNavigator();

type Props = DefaultNavigatorOptions<
  ParamListBase,
  TabNavigationState<ParamListBase>,
  BottomTabNavigationOptions,
  BottomTabNavigationEventMap
> &
  TabRouterOptions &
  BottomTabNavigationConfig &
  NextNavigationProps;

function BottomTabNavigator({
  screenListeners,
  children,
  Component,
  pageProps = {},
  ...props
}: Props) {
  const nextRouter = useRouter();
  const buildLink = useBuildLink();

  const nextComponentChild = useCallback(
    (props) => {
      return <Component {...pageProps} {...props} />;
    },
    [Component, ...Object.values(pageProps)]
  );

  return (
    <Navigator
      {...props}
      screenListeners={({ navigation, route }) => ({
        ...screenListeners,
        tabPress(e) {
          if (!e.defaultPrevented && nextRouter) {
            e.preventDefault();
            const linkTo = buildLink(navigation, route.name);

            nextRouter.push(linkTo);
          }
        },
      })}
    >
      {Children.map(children, (child) => {
        if (nextRouter && Component && child) {
          return cloneElement(child as any, {
            component: undefined,
            getComponent: undefined,
            children: nextComponentChild,
          });
        }

        return child;
      })}
    </Navigator>
  );
}

export const createNextTabNavigator = createNavigatorFactory<
  TabNavigationState<ParamListBase>,
  BottomTabNavigationOptions,
  BottomTabNavigationEventMap,
  typeof BottomTabNavigator
>(BottomTabNavigator);
