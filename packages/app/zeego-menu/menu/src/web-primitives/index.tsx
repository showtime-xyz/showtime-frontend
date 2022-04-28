import React from "react";
import { Text, View } from "react-native";

import { pickChildren } from "../children";
import { MenuDisplayName } from "../display-names";
import type {
  MenuItemProps,
  MenuItemSubtitleProps,
  MenuItemTitleProps,
} from "../types";

const ItemPrimitive = ({ children, style }: MenuItemProps) => {
  const titleChildren = pickChildren(children, ItemTitle);

  let title = <></>;
  if (typeof children == "string") {
    // not encouraged usage. might remove later. don't document
    // ItemTitle should be used directly instead.
    title = <ItemTitle>{children}</ItemTitle>;
  } else {
    title = titleChildren.targetChildren?.[0] ?? <></>;
  }

  return (
    <View style={style}>
      {title}
      {titleChildren.withoutTargetChildren.filter(
        (child) => typeof child != "string"
      )}
    </View>
  );
};

const ItemTitle = ({ children, style }: MenuItemTitleProps) => {
  return (
    <Text style={style} selectable={false}>
      {children}
    </Text>
  );
};
ItemTitle.displayName = MenuDisplayName.ItemTitle;

const ItemSubtitle = ({ children, style }: MenuItemSubtitleProps) => {
  return (
    <Text style={style} selectable={false}>
      {children}
    </Text>
  );
};
ItemSubtitle.displayName = MenuDisplayName.ItemSubtitle;

export { ItemPrimitive, ItemSubtitle, ItemTitle };
