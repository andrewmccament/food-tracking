import { Colors } from "@/constants/Colors";
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
  return (
    <TouchableOpacity onPress={onPress} style={styles.buttonContainer}>
      <View
        style={{
          ...styles.button,
          backgroundColor: style === 1 ? "black" : "black",
        }}
      >
        <ThemedText
          type="defaultSemiBold"
          style={{ color: style === 1 ? "white" : "white" }}
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
    borderColor: Colors.themeColor,
    backgroundColor: "black",
    borderWidth: 2,
    shadowRadius: 4,
    shadowColor: "gray",
    width: "75%",
    borderRadius: 128,
    justifyContent: "center",
    alignItems: "center",
    padding: 8,
  },
});
