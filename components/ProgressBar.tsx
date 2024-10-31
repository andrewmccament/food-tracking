import { MacroNutrientEnum, MacroNutrients } from "@/gpt-prompts/meal-parsing";
import { RootState } from "@/state/store";
import { useSelector, useDispatch } from "react-redux";
import { StyleProp, StyleSheet, Text, View, ViewStyle } from "react-native";
import {
  getColorForMacro,
  getPrettyNameForMacro,
  getPrettyUnitsForMacro,
} from "@/helpers/macronutrients";

type ProgressBarProps = {
  macro: MacroNutrientEnum;
  amount: number;
  max?: number;
};
export const ProgressBar = ({ macro, amount, max }: ProgressBarProps) => {
  const goals = useSelector((state: RootState) => state.userData.goals);
  const thisMacroGoal = max ?? goals[macro];
  const percent = Math.min((amount / thisMacroGoal) * 100, 100).toString();
  const barColor = getColorForMacro(macro);

  const getInnerBarStyling = () => {
    return {
      width: `${percent}%`,
      height: "100%",
      backgroundColor: barColor,
      zIndex: 100,
      borderRadius: 2,
    } as StyleProp<ViewStyle>;
  };
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{`${getPrettyNameForMacro(
        macro
      )}: ${amount}${getPrettyUnitsForMacro(macro)}`}</Text>
      <View style={styles.barContainer}>
        <View style={styles.outerBar}>
          <View style={getInnerBarStyling()} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  outerBar: {
    width: "100%",
    height: "100%",
    backgroundColor: "#CACACA",
    zIndex: 0,
    borderRadius: 2,
  },
  barContainer: {
    width: "60%",
    height: 12,
    padding: 2,
  },
  text: {
    width: "40%",
  },
  container: {
    flexDirection: "row",
    paddingRight: 8,
    alignItems: "center",
  },
});
