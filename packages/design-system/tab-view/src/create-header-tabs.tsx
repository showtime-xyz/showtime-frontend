import React, {
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
} from "react";

import {
  NavigationState,
  Route,
  SceneRendererProps,
  TabBar,
  TabView,
  TabViewProps,
} from "react-native-tab-view/src";

import { GestureContainer, GestureContainerRef } from "./gesture-container";
import type { CollapsibleHeaderProps } from "./types";

export type HeaderTabViewRef = {};
export type HeaderTabViewProps<T extends Route> = Partial<TabViewProps<T>> &
  Pick<TabViewProps<T>, "onIndexChange" | "navigationState" | "renderScene"> &
  CollapsibleHeaderProps;

export type ForwardTabViewProps<T extends Route> = HeaderTabViewProps<T> & {
  forwardedRef: React.ForwardedRef<HeaderTabViewRef>;
  Component: React.PropsWithRef<typeof TabView>;
};

export function createHeaderTabsComponent<T extends Route>(
  Component: React.PropsWithRef<typeof TabView>
) {
  return React.forwardRef<HeaderTabViewRef, HeaderTabViewProps<T>>(
    function tabView(props, ref) {
      return (
        <CollapsibleHeaderTabView
          {...props}
          forwardedRef={ref}
          Component={Component}
        />
      );
    }
  );
}

function CollapsibleHeaderTabView<T extends Route>({
  forwardedRef,
  ...props
}: ForwardTabViewProps<T>) {
  const gestureContainerRef = useRef<GestureContainerRef>(null);
  const initialPageRef = useRef(props.navigationState.index);

  useEffect(() => {
    gestureContainerRef.current?.setCurrentIndex(props.navigationState.index);
  }, [props.navigationState.index]);

  useImperativeHandle(
    forwardedRef,
    () => ({
      // Todo: add snapTo tab view content method
    }),
    []
  );
  const _renderTabBar = useCallback(
    (
      tabbarProps: SceneRendererProps & {
        navigationState: NavigationState<T>;
      }
    ) => {
      return props?.renderTabBar ? (
        props.renderTabBar(tabbarProps)
      ) : (
        <TabBar {...tabbarProps} />
      );
    },
    [props]
  );

  const renderTabView = (e: { renderTabBarContainer: any }) => {
    const { Component, ...restProps } = props;
    return (
      <Component
        {...restProps}
        renderTabBar={(tabbarProps) =>
          e.renderTabBarContainer(_renderTabBar(tabbarProps))
        }
      />
    );
  };

  return (
    <GestureContainer
      ref={gestureContainerRef}
      initialPage={initialPageRef.current}
      renderTabView={renderTabView}
      {...props}
    />
  );
}
