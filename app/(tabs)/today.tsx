import React from "react";
import { Image, StyleSheet, Platform, ScrollView, Button } from "react-native";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { router } from "expo-router";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/state/store";
import { getSummedMacros } from "@/helpers/food-utils";
import { Meal } from "@/gpt-prompts/meal-parsing";

export default function TodayScreen() {
  const todaysMeals = useSelector((state: RootState) => state.food.todaysMeals);
  const todayMacros = getSummedMacros(todaysMeals);

  return (
    <ScrollView style={styles.sheet}>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Today</ThemedText>
        <Button title="Log" onPress={() => router.push("../(log)/log")} />
      </ThemedView>
      <ThemedView style={styles.infoPanel}>
        <ThemedText>{`Calories: ${todayMacros.calories}/1850`}</ThemedText>
        <ThemedText>{`Carbohydrates: ${todayMacros.carbs}/20`}</ThemedText>
        <ThemedText>{`Protein: ${todayMacros.protein}/180g`}</ThemedText>
        <ThemedText>{`Fat: ${todayMacros.fat}/150g`}</ThemedText>
      </ThemedView>
      {todaysMeals.map((meal: Meal) => (
        <ThemedView style={styles.infoPanel}>
          <ThemedText type="subtitle">
            {meal.meal}
            <ThemedText type="defaultSemiBold">{` (${
              getSummedMacros([meal]).calories
            } calories) `}</ThemedText>
          </ThemedText>
          <ThemedText>{meal.summary}</ThemedText>
        </ThemedView>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  sheet: {
    margin: 24,
    gap: 24,
  },
  titleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderRadius: 8,
    padding: 12,
  },
  infoPanel: {
    marginTop: 24,
    borderRadius: 8,
    padding: 12,
  },
});
