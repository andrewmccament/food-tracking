import { Text, type TextProps, StyleSheet, StyleProp } from "react-native";

import { useAppTheme } from "@/hooks/useAppTheme";

export type ThemedTextProps = TextProps & {
  colorOverride?: string;
  type?: "default" | "title" | "defaultSemiBold" | "subtitle" | "link";
};

export function ThemedText({
  style,
  colorOverride,
  type = "default",
  ...rest
}: ThemedTextProps) {
  const theme = useAppTheme();
  const color = colorOverride ?? theme.text;

  return (
    <Text
      style={[
        { color },
        type === "default"
          ? { ...styles.default, ...styles.shared }
          : undefined,
        type === "title" ? { ...styles.title, ...styles.shared } : undefined,
        type === "defaultSemiBold"
          ? { ...styles.defaultSemiBold, ...styles.shared }
          : undefined,
        type === "subtitle"
          ? { ...styles.subtitle, ...styles.shared }
          : undefined,
        type === "link"
          ? { ...styles.link, ...styles.shared, color: theme.accent }
          : undefined,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  shared: {
    fontFamily: "arial",
  },
  default: {
    fontSize: 16,
    lineHeight: 24,
  },
  defaultSemiBold: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "600",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    lineHeight: 32,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  link: {
    lineHeight: 30,
    fontSize: 16,
  },
});
