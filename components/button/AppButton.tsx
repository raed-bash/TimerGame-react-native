import React from "react";
import {
  Pressable,
  Text,
  StyleSheet,
  View,
  PressableProps,
  ColorValue,
  TextProps,
} from "react-native";
import { StyleProps } from "react-native-reanimated";

export type AppButtonProps = Omit<
  PressableProps & React.RefAttributes<View>,
  "children" | "style"
> & {
  children?: string;
  color?: ColorValue;
  style?: StyleProps;
  textProps?: TextProps;
};

export default function AppButton(props: AppButtonProps) {
  const {
    children,
    color,
    style: PressableProps,
    textProps = {},
    ...othreProps
  } = props;
  const { style: textStyle = {}, ...otherTextProps } = textProps;

  return (
    <Pressable
      style={({ pressed }) => [
        {
          backgroundColor: pressed ? "lightgray" : color || "blue",
        },
        styles.button,
        PressableProps,
      ]}
      {...othreProps}
    >
      <Text
        style={{
          ...styles.text,
          ...(typeof textStyle === "object" ? textStyle : {}),
        }}
        {...otherTextProps}
      >
        {children}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: 10,
    borderRadius: 5,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    color: "white",
  },
});
