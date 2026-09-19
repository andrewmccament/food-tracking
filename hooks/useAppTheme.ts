import { getTheme } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";

export const useAppTheme = () => getTheme(useColorScheme());
