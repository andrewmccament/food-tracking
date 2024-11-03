import React from "react";
import {
  Image,
  StyleSheet,
  Platform,
  ScrollView,
  Button,
  View,
  Text,
} from "react-native";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { router } from "expo-router";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/state/store";
import { getSummedMacros, sortMealsByCategory } from "@/helpers/food-utils";
import MealSummary from "@/components/Shared/MealSummary";
import { ProgressBar } from "@/components/Shared/ProgressBar";
import { DisplayedMacroTypes, Meal } from "@/types/openAi.types";
import { ThemedButton } from "@/components/ThemedButton";

export default function TodayScreen() {
  const date = new Date();
  const todayDate = `${date.getFullYear()}${
    date.getMonth() + 1
  }${date.getDate()}`;
  let todaysMeals = useSelector(
    (state: RootState) => state.food.todaysMeals
  ).filter((meal) => meal?.isAdded && meal?.date === todayDate);
  todaysMeals = sortMealsByCategory(todaysMeals);
  const todayMacros = getSummedMacros(todaysMeals);

  return (
    <View style={styles.todayContainer}>
      <ScrollView style={styles.todayListContainer}>
        <View style={styles.todayListContainer}>
          <ThemedView style={styles.infoPanel}>
            <ProgressBar
              macro={DisplayedMacroTypes.calories}
              amount={todayMacros.calories}
            />
            <ProgressBar
              macro={DisplayedMacroTypes.net_carbohydrates}
              amount={todayMacros.net_carbohydrates}
            />
            <ProgressBar
              macro={DisplayedMacroTypes.fat}
              amount={todayMacros.fat}
            />
            <ProgressBar
              macro={DisplayedMacroTypes.protein}
              amount={todayMacros.protein}
            />
          </ThemedView>
          {todaysMeals.map((meal: Meal, index) => (
            <MealSummary mealId={meal.mealId} key={index} />
          ))}
        </View>
      </ScrollView>
      <ThemedButton
        title="Log Food"
        onPress={() => router.push("../(log)/log")}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  todayContainer: {
    flexDirection: "column",
    flex: 1,
    backgroundColor: "#D5E1E1",
  },
  todayListContainer: {
    flex: 1,
  },
  logButtonContainer: {},
  todayList: {
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
    marginTop: 12,
    borderRadius: 8,
    padding: 12,
  },
});
