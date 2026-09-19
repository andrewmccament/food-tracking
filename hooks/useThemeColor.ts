/**
 * Learn more about light and dark modes:
 * https://docs.expo.dev/guides/color-schemes/
 */

import { useColorScheme } from "./useColorScheme";

import { AppColorToken, getTheme } from "@/constants/Colors";

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: AppColorToken
) {
  const theme = useColorScheme() ?? "light";
  const colorFromProps = props[theme];

  if (colorFromProps) {
    return colorFromProps;
  } else {
    return getTheme(theme)[colorName];
  }
}
