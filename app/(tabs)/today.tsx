import React from "react";
import {
  Image,
  StyleSheet,
  Platform,
  ScrollView,
  Button,
  View,
} from "react-native";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { router } from "expo-router";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/state/store";
import { getSummedMacros } from "@/helpers/food-utils";
import { MacroNutrientEnum, Meal } from "@/gpt-prompts/meal-parsing";
import MealSummary from "@/components/MealSummary";
import { ProgressBar } from "@/components/ProgressBar";

export default function TodayScreen() {
  const todaysMeals = useSelector(
    (state: RootState) => state.food.todaysMeals
  ).filter((meal) => meal?.isAdded);
  const todayMacros = getSummedMacros(todaysMeals);

  return (
    <ScrollView style={styles.sheet}>
      <View style={styles.container}>
        <ThemedView style={styles.infoPanel}>
          <ProgressBar
            macro={MacroNutrientEnum.calories}
            amount={todayMacros.calories}
          />
          <ProgressBar
            macro={MacroNutrientEnum.netCarbs}
            amount={todayMacros.netCarbs}
          />
          <ProgressBar macro={MacroNutrientEnum.fat} amount={todayMacros.fat} />
          <ProgressBar
            macro={MacroNutrientEnum.protein}
            amount={todayMacros.protein}
          />
        </ThemedView>
        {todaysMeals.map((meal: Meal) => (
          <MealSummary mealId={meal.mealId} />
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  sheet: {
    backgroundColor: "#D5E1E1",
  },
  container: {
    marginHorizontal: 24,
  },
  titleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 8,
    padding: 12,
  },
  infoPanel: {
    marginTop: 24,
    borderRadius: 8,
    padding: 12,
  },
});
