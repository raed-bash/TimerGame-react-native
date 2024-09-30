import { Colors } from "@/constants/Colors";
import React from "react";
import {
  Text,
  TextInput,
  TextInputProps,
  TextProps,
  useColorScheme,
  View,
} from "react-native";

export type AppTextInputProps = TextInputProps & {
  label?: string;
  textProps?: TextProps;
};
export default function AppTextInput(props: AppTextInputProps) {
  const { label, style, textProps = {}, ...otherProps } = props;
  const { style: textStyle, ...otherTextProps } = textProps;
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === "dark";

  return (
    <View
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: 10,
      }}
    >
      <Text
        style={{
          color: isDarkMode ? Colors.dark.text : Colors.light.text,
          fontSize: 20,
          ...(typeof textStyle === "object" ? textStyle : {}),
        }}
        {...otherTextProps}
      >
        {label}
      </Text>
      <TextInput
        style={{
          padding: 1,
          borderRadius: 5,
          borderColor: "blue",
          borderWidth: 1,
          color: isDarkMode ? Colors.dark.text : Colors.light.text,
          width: 200,
          height: 40,
          fontSize: 20,
          ...(typeof style === "object" ? style : {}),
        }}
        {...otherProps}
      />
    </View>
  );
}
