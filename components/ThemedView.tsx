import { View, type ViewProps } from "react-native";

import { useAppTheme } from "@/hooks/useAppTheme";
import { useColorScheme } from "@/hooks/useColorScheme";

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
};

export function ThemedView({
  style,
  lightColor,
  darkColor,
  ...otherProps
}: ThemedViewProps) {
  const theme = useAppTheme();
  const backgroundColor =
    useColorScheme() === "dark"
      ? darkColor ?? theme.background
      : lightColor ?? theme.background;

  return <View style={[{ backgroundColor }, style]} {...otherProps} />;
}
