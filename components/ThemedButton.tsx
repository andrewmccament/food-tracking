import { useAppTheme } from "@/hooks/useAppTheme";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  StyleSheetProperties,
  StyleProp,
} from "react-native";
import { ThemedText } from "./ThemedText";

export enum ButtonStyle {
  DEFAULT = 0,
  DARK = 1,
}

export type ThemedButtonProps = {
  title: string;
  onPress: () => void;
  style?: ButtonStyle;
};

export const ThemedButton = ({ title, onPress, style }: ThemedButtonProps) => {
  const theme = useAppTheme();
  const darkStyle = style === ButtonStyle.DARK;
  return (
    <TouchableOpacity onPress={onPress} style={styles.buttonContainer}>
      <View
        style={[
          styles.button,
          {
            backgroundColor: darkStyle ? theme.surface : theme.accent,
            borderColor: darkStyle ? theme.border : theme.accent,
            shadowColor: theme.shadow,
          },
        ]}
      >
        <ThemedText
          type="defaultSemiBold"
          colorOverride={darkStyle ? theme.text : theme.textOnAccent}
        >
          {title}
        </ThemedText>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 8,
  },
  button: {
    borderWidth: 2,
    shadowRadius: 4,
    width: "75%",
    borderRadius: 128,
    justifyContent: "center",
    alignItems: "center",
    padding: 8,
  },
});
