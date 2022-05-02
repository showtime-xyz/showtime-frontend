import React, { useContext, useEffect } from "react";
import {
  Animated,
  FlatList,
  Platform,
  ScrollView,
  SectionList,
} from "react-native";

import * as RadixTabs from "@radix-ui/react-tabs";

import { RecyclerListView } from "app/lib/recyclerlistview";
import { flattenChildren } from "app/utilities";

import { tw } from "../../tailwind";
import { View } from "../../view";
import { TabRootProps } from "./types";

const radixTriggerStyle = {
  position: "relative",
  height: "100%",
  display: "flex",
  alignItems: "center",
} as const;

const TabsContext = React.createContext(
  null as unknown as { position: Animated.Value; offset: Animated.Value }
);
const TabIndexContext = React.createContext({} as { index: number });

const Root = ({
  children,
  initialIndex = 0,
  onIndexChange: onIndexChangeProp,
  accessibilityLabel,
  index,
}: TabRootProps) => {
  const [selected, setSelected] = React.useState(
    initialIndex.toString() ?? "0"
  );

  // Animations are mocked on web for now
  const position = React.useRef(new Animated.Value(0)).current;
  const offset = React.useRef(new Animated.Value(0)).current;
  const onIndexChange = (v: string) => {
    onIndexChangeProp?.(parseInt(v));
    setSelected(v);
    position.setValue(parseInt(v));
  };

  useEffect(() => {
    if (typeof index === "number") {
      setSelected(index.toString());
      position.setValue(index);
    }
  }, [index]);

  const { tabTriggers, tabContents, tabPage, headerChild, listChild } =
    React.useMemo(() => {
      let tabTriggers: JSX.Element[] = [];
      let tabPage: JSX.Element | undefined;
      let tabContents: JSX.Element[] = [];
      let headerChild;
      let listChild = {};

      flattenChildren(children).forEach((c) => {
        if (React.isValidElement(c)) {
          //@ts-ignore
          if (c.type === List) {
            listChild = c;
            //@ts-ignore
            flattenChildren(c.props.children).forEach((c) => {
              if (React.isValidElement(c) && c && c.type === Trigger) {
                tabTriggers.push(c);
              }
            });
            //@ts-ignore
          } else if (c.type === Header) {
            headerChild = c;
            //@ts-ignore
          } else if (c.type === Pager) {
            //@ts-ignore
            tabPage = c;
            flattenChildren(c.props.children).forEach((c) =>
              tabContents.push(c as JSX.Element)
            );
          }
        }
      });
      return { tabTriggers, headerChild, tabContents, listChild, tabPage };
    }, [children]);

  return (
    <TabsContext.Provider value={{ position, offset }}>
      <RadixTabs.Root
        value={selected}
        onValueChange={onIndexChange}
        activationMode="manual"
        style={tw.style("w-full")}
      >
        {headerChild}
        <View tw="flex flex-1 flex-row justify-center bg-white dark:bg-black">
          <View tw="w-full max-w-screen-xl">
            <RadixTabs.List
              aria-label={accessibilityLabel}
              style={tw.style("")}
              asChild
            >
              <ScrollView
                {...(listChild as any).props}
                horizontal
                contentContainerStyle={[
                  tw.style(
                    `bg-white dark:bg-black flex h-full px-2.5 items-center flex-row flex-nowrap`
                  ),
                  (listChild as any).props?.contentContainerStyle,
                ]}
              >
                {tabTriggers.map((t, index) => {
                  const value = index.toString();

                  return (
                    <RadixTabs.Trigger
                      value={value}
                      key={value}
                      style={radixTriggerStyle}
                      {...t.props}
                    >
                      <TabIndexContext.Provider value={{ index }}>
                        <View
                          sx={tw.style(
                            "item items-center border-b-2 h-full justify-center"
                          )}
                          tw={
                            selected === value
                              ? "border-b-gray-900 dark:border-b-gray-100"
                              : "border-b-transparent"
                          }
                        >
                          {t}
                        </View>
                      </TabIndexContext.Provider>
                    </RadixTabs.Trigger>
                  );
                })}
              </ScrollView>
            </RadixTabs.List>
          </View>
        </View>
        <View tw="w-full items-center">
          <View tw={`w-full max-w-screen-xl ${tabPage?.props.tw}`}>
            {tabContents.map((c, index) => {
              const value = index.toString();
              return (
                <RadixTabs.Content key={value} value={value}>
                  {c}
                </RadixTabs.Content>
              );
            })}
          </View>
        </View>
      </RadixTabs.Root>
    </TabsContext.Provider>
  );
};

const Header = (props: { children: JSX.Element }) => {
  return props.children;
};

const List = () => {
  return null;
};

const Pager = ({ tw }: { tw?: string }) => {
  return null;
};

const Trigger = React.forwardRef((props: any, ref: any) => {
  return <View {...props} ref={ref} />;
});

const TabRecyclerListView = React.memo(
  React.forwardRef((props, ref) => {
    return (
      // @ts-ignore
      <RecyclerListView
        {...props}
        // @ts-ignore
        ref={ref}
        useWindowScroll={Platform.OS === "web"}
      />
    );
  })
);

TabRecyclerListView.displayName = "TabRecyclerListView";

export const Tabs = {
  Root,
  Header,
  Pager,
  ScrollView: ScrollView,
  FlatList: FlatList,
  SectionList: SectionList,
  Trigger,
  View,
  List,
  RecyclerList: TabRecyclerListView as any,
};

export const useTabsContext = () => {
  const ctx = useContext(TabsContext);

  if (ctx === null) {
    console.error("Make sure useTabsContext is rendered within Tabs.Root");
  }

  return ctx;
};

export const useTabIndexContext = () => {
  const ctx = useContext(TabIndexContext);

  if (ctx === null) {
    console.error(
      "Make sure useTabIndexContext is rendered within Tabs.Trigger"
    );
  }

  return ctx;
};
