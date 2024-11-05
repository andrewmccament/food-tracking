import { Text, type TextProps, StyleSheet, StyleProp } from "react-native";

import { useThemeColor } from "@/hooks/useThemeColor";

export type ThemedTextProps = TextProps & {
  useSystemTheme?: boolean;
  alwaysDark?: boolean;
  type?: "default" | "title" | "defaultSemiBold" | "subtitle" | "link";
};

export function ThemedText({
  style,
  useSystemTheme = true,
  alwaysDark,
  type = "default",
  ...rest
}: ThemedTextProps) {
  const color = alwaysDark
    ? "black"
    : useSystemTheme
    ? useThemeColor({ light: "black", dark: "white" }, "text")
    : "white";

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
        type === "link" ? { ...styles.link, ...styles.shared } : undefined,
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
    color: "#0a7ea4",
  },
});
