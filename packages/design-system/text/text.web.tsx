import { ComponentProps, forwardRef, useMemo } from "react";
import { Text as DripsyText, createThemedComponent } from "dripsy";
import { StyleSheet, Text as TextType } from "react-native";
import { unstable_createElement } from "react-native-web";

// https://github.com/necolas/react-native-web/blob/master/packages/react-native-web/src/exports/View/index.js#L133
const textStyle = {
  borderWidth: 0,
  borderStyle: "solid",
  borderColor: "black",
  boxSizing: "border-box",
  color: "black",
  display: "inline",
  fontSize: 14,
  margin: 0,
  padding: 0,
  whiteSpace: "pre-wrap",
  wordWrap: "break-word",
};

const Label = (props) => {
  const style = useMemo(() => {
    return StyleSheet.flatten([textStyle, props.style]);
  }, [props.style]);

  return unstable_createElement("label", { ...props, style });
};

const ThemedLabel = createThemedComponent(Label);

type TextProps = ComponentProps<typeof DripsyText>;

export const Text = forwardRef<TextType, TextProps>(
  ({ onLayout, accessibilityRole, ...props }, ref) => {
    // @ts-ignore web only role - see label/index.web.tsx
    // onLayout won't work on Label component (removing or else RNW throws warning on console even if onLayout is undefined). Not sure if that's needed though. Will find a way to do that later.
    if (accessibilityRole === "label") {
      return <ThemedLabel {...props} ref={ref} />;
    } else {
      return (
        <DripsyText
          onLayout={onLayout}
          accessibilityRole={accessibilityRole}
          {...props}
          ref={ref}
        />
      );
    }
  }
);
