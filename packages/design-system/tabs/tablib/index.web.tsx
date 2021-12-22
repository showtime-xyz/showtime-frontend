import React, { useContext } from "react";
import { View } from "../../view";
import { ScrollView, FlatList, SectionList, Animated } from "react-native";
import * as RadixTabs from "@radix-ui/react-tabs";
import { TabRootProps } from "./types";
import { tw } from "../../tailwind";

const radixTriggerStyle = {
  position: "relative",
  height: "100%",
  display: "flex",
  alignItems: "center",
} as const;

const TabsContext = React.createContext(
  null as { position: Animated.Value; offset: Animated.Value }
);
const TabIndexContext = React.createContext({} as { index: number });

const Root = ({
  children,
  initialIndex = 0,
  onIndexChange: onIndexChangeProp,
  accessibilityLabel,
}: TabRootProps) => {
  const [selected, setSelected] = React.useState(
    initialIndex.toString() ?? "0"
  );

  // Animations are mocked on web for now
  const position = React.useRef(new Animated.Value(0)).current;
  const offset = React.useRef(new Animated.Value(0)).current;

  const onIndexChange = (v) => {
    onIndexChangeProp(parseInt(v));
    setSelected(v);

    position.setValue(parseInt(v));
  };

  const { tabTriggers, tabContents, headerChild } = React.useMemo(() => {
    let tabTriggers = [];
    let tabContents = [];
    let headerChild;
    React.Children.forEach(children, (c) => {
      if (React.isValidElement(c)) {
        //@ts-ignore
        if (c.type === List) {
          //@ts-ignore
          React.Children.map(c.props.children, (c) => {
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
          React.Children.map(c.props.children, (c) => {
            tabContents.push(c);
          });
        }
      }
    });
    return { tabTriggers, headerChild, tabContents };
  }, [children]);

  return (
    <TabsContext.Provider value={{ position, offset }}>
      {headerChild}
      <RadixTabs.Root
        value={selected}
        onValueChange={onIndexChange}
        activationMode="manual"
      >
        <RadixTabs.List aria-label={accessibilityLabel} asChild>
          <ScrollView
            contentContainerStyle={[
              {
                flexDirection: "row",
                flexWrap: "nowrap",
                alignItems: "center",
                paddingHorizontal: 10,
              },
              tw.style(`bg-white dark:bg-gray-900 px-2`),
            ]}
          >
            {tabTriggers.map((t, index) => {
              const value = index.toString();
              return (
                <RadixTabs.Trigger
                  value={value}
                  key={value}
                  style={radixTriggerStyle}
                >
                  <TabIndexContext.Provider value={{ index }}>
                    <View
                      sx={{
                        alignItems: "center",
                        borderBottomWidth: 2,
                        paddingY: 8,
                      }}
                      tw={
                        selected === value
                          ? "border-b-gray-900 dark:border-b-gray-100"
                          : "border-b-transparent"
                      }
                    >
                      <View
                        style={{
                          backgroundColor:
                            selected === value
                              ? "rgba(0,0, 0, 0.1)"
                              : undefined,
                          borderRadius: 999,
                          flexDirection: "row",
                          alignItems: "center",
                          justifyContent: "center",
                          paddingHorizontal: 12,
                          paddingVertical: 12,
                        }}
                        tw={
                          selected === value
                            ? "bg-gray-200 dark:bg-gray-800"
                            : "bg-transparent"
                        }
                      >
                        {t}
                      </View>
                    </View>
                  </TabIndexContext.Provider>
                </RadixTabs.Trigger>
              );
            })}
          </ScrollView>
        </RadixTabs.List>
        {tabContents.map((c, index) => {
          const value = index.toString();
          return (
            <RadixTabs.Content key={value} value={value}>
              {c}
            </RadixTabs.Content>
          );
        })}
      </RadixTabs.Root>
    </TabsContext.Provider>
  );
};

const Header = (props) => {
  return props.children;
};

const List = () => {
  return null;
};

const Pager = () => {
  return null;
};

const Trigger = React.forwardRef((props: any, ref: any) => {
  return <View {...props} ref={ref} />;
});

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
