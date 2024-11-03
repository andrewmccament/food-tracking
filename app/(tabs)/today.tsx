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
import MealSummary from "@/components/MealSummary";
import { ProgressBar } from "@/components/ProgressBar";
import { DisplayedMacroTypes, Meal } from "@/types/openAi.types";

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
      <View style={styles.logButtonContainer}>
        <View
          style={styles.logButton}
          onTouchEnd={() => router.push("../(log)/log")}
        >
          <Text style={styles.logButtonText}>Log</Text>
        </View>
      </View>
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
  logButtonContainer: {
    height: 50,
    marginBottom: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  logButton: {
    borderColor: "#22C2F1",
    borderWidth: 1,
    width: 150,
    height: 60,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  logButtonText: {
    fontSize: 20,
    color: "black",
  },
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
