import { RootState } from "@/state/store";
import { useSelector, useDispatch } from "react-redux";
import { StyleProp, StyleSheet, Text, View, ViewStyle } from "react-native";
import {
  DisplayedMacroConfig,
  DisplayedMacroTypes,
} from "@/types/openAi.types";
import React from "react";
import { ThemedText } from "../ThemedText";

export enum ProgressBarStyles {
  DEFAULT = 0,
  REVERSED = 1,
  FULL_SCREEN = 2,
}

export type ProgressBarProps = {
  macro: DisplayedMacroTypes;
  amount: number;
  max?: number;
  textStyle?: any;
  style?: ProgressBarStyles;
};

export const ProgressBar = ({
  macro,
  amount,
  max,
  textStyle,
  style = ProgressBarStyles.DEFAULT,
}: ProgressBarProps) => {
  const goals = useSelector((state: RootState) => state.userData.goals);
  const thisMacroGoal = max ?? goals[macro];
  const percent = Math.min((amount / thisMacroGoal) * 100, 100).toString();
  const barColor = DisplayedMacroConfig.find(
    (macroConfig) => macroConfig.type === macro
  )?.color;

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
    <View
      style={{
        ...styles.container,
        flexDirection:
          style === ProgressBarStyles.DEFAULT ? "row" : "row-reverse",
      }}
    >
      {style !== ProgressBarStyles.FULL_SCREEN && (
        <ThemedText
          useSystemTheme
          style={{
            ...styles.text,
            ...textStyle,
            textAlign: style === ProgressBarStyles.DEFAULT ? "left" : "right",
          }}
        >{`${
          DisplayedMacroConfig.find((macroConfig) => macroConfig.type === macro)
            ?.displayName
        }: ${amount}${
          DisplayedMacroConfig.find((macroConfig) => macroConfig.type === macro)
            ?.shortUnit
        }`}</ThemedText>
      )}
      <View
        style={{
          ...styles.barContainer,
          width: style === ProgressBarStyles.FULL_SCREEN ? "100%" : "60%",
        }}
      >
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
